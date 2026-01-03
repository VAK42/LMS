<?php
return [
  'default' => env('filesystemDisk', 'local'),
  'disks' => [
    'local' => [
      'driver' => 'local',
      'root' => storage_path('app/private'),
      'serve' => true,
      'throw' => false,
      'report' => false,
    ],
    'public' => [
      'driver' => 'local',
      'root' => storage_path('app/public'),
      'url' => env('appUrl').'/storage',
      'visibility' => 'public',
      'throw' => false,
      'report' => false,
    ],
  ],
  'links' => [
    public_path('storage') => storage_path('app/public'),
  ],
];