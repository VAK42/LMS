<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\OauthProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class OAuthController extends Controller
{
  public function redirectToProvider($provider)
  {
    return response()->json([
      'url' => route('oauth.callback', ['provider' => $provider]),
    ]);
  }
  public function handleProviderCallback(Request $request, $provider)
  {
    $validated = $request->validate([
      'providerId' => 'required|string',
      'userEmail' => 'required|email',
      'userName' => 'required|string',
      'accessToken' => 'nullable|string',
    ]);
    $oauthProvider = OauthProvider::where('provider', $provider)
      ->where('providerId', $validated['providerId'])
      ->first();
    if ($oauthProvider) {
      Auth::login($oauthProvider->user);
      return redirect('/dashboard');
    }
    $user = User::where('userEmail', $validated['userEmail'])->first();
    if (!$user) {
      $user = User::create([
        'userName' => $validated['userName'],
        'userEmail' => $validated['userEmail'],
        'password' => Hash::make(Str::random(32)),
        'role' => 'learner',
        'emailVerifiedAt' => now(),
      ]);
    }
    OauthProvider::create([
      'userId' => $user->userId,
      'provider' => $provider,
      'providerId' => $validated['providerId'],
      'accessToken' => $validated['accessToken'] ?? null,
    ]);
    Auth::login($user);
    return redirect('/dashboard');
  }
}