<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProfileController extends Controller
{
  public function show(Request $request)
  {
    return Inertia::render('Profile', [
      'user' => $request->user(),
    ]);
  }
  public function update(Request $request)
  {
    $validated = $request->validate([
      'userName' => 'required|string|max:255',
      'userEmail' => 'required|email|max:255|unique:users,userEmail,' . $request->user()->userId . ',userId',
    ]);
    $request->user()->update($validated);
    return redirect()->back();
  }
  public function updateSettings(Request $request)
  {
    $validated = $request->validate([
      'bio' => 'nullable|string|max:1000',
      'website' => 'nullable|url',
      'twitter' => 'nullable|string|max:100',
      'linkedin' => 'nullable|string|max:100',
      'github' => 'nullable|string|max:100',
      'avatarPath' => 'nullable|string',
    ]);
    $request->user()->update($validated);
    return response()->json(['message' => 'Settings Updated!']);
  }
  public function updatePreferences(Request $request)
  {
    $validated = $request->validate([
      'notificationPreferences' => 'nullable|array',
      'privacySettings' => 'nullable|array',
      'showProfile' => 'nullable|boolean',
      'showProgress' => 'nullable|boolean',
    ]);
    $request->user()->update($validated);
    return response()->json(['message' => 'Preferences Updated!']);
  }
}