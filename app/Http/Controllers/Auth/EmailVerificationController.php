<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class EmailVerificationController extends Controller
{
  public function send(Request $request)
  {
    $user = $request->user();
    if ($user->emailVerifiedAt) {
      return response()->json(['message' => 'Email Already Verified!'], 400);
    }
    $token = \Illuminate\Support\Str::random(60);
    DB::table('verificationTokens')->updateOrInsert(
      ['userId' => $user->userId],
      [
        'token' => hash('sha256', $token),
        'expiresAt' => now()->addHours(24),
        'createdAt' => now(),
      ]
    );
    return response()->json(['message' => 'Verification Email Sent!']);
  }
  public function verify(Request $request, $token)
  {
    $hashedToken = hash('sha256', $token);
    $verification = DB::table('verificationTokens')
      ->where('token', $hashedToken)
      ->where('expiresAt', '>', now())
      ->first();
    if (!$verification) {
      return redirect('/')->with('error', 'Invalid Or Expired Verification Link!');
    }
    $user = \App\Models\User::where('userId', $verification->userId)->first();
    $user->update(['emailVerifiedAt' => now()]);
    DB::table('verificationTokens')->where('userId', $user->userId)->delete();
    return redirect('/dashboard')->with('message', 'Email Verified Successfully!');
  }
}