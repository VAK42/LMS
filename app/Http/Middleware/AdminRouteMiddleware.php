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
    if (!$user) {
      return $next($request);
    }
    $currentPath = $request->path() === '/' ? '/' : $request->path();
    $adminRoutes = ['admin/*'];
    $instructorRoutes = ['instructor/*', 'api/instructor/*'];
    $learnerRoutes = ['dashboard', 'lessons/*', 'wishlist'];
    if ($user->role === 'admin') {
      $allowedPrefixes = ['/', 'courses', 'admin', 'logout', 'login', 'register', 'settings', 'supportTickets'];
      if (!$this->isPathAllowed($currentPath, $allowedPrefixes)) {
        return redirect('/admin/dashboard');
      }
    }
    if ($user->role === 'instructor') {
      if ($this->pathMatchesPatterns($currentPath, $adminRoutes)) {
        return redirect('/instructor/dashboard');
      }
      if ($this->pathMatchesPatterns($currentPath, $learnerRoutes)) {
        return redirect('/instructor/dashboard');
      }
    }
    if ($user->role === 'learner') {
      if ($this->pathMatchesPatterns($currentPath, $adminRoutes)) {
        return redirect('/dashboard');
      }
      if ($this->pathMatchesPatterns($currentPath, $instructorRoutes)) {
        return redirect('/dashboard');
      }
    }
    return $next($request);
  }
  private function isPathAllowed(string $path, array $prefixes): bool
  {
    foreach ($prefixes as $prefix) {
      if ($path === $prefix || str_starts_with($path, $prefix . '/') || str_starts_with($path, $prefix)) {
        return true;
      }
    }
    return false;
  }
  private function pathMatchesPatterns(string $path, array $patterns): bool
  {
    foreach ($patterns as $pattern) {
      if (str_ends_with($pattern, '/*')) {
        $prefix = substr($pattern, 0, -2);
        if (str_starts_with($path, $prefix)) {
          return true;
        }
      } elseif ($path === $pattern) {
        return true;
      }
    }
    return false;
  }
}