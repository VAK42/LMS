<?php
return [
  'default' => env('cacheStore', 'database'),
  'stores' => [
    'array' => [
      'driver' => 'array',
      'serialize' => false,
    ],
    'database' => [
      'driver' => 'database',
      'connection' => env('dbCacheConnection'),
      'table' => env('dbCacheTable', 'cache'),
      'lock_connection' => env('dbCacheLockConnection'),
      'lock_table' => env('dbCacheLockTable'),
    ],
    'file' => [
      'driver' => 'file',
      'path' => storage_path('framework/cache/data'),
      'lock_path' => storage_path('framework/cache/data'),
    ],
  ],
  'prefix' => env('cachePrefix', 'lms-cache-'),
];