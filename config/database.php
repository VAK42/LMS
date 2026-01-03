<?php
use Illuminate\Support\Str;
return [
  'default' => env('dbConnection', 'sqlite'),
  'connections' => [

    'pgsql' => [
      'driver' => 'pgsql',
      'url' => env('dbUrl'),
      'host' => env('dbHost', '127.0.0.1'),
      'port' => env('dbPort', '5432'),
      'database' => env('dbDatabase', 'laravel'),
      'username' => env('dbUsername', 'root'),
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