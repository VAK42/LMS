<?php
return [
  'default' => env('cacheStore', 'file'),
  'stores' => [
    'array' => [
      'driver' => 'array',
      'serialize' => false,
    ],
    'file' => [
      'driver' => 'file',
      'path' => storage_path('framework/cache/data'),
      'lock_path' => storage_path('framework/cache/data'),
    ],
  ],
  'prefix' => env('cachePrefix', 'lms-cache-'),
];