<?php
return [
  'default' => env('mailMailer', 'log'),
  'mailers' => [
    'smtp' => [
      'transport' => 'smtp',
      'host' => env('mailHost', 'smtp.gmail.com'),
      'port' => env('mailPort', 587),
      'username' => env('mailUsername'),
      'password' => env('mailPassword'),
      'encryption' => env('mailEncryption', 'tls'),
      'timeout' => null,
    ],

  ],
  'from' => [
    'address' => env('mailFromAddress', 'admin@lms.com'),
    'name' => env('mailFromName', 'LMS'),
  ],
];