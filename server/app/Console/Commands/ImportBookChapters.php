<?php

namespace App\Console\Commands;

use App\Models\BookChapter;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ImportBookChapters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bible:import-chapters
                            {--path= : Path to the books JSON, relative to the app root (default: ../data/bible-books.json)}
                            {--fresh : Delete every existing row before importing}
                            {--dry-run : Read and validate the JSON without writing to the database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate the book_chapters table from the Bible books JSON';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $path = $this->resolvePath((string) $this->option('path'));

        if (! is_file($path)) {
            $this->error("No JSON file found at: {$path}");

            return self::FAILURE;
        }

        try {
            $rows = $this->rowsFromJson($path);
        } catch (RuntimeException $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info(sprintf(
            'Parsed %s chapters (%s verses) from %s',
            number_format(count($rows)),
            number_format(array_sum(array_column($rows, 'num_verses'))),
            $path,
        ));

        if ($this->option('dry-run')) {
            $this->comment('Dry run: the database was not touched.');

            return self::SUCCESS;
        }

        [$inserted, $updated] = DB::transaction(function () use ($rows): array {
            if ($this->option('fresh')) {
                BookChapter::query()->delete();
            }

            // Load the current state once, then write in bulk: a per-row
            // updateOrCreate would mean two round trips for each of the
            // 1189 chapters, which is slow against a remote database.
            $existing = BookChapter::query()
                ->get(['id', 'book', 'chapter_number', 'num_verses'])
                ->keyBy(fn (BookChapter $chapter): string => $chapter->book.'|'.$chapter->chapter_number);

            $new = [];
            $changed = [];

            foreach ($rows as $row) {
                $chapter = $existing[$row['book'].'|'.$row['chapter_number']] ?? null;

                if ($chapter === null) {
                    $new[] = $row;
                } elseif ((int) $chapter->num_verses !== $row['num_verses']) {
                    $changed[] = ['id' => $chapter->id, 'num_verses' => $row['num_verses']];
                }
            }

            $now = now();

            foreach (array_chunk($new, 500) as $chunk) {
                BookChapter::insert(array_map(
                    fn (array $row): array => $row + ['created_at' => $now, 'updated_at' => $now],
                    $chunk,
                ));
            }

            foreach ($changed as $row) {
                BookChapter::query()->whereKey($row['id'])->update(['num_verses' => $row['num_verses']]);
            }

            return [count($new), count($changed)];
        });

        $this->info("Imported {$inserted} new chapter(s) and corrected {$updated} verse count(s).");

        $stale = BookChapter::query()->count() - count($rows);

        if ($stale > 0) {
            $this->warn("{$stale} row(s) in book_chapters are not in this file. Run with --fresh to rebuild the table from scratch.");
        }

        return self::SUCCESS;
    }

    /**
     * Resolve the JSON path, treating relative paths as app-root relative.
     */
    private function resolvePath(string $path): string
    {
        if ($path === '') {
            return base_path('../data/bible-books.json');
        }

        $isAbsolute = str_starts_with($path, '/') || preg_match('#^[A-Za-z]:[\\\\/]#', $path) === 1;

        return $isAbsolute ? $path : base_path($path);
    }

    /**
     * Turn the books JSON into book_chapters rows.
     *
     * @return array<int, array{book: string, chapter_number: int, num_verses: int}>
     */
    private function rowsFromJson(string $path): array
    {
        $decoded = json_decode((string) file_get_contents($path), true);

        if (! is_array($decoded) || ! is_array($decoded['books'] ?? null)) {
            throw new RuntimeException("The file at {$path} does not look like a books JSON file (expected a top-level \"books\" array).");
        }

        $rows = [];

        foreach ($decoded['books'] as $index => $book) {
            $name = is_array($book) ? ($book['name'] ?? null) : null;
            $versesPerChapter = is_array($book) ? ($book['versesPerChapter'] ?? null) : null;

            if (! is_string($name) || $name === '') {
                throw new RuntimeException('Book #'.($index + 1).' has no name.');
            }

            if (! is_array($versesPerChapter) || $versesPerChapter === []) {
                throw new RuntimeException("{$name} has no versesPerChapter list.");
            }

            foreach ($versesPerChapter as $chapter => $numVerses) {
                if (! is_int($numVerses) || $numVerses < 1) {
                    throw new RuntimeException("{$name} ".($chapter + 1).' has an invalid verse count.');
                }

                $rows[] = [
                    'book' => $name,
                    'chapter_number' => $chapter + 1,
                    'num_verses' => $numVerses,
                ];
            }
        }

        if ($rows === []) {
            throw new RuntimeException("No chapters were found in {$path}.");
        }

        return $rows;
    }
}
