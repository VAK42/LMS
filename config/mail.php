<?php
return [
  'default' => env('MAIL_MAILER', 'log'),
  'mailers' => [
    'smtp' => [
      'transport' => 'smtp',
      'host' => env('MAIL_HOST', 'smtp.mailtrap.io'),
      'port' => env('MAIL_PORT', 2525),
      'username' => env('MAIL_USERNAME'),
      'password' => env('MAIL_PASSWORD'),
      'timeout' => null,
    ],
    'log' => [
      'transport' => 'log',
      'channel' => env('MAIL_LOG_CHANNEL'),
    ],
  ],
  'from' => [
    'address' => env('MAIL_FROM_ADDRESS', 'admin@lms.com'),
    'name' => env('MAIL_FROM_NAME', 'LMS'),
  ],
];