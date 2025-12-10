<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
class LocaleController extends Controller
{
  public function change(Request $request)
  {
    $validated = $request->validate([
      'locale' => 'required|string|in:en,es,fr,vi,de,zh,ko,ja',
    ]);
    $user = $request->user();
    if ($user) {
      $user->update(['preferredLocale' => $validated['locale']]);
    }
    session(['locale' => $validated['locale']]);
    return response()->json(['message' => 'Language Changed Successfully!']);
  }
  public function current(Request $request)
  {
    $locale = $request->user()?->preferredLocale ?? session('locale', 'en');
    $allowedLocales = ['en', 'es', 'fr', 'vi', 'de', 'zh', 'ko', 'ja'];
    if (!in_array($locale, $allowedLocales)) {
        $locale = 'en';
    }
    $translations = json_decode(file_get_contents(resource_path("lang/{$locale}/messages.json")), true);
    return response()->json([
      'locale' => $locale,
      'translations' => $translations,
    ]);
  }
}