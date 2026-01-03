<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OauthProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
class OAuthController extends Controller
{
  public function redirectToProvider($provider)
  {
    return Socialite::driver($provider)
      ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
      ->redirect();
  }
  public function handleProviderCallback($provider)
  {
    try {
      $socialiteUser = Socialite::driver($provider)
        ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
        ->stateless()
        ->user();
    } catch (\Exception $e) {
      return redirect('/login')->withErrors(['error' => 'OAuth Authentication Failed! ' . $e->getMessage()]);
    }
    $oauthProvider = OauthProvider::where('provider', $provider)
      ->where('providerId', $socialiteUser->getId())
      ->first();
    if ($oauthProvider) {
      Auth::login($oauthProvider->user);
      return redirect('/dashboard');
    }
    $user = User::where('userEmail', $socialiteUser->getEmail())->first();
    if (!$user) {
      $user = User::create([
        'userName' => $socialiteUser->getName() ?? $socialiteUser->getNickname() ?? 'User',
        'userEmail' => $socialiteUser->getEmail(),
        'password' => Hash::make(Str::random(32)),
        'role' => 'learner',
        'emailVerifiedAt' => now(),
      ]);
    }
    OauthProvider::create([
      'userId' => $user->userId,
      'provider' => $provider,
      'providerId' => $socialiteUser->getId(),
      'accessToken' => $socialiteUser->token,
    ]);
    Auth::login($user);
    return redirect('/dashboard');
  }
}