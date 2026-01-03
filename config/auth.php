<?php
return [
  'defaults' => [
    'guard' => env('authGuard', 'web'),
    'passwords' => env('authPasswordBroker', 'users'),
  ],
  'guards' => [
    'web' => [
      'driver' => 'session',
      'provider' => 'users',
    ],
  ],
  'providers' => [
    'users' => [
      'driver' => 'eloquent',
      'model' => env('authModel', App\Models\User::class),
    ],
  ],
  'passwords' => [
    'users' => [
      'provider' => 'users',
      'table' => env('authPasswordResetTokenTable', 'passwordResetTokens'),
      'expire' => 60,
      'throttle' => 60,
    ],
  ],
  'password_timeout' => env('authPasswordTimeout', 10800),
];