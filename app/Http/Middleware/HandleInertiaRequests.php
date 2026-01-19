<?php
namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Inertia\Middleware;
class HandleInertiaRequests extends Middleware
{
  protected $rootView = 'app';
  public function version(Request $request): string|null
  {
    return parent::version($request);
  }
  public function share(Request $request): array
  {
    return [
      ...parent::share($request),
      'auth' => [
        'user' => $request->user(),
      ],
      'errors' => function () use ($request) {
        return $request->session()->get('errors')
          ? $request->session()->get('errors')->getBag('default')->getMessages()
          : (object) [];
      },
      'success' => fn () => $request->session()->get('success'),
      'locale' => app()->getLocale(),
      'translations' => function () {
        $path = lang_path(app()->getLocale() . '.json');
        return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
      },
    ];
  }
}