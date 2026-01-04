<?php
namespace App\Http\Controllers\Shared;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
class SettingsController extends Controller
{
  public function index()
  {
    $user = auth()->user();
    return Inertia::render('Shared/Settings', [
      'user' => [
        'userId' => $user->userId,
        'userName' => $user->userName,
        'userEmail' => $user->userEmail,
        'role' => $user->role,
        'twoFactorSecret' => $user->twoFactorSecret,
        'twoFactorConfirmedAt' => $user->twoFactorConfirmedAt,
      ]
    ]);
  }
  public function updateProfile(Request $request)
  {
    $user = auth()->user();
    $validated = $request->validate([
      'userName' => 'required|string|max:255',
      'userEmail' => 'required|email|max:255|unique:users,userEmail,' . $user->userId . ',userId',
    ]);
    $user->userName = $validated['userName'];
    $user->userEmail = $validated['userEmail'];
    $user->save();
    return response()->json(['success' => true]);
  }
  public function updatePassword(Request $request)
  {
    $validated = $request->validate([
      'currentPassword' => 'required|string',
      'newPassword' => ['required', 'string', Password::min(8)],
    ]);
    $user = auth()->user();
    if (!Hash::check($validated['currentPassword'], $user->password)) {
      return response()->json(['error' => 'Current Password Is Incorrect!'], 422);
    }
    $user->password = Hash::make($validated['newPassword']);
    $user->save();
    return response()->json(['success' => true]);
  }
}