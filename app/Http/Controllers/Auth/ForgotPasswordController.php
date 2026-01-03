<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
class ForgotPasswordController extends Controller
{
  public function showLinkRequestForm()
  {
    return Inertia::render('Auth/ForgotPassword');
  }
  public function showResetForm()
  {
    return Inertia::render('Auth/PasswordReset');
  }
  public function show()
  {
    return Inertia::render('ForgotPassword');
  }
  public function sendResetLink(Request $request)
  {
    $validated = $request->validate(['userEmail' => 'required|email']);
    $user = User::where('userEmail', $validated['userEmail'])->first();
    if ($user) {
      $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
      DB::table('passwordResetTokens')->updateOrInsert(
        ['userId' => $user->userId],
        ['token' => $code, 'expiresAt' => now()->addMinutes(15), 'createdAt' => now()]
      );
      Mail::raw("Your Password Reset Code Is: {$code}\n\nThis Code Expires In 15 Minutes!\n\nIf You Didn't Request This, Please Ignore This Email!", function ($message) use ($user) {
        $message->to($user->userEmail)->subject('Password Reset Code');
      });
    }
    return back();
  }
  public function reset(Request $request)
  {
    $validated = $request->validate([
      'code' => 'required|string|size:6',
      'userEmail' => 'required|email',
      'password' => 'required|min:8',
      'passwordConfirmation' => 'required|same:password',
    ]);
    $user = User::where('userEmail', $validated['userEmail'])->first();
    if (!$user) {
      return back()->withErrors(['userEmail' => 'User Not Found!']);
    }
    $resetRecord = DB::table('passwordResetTokens')->where('userId', $user->userId)->first();
    if (!$resetRecord || $resetRecord->token !== $validated['code'] || now()->gt($resetRecord->expiresAt)) {
      return back()->withErrors(['code' => 'Invalid Or Expired Code!']);
    }
    $user->update(['password' => Hash::make($validated['password'])]);
    DB::table('passwordResetTokens')->where('userId', $user->userId)->delete();
    return redirect('/login')->with('success', 'Password Reset Successful!');
  }
}