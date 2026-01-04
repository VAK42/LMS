<?php
return [
  'name' => env('appName', 'LMS'),
  'env' => env('appEnv', 'local'),
  'debug' => (bool) env('appDebug', true),
  'url' => env('appUrl', 'http://localhost:8000'),
  'timezone' => 'UTC',
  'locale' => env('appLocale', 'en'),
  'fallback_locale' => env('appFallbackLocale', 'en'),
  'faker_locale' => env('appFakerLocale', 'en_US'),
  'cipher' => 'AES-256-CBC',
  'key' => env('appKey', 'base64:n1TkV4E5xXJiuX/W1PtnkfZUrzP7aQrKIibt1TOVIao='),
  'previous_keys' => [
    ...array_filter(
      explode(',', (string) env('appPreviousKeys', ''))
    ),
  ],
  'maintenance' => [
    'driver' => env('appMaintenanceDriver', 'file'),
    'store' => env('appMaintenanceStore', 'file'),
  ],
];