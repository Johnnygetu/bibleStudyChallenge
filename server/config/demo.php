<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Demo Mode
    |--------------------------------------------------------------------------
    |
    | With IS_DEMO_MODE enabled, the messaging app's Send To picker only ever
    | returns the tester readers below: whatever audience is picked, blasts
    | submitted while demoing reach the testers alone and never a real
    | reader.
    |
    */

    'enabled' => (bool) env('IS_DEMO_MODE', false),

    /*
    | The chat ids allowed to receive and test messages. Mirrored from
    | BibleStudyReaders/src/lib/canTestFeature.js — keep the two lists in
    | step.
    */
    'chat_ids' => [
        '5549839020',
        '5378115428',
        '6597819023',
        '1609933941',
        '388908454',
        '871441790',
    ],
];
