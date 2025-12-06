<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UserPoint;
use App\Models\Badge;
class GamificationController extends Controller
{
  public function index(Request $request)
  {
    $userPoints = UserPoint::where('userId', $request->user()->userId)->first();
    $leaderboard = UserPoint::with('user')
      ->orderBy('totalPoints', 'desc')
      ->paginate(50);
    return Inertia::render('Leaderboard', [
      'userPoints' => $userPoints,
      'leaderboard' => $leaderboard,
      'user' => $request->user(),
    ]);
  }
}