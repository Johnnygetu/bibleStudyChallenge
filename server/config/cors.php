<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Wide open on purpose, for local development: any origin, any method,
    | any header, on any path.
    |
    | This is safe here only because the API routes carry no `auth`
    | middleware — there are no cookies or credentials for a browser to
    | attach cross-origin, so allowing every origin does not grant a caller
    | anything the routes were not already serving anonymously. That stops
    | being true the moment authentication is added; tighten
    | `allowed_origins` to the admin's real origin before this is reachable
    | from anywhere but localhost.
    |
    */

    // Every path, not just `api/*`. Since CORS is not being used to keep
    // anything out, leaving some routes uncovered would only produce
    // confusing per-route differences.
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    // Left at 0 so the browser re-asks before each cross-origin write. A
    // cached preflight would outlive an edit to this file and make the next
    // change look like it did nothing.
    'max_age' => 0,

    // Must stay false. `allowed_origins: ['*']` combined with credentials is
    // invalid per the CORS spec and browsers reject it outright, so setting
    // this true would break every request rather than permit more of them.
    'supports_credentials' => false,

];
