<?php
use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;
use Monolog\Processor\PsrLogMessageProcessor;
return [
  'default' => env('logChannel', 'stack'),
  'deprecations' => [
    'channel' => env('logDeprecationsChannel', 'null'),
    'trace' => env('logDeprecationsTrace', false),
  ],
  'channels' => [
    'stack' => [
      'driver' => 'stack',
      'channels' => explode(',', (string) env('logStack', 'single')),
      'ignore_exceptions' => false,
    ],
    'single' => [
      'driver' => 'single',
      'path' => storage_path('logs/laravel.log'),
      'level' => env('logLevel', 'debug'),
      'replace_placeholders' => true,
    ],
    'daily' => [
      'driver' => 'daily',
      'path' => storage_path('logs/laravel.log'),
      'level' => env('logLevel', 'debug'),
      'days' => env('logDailyDays', 14),
      'replace_placeholders' => true,
    ],
    'null' => [
      'driver' => 'monolog',
      'handler' => NullHandler::class,
    ],
    'emergency' => [
      'path' => storage_path('logs/laravel.log'),
    ],
  ],
];