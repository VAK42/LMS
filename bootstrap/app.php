<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    apiPrefix: 'api',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
      AddLinkHeadersForPreloadedAssets::class,
      \App\Http\Middleware\HandleInertiaRequests::class,
      \App\Http\Middleware\SecurityHeadersMiddleware::class,
    ]);
    $middleware->alias([
      'role' => \App\Http\Middleware\RoleMiddleware::class,
      'admin' => \App\Http\Middleware\AdminMiddleware::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions): void {
  })->create();