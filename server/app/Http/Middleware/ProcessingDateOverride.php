<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;

/**
 * Testing middleware: freezes Carbon's clock to a ?processing_date query param.
 *
 * When the request contains `?processing_date=YYYY-MM-DD`, Carbon::setTestNow()
 * is called so that every `today()`, `now()`, and `Carbon::now()` call within
 * the request lifecycle returns that date instead of the real one.
 *
 * This makes the entire backend behave as though it is running on that day —
 * without touching any controller or model code.
 */
class ProcessingDateOverride
{
    public function handle(Request $request, Closure $next)
    {
        $dateParam = $request->query('processing_date');

        if ($dateParam) {
            try {
                $fakeNow = Carbon::parse($dateParam)->startOfDay()->setTimeFrom(Carbon::now());
                Carbon::setTestNow($fakeNow);
            } catch (\Exception $e) {
                // Silently ignore malformed dates — fall through to real time.
            }
        }

        $response = $next($request);

        // Always clear after the request so the real clock resumes for the
        // next request in long-running servers (Octane, tests, etc.).
        Carbon::setTestNow();

        return $response;
    }
}
