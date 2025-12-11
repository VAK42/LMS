<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class AdminRouteMiddleware
{
  public function handle(Request $request, Closure $next): Response
  {
    $user = $request->user();
    if ($user && $user->role === 'admin') {
      $allowedRoutes = [
        '/',
        'courses',
        'courses/*',
        'admin/*',
        'logout',
        'login',
        'register',
      ];
      $currentPath = $request->path() === '/' ? '/' : $request->path();
      $isAllowed = false;
      foreach ($allowedRoutes as $route) {
        if ($route === $currentPath) {
          $isAllowed = true;
          break;
        }
        if (str_ends_with($route, '/*')) {
          $prefix = substr($route, 0, -2);
          if (str_starts_with($currentPath, $prefix)) {
            $isAllowed = true;
            break;
          }
        }
      }
      if (!$isAllowed) {
        abort(403, 'Unauthorized Access!');
      }
    }
    return $next($request);
  }
}