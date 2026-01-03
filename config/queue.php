<?php
return [
  'default' => env('queueConnection', 'database'),
  'connections' => [
    'sync' => [
      'driver' => 'sync',
    ],
    'database' => [
      'driver' => 'database',
      'connection' => env('dbQueueConnection'),
      'table' => env('dbQueueTable', 'jobs'),
      'queue' => env('dbQueue', 'default'),
      'retry_after' => (int) env('dbQueueRetryAfter', 90),
      'after_commit' => false,
    ],
  ],
  'batching' => [
    'database' => env('dbConnection', 'pgsql'),
    'table' => 'jobBatches',
  ],
  'failed' => [
    'driver' => env('queueFailedDriver', 'database-uuids'),
    'database' => env('dbConnection', 'pgsql'),
    'table' => 'failedJobs',
  ],
];