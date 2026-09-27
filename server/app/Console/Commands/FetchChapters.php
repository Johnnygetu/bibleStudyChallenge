<?php

namespace App\Console\Commands;

use App\Models\BookChapter;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

#[Signature('app:fetch-chapters {--path= : Where to write the JSON, relative to the app root (default: ../data/bible-chapters.json)}')]
#[Description('Write every row from the book_chapters table to a JSON file')]
class FetchChapters extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $chapters = BookChapter::query()
            ->orderBy('id')
            ->get(['id', 'book', 'chapter_number', 'num_verses']);

        if ($chapters->isEmpty()) {
            $this->error('The book_chapters table is empty, so there is nothing to export.');

            return self::FAILURE;
        }

        $path = $this->resolvePath((string) $this->option('path'));

        // Keep the shape predictable: one entry per chapter row, in the same
        // order the rows were inserted (canonical book order after an import).
        $payload = [
            'generatedAt' => now()->toIso8601String(),
            'totalBooks' => $chapters->pluck('book')->unique()->count(),
            'totalChapters' => $chapters->count(),
            'totalVerses' => (int) $chapters->sum('num_verses'),
            'chapters' => $chapters->map(fn (BookChapter $chapter): array => [
                'id' => $chapter->id,
                'book' => $chapter->book,
                'chapter_number' => $chapter->chapter_number,
                'num_verses' => $chapter->num_verses,
            ])->all(),
        ];

        try {
            File::ensureDirectoryExists(dirname($path));

            $json = json_encode(
                $payload,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
            );

            File::put($path, $json.PHP_EOL);
        } catch (\Exception $exception) {
            $this->error("Could not write the chapters JSON to {$path}: {$exception->getMessage()}");

            return self::FAILURE;
        }

        $this->info(sprintf(
            'Wrote %s chapters (%s verses across %s books) to %s (%s KB).',
            number_format($payload['totalChapters']),
            number_format($payload['totalVerses']),
            number_format($payload['totalBooks']),
            $path,
            number_format(File::size($path) / 1024, 1),
        ));

        return self::SUCCESS;
    }

    /**
     * Resolve the JSON path, treating relative paths as app-root relative.
     */
    private function resolvePath(string $path): string
    {
        if ($path === '') {
            return base_path('../data/bible-chapters.json');
        }

        $isAbsolute = str_starts_with($path, '/') || preg_match('#^[A-Za-z]:[\\\\/]#', $path) === 1;

        return $isAbsolute ? $path : base_path($path);
    }
}
