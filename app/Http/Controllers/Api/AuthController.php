<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;
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
      'password' => 'required|string|min:8|confirmed',
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
    ]);
    if (Auth::attempt(['userEmail' => $validated['userEmail'], 'password' => $validated['password']])) {
      $request->session()->regenerate();
      return redirect()->intended('/dashboard');
    }
    return back()->withErrors(['userEmail' => 'Invalid credentials!']);
  }
  public function logout(Request $request)
  {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
  }
}