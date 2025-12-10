<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;
class AuthController extends Controller
{
  public function showLogin()
  {
    return Inertia::render('Login');
  }
  public function showRegister()
  {
    return Inertia::render('Register');
  }
  public function register(Request $request)
  {
    $validated = $request->validate([
      'userName' => 'required|string|max:255',
      'userEmail' => 'required|email|unique:users,userEmail',
      'password' => 'required|string|min:8',
      'passwordConfirmation' => 'required|same:password',
      'role' => 'required|in:learner,instructor',
    ]);
    $user = User::create([
      'userName' => $validated['userName'],
      'userEmail' => $validated['userEmail'],
      'password' => Hash::make($validated['password']),
      'role' => $validated['role'],
    ]);
    Auth::login($user);
    return redirect()->intended('/dashboard');
  }
  public function login(Request $request)
  {
    $validated = $request->validate([
      'userEmail' => 'required|email',
      'password' => 'required|string',
      'remember' => 'boolean',
    ]);
    $remember = $validated['remember'] ?? false;
    if (Auth::attempt(['userEmail' => $validated['userEmail'], 'password' => $validated['password']], $remember)) {
      $user = Auth::user();
      if ($user->twoFactorSecret && $user->twoFactorConfirmedAt) {
        Auth::logout();
        $request->session()->put('2fa:user:id', $user->userId);
        return redirect('/twoFactorChallenge');
      }
      $request->session()->regenerate();
      return redirect()->intended('/dashboard');
    }
    return back()->withErrors(['userEmail' => 'Invalid Credentials!']);
  }
  public function logout(Request $request)
  {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
  }
  public function verifyTwoFactor(Request $request)
  {
    $validated = $request->validate([
      'code' => 'required|string',
    ]);
    $userId = $request->session()->get('2fa:user:id');
    if (!$userId) {
      return back()->withErrors(['code' => 'Session Expired!']);
    }
    $user = User::find($userId);
    if (!$user) {
      return back()->withErrors(['code' => 'User Not Found!']);
    }
    $google2fa = new Google2FA();
    $secret = decrypt($user->twoFactorSecret);
    $valid = $google2fa->verifyKey($secret, $validated['code'], 2);
    if (!$valid) {
      $recoveryCodes = json_decode(decrypt($user->twoFactorRecoveryCodes), true);
      if (in_array($validated['code'], $recoveryCodes)) {
        $recoveryCodes = array_diff($recoveryCodes, [$validated['code']]);
        $user->update([
          'twoFactorRecoveryCodes' => encrypt(json_encode(array_values($recoveryCodes))),
        ]);
        $valid = true;
      }
    }
    if (!$valid) {
      return back()->withErrors(['code' => 'Invalid Code!']);
    }
    Auth::login($user);
    $request->session()->forget('2fa:user:id');
    $request->session()->regenerate();
    return redirect()->intended('/dashboard');
  }
}