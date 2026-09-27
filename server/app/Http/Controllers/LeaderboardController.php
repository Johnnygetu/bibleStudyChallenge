<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    /**
     * Personal leaderboard (sum of the reader's scores, name breaks ties)
     * and the group leaderboard (sum of each group's members' scores).
     */
    public function index()
    {
        $personal = Reader::withSum('scores as total_score', 'score')
            ->withMax('streaks as current_streak', 'count')
            ->get()
            ->map(fn (Reader $reader) => [
                'reader_id' => $reader->id,
                'reader_name' => $reader->name,
                'total_score' => (int) ($reader->total_score ?? 0),
                'current_streak' => (int) ($reader->current_streak ?? 0),
            ])
            ->sortBy([
                ['total_score', 'desc'],
                ['reader_name', 'asc'],
            ])
            ->values();

        $scoreByReader = $personal->keyBy('reader_id');
        $memberships = DB::table('members')->get(['group_id', 'reader_id']);

        $groups = Group::withCount('readers')
            ->get()
            ->map(function (Group $group) use ($memberships, $scoreByReader) {
                $members = $memberships
                    ->where('group_id', $group->id)
                    ->pluck('reader_id')
                    ->map(fn ($id) => $scoreByReader->get($id))
                    ->filter();

                $total = (int) $members->sum('total_score');
                $top = $members
                    ->sortBy([
                        ['total_score', 'desc'],
                        ['reader_name', 'asc'],
                    ])
                    ->first();

                return [
                    'group_id' => $group->id,
                    'group_name' => $group->name,
                    'members_count' => $group->readers_count,
                    'total_score' => $total,
                    'avg_score' => $members->count() > 0
                        ? round($total / $members->count(), 1)
                        : 0,
                    'top_reader_name' => $top['reader_name'] ?? null,
                ];
            })
            ->sortBy([
                ['total_score', 'desc'],
                ['group_name', 'asc'],
            ])
            ->values();

        return response([
            'personal' => $personal,
            'groups' => $groups,
        ]);
    }
}
