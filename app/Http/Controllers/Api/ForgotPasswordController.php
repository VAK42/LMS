<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Inertia\Inertia;
class ForgotPasswordController extends Controller
{
  public function show()
  {
    return Inertia::render('ForgotPassword');
  }
  public function sendResetLink(Request $request)
  {
    $validated = $request->validate(['userEmail' => 'required|email']);
    $user = User::where('userEmail', $validated['userEmail'])->first();
    if ($user) {
      $token = Str::random(60);
      DB::table('passwordResetTokens')->updateOrInsert(
        ['userId' => $user->userId],
        ['token' => Hash::make($token), 'expiresAt' => now()->addHour(), 'createdAt' => now()]
      );
    }
    return response()->json(['message' => 'Password Reset Link Sent If Email Exists!']);
  }
  public function showResetForm($token)
  {
    return Inertia::render('PasswordReset', ['token' => $token]);
  }
  public function reset(Request $request)
  {
    $validated = $request->validate([
      'token' => 'required',
      'userEmail' => 'required|email',
      'password' => 'required|min:8',
      'passwordConfirmation' => 'required|same:password',
    ]);
    $user = User::where('userEmail', $validated['userEmail'])->first();
    if (!$user) {
      return response()->json(['error' => 'User Not Found!'], 404);
    }
    $resetRecord = DB::table('passwordResetTokens')->where('userId', $user->userId)->first();
    if (!$resetRecord || !Hash::check($validated['token'], $resetRecord->token)) {
      return response()->json(['error' => 'Invalid Or Expired Token!'], 400);
    }
    $user->update(['password' => Hash::make($validated['password'])]);
    DB::table('passwordResetTokens')->where('userId', $user->userId)->delete();
    return response()->json(['message' => 'Password Reset Successful!']);
  }
}