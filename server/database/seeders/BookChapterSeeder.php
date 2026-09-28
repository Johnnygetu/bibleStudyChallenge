<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookChapterSeeder extends Seeder
{
    /**
     * Seed the book_chapters table from bible-chapters.json.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/bible-chapters.json');

        if (! file_exists($jsonPath)) {
            $this->command->error("Bible chapters file not found at: {$jsonPath}");
            return;
        }

        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        $chapters = $data['chapters'];

        // Insert in chunks of 100 for performance
        $chunks = array_chunk($chapters, 100);

        foreach ($chunks as $chunk) {
            $rows = array_map(function ($chapter) {
                return [
                    'id'             => $chapter['id'],
                    'book'           => $chapter['book'],
                    'chapter_number' => $chapter['chapter_number'],
                    'num_verses'     => $chapter['num_verses'],
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ];
            }, $chunk);

            DB::table('book_chapters')->insertOrIgnore($rows);
        }

        $this->command->info('Seeded ' . count($chapters) . ' book chapters.');
    }
}
