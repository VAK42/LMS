<?php
use Illuminate\Support\Str;
return [
  'default' => env('dbConnection', 'pgsql'),
  'connections' => [
    'pgsql' => [
      'driver' => 'pgsql',
      'url' => env('dbUrl'),
      'host' => env('dbHost', '127.0.0.1'),
      'port' => env('dbPort', '5432'),
      'database' => env('dbDatabase', 'postgres'),
      'username' => env('dbUsername', 'postgres'),
      'password' => env('dbPassword', ''),
      'charset' => env('dbCharset', 'utf8'),
      'prefix' => '',
      'prefix_indexes' => true,
      'search_path' => 'public',
      'sslmode' => 'prefer',
    ],
  ],
  'migrations' => [
    'table' => 'migrations',
    'update_date_on_publish' => true,
  ],
];