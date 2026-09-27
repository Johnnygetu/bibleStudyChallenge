<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use App\Models\ChronologicalOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ChronologicalOrderController extends Controller
{
    /**
     * Display a listing of chronological order entries with their book chapter.
     */
    public function index(): JsonResponse
    {
        $entries = ChronologicalOrder::with('chapter')
            ->orderBy('id')
            ->get();

        return response()->json($entries);
    }

    /**
     * Fetch BookChapters in the given range of IDs and insert them into chronological_order.
     */
    public function storeRange(Request $request, ?string $start_id = null, ?string $end_id = null): JsonResponse
    {
        $startingId = $start_id
            ?? $request->route('starting_id')
            ?? $request->route('start_id')
            ?? $request->input('starting_id')
            ?? $request->input('start_id')
            ?? $request->input('from');

        $endingId = $end_id
            ?? $request->route('ending_id')
            ?? $request->route('end_id')
            ?? $request->input('ending_id')
            ?? $request->input('end_id')
            ?? $request->input('to');

        $validator = Validator::make([
            'starting_id' => $startingId,
            'ending_id' => $endingId,
        ], [
            'starting_id' => ['required', 'integer', 'min:1'],
            'ending_id' => ['required', 'integer', 'min:1'],
        ], [
            'starting_id.required' => 'The starting ID is required.',
            'starting_id.integer' => 'The starting ID must be a valid integer.',
            'starting_id.min' => 'The starting ID must be at least 1.',
            'ending_id.required' => 'The ending ID is required.',
            'ending_id.integer' => 'The ending ID must be a valid integer.',
            'ending_id.min' => 'The ending ID must be at least 1.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $startingId = (int) $startingId;
        $endingId = (int) $endingId;

        $ascending = $startingId <= $endingId;
        $minId = min($startingId, $endingId);
        $maxId = max($startingId, $endingId);

        $chapters = BookChapter::query()
            ->whereBetween('id', [$minId, $maxId])
            ->orderBy('id', $ascending ? 'asc' : 'desc')
            ->get(['id', 'book', 'chapter_number', 'num_verses']);

        if ($chapters->isEmpty()) {
            return response()->json([
                'message' => "No book chapters were found in the range from ID {$startingId} to {$endingId}.",
            ], 404);
        }

        $now = now();
        $records = $chapters->map(fn (BookChapter $chapter): array => [
            'chapter_id' => $chapter->id,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        DB::transaction(function () use ($records): void {
            ChronologicalOrder::insert($records);
        });

        return response()->json([
            'message' => sprintf(
                'Successfully added %d %s to chronological order.',
                count($records),
                count($records) === 1 ? 'chapter' : 'chapters'
            ),
            'count' => count($records),
            'starting_id' => $startingId,
            'ending_id' => $endingId,
            'chapters' => $chapters,
        ], 201);
    }
}
