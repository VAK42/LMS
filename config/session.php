<?php
use Illuminate\Support\Str;
return [
  'driver' => env('sessionDriver', 'file'),
  'lifetime' => (int) env('sessionLifetime', 120),
  'expire_on_close' => env('sessionExpireOnClose', true),
  'encrypt' => env('sessionEncrypt', false),
  'files' => storage_path('framework/sessions'),
  'connection' => env('sessionConnection'),
  'table' => env('sessionTable', 'sessions'),
  'store' => env('sessionStore'),
  'lottery' => [2, 100],
  'cookie' => env(
    'sessionCookie',
    Str::slug((string) env('appName', 'lms')).'-session'
  ),
  'path' => env('sessionPath', '/'),
  'domain' => env('sessionDomain'),
  'secure' => env('sessionSecureCookie'),
  'http_only' => env('sessionHttpOnly', true),
  'same_site' => env('sessionSameSite', 'lax'),
  'partitioned' => env('sessionPartitionedCookie', false),
];