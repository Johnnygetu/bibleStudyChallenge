<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Reader;

class DashboardController extends Controller
{
    /**
     * The home dashboard numbers the server knows: totals and the most
     * recent sign-ups. Streak/consistency stats come later.
     */
    public function index()
    {
        return response([
            'total_readers' => Reader::count(),
            'total_questions' => Question::count(),
            'recent_readers' => Reader::latest('created_at')
                ->take(5)
                ->get()
                ->map(fn (Reader $reader) => [
                    'id' => $reader->id,
                    'name' => $reader->name,
                    'phone' => $reader->phone_number,
                    'created_at' => $reader->created_at->toIso8601String(),
                ])
                ->values(),
        ]);
    }
}
