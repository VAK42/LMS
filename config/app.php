<?php
return [
  'name' => env('appName', 'LMS'),
  'env' => env('appEnv', 'production'),
  'debug' => (bool) env('appDebug', false),
  'url' => env('appUrl', 'http://localhost'),
  'timezone' => 'UTC',
  'locale' => env('appLocale', 'en'),
  'fallback_locale' => env('appFallbackLocale', 'en'),
  'faker_locale' => env('appFakerLocale', 'en_US'),
  'cipher' => 'AES-256-CBC',
  'key' => env('appKey'),
  'previous_keys' => [
    ...array_filter(
      explode(',', (string) env('appPreviousKeys', ''))
    ),
  ],
  'maintenance' => [
    'driver' => env('appMaintenanceDriver', 'file'),
    'store' => env('appMaintenanceStore', 'database'),
  ],
];