<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class SetLocaleMiddleware
{
  public function handle(Request $request, Closure $next): Response
  {
    $locale = $request->user()?->preferredLocale ?? session('locale', 'en');
    if (!in_array($locale, ['en', 'es', 'fr', 'vi', 'de', 'zh', 'ko', 'ja'])) {
      $locale = 'en';
    }
    app()->setLocale($locale);
    return $next($request);
  }
}