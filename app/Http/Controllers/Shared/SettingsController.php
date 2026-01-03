<?php
namespace App\Http\Controllers\Shared;
use App\Http\Controllers\Controller;
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
}