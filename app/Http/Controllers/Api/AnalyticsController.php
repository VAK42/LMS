<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\User;
use App\Models\Enrollment;
class AnalyticsController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $totalCourses = Course::where('isPublished', true)->count();
    $totalEnrollments = Enrollment::where('userId', $user->userId)->count();
    $completedCourses = Enrollment::where('userId', $user->userId)
      ->where('completionPercent', 100)
      ->count();
    $totalTimeSpent = \App\Models\Progress::where('userId', $user->userId)
      ->sum('timeSpentSeconds');
    $monthlyProgress = \App\Models\Progress::where('userId', $user->userId)
      ->where('createdAt', '>=', now()->subDays(30))
      ->selectRaw('DATE(createdAt) as date, COUNT(*) as lessons')
      ->groupBy('date')
      ->get();
    return Inertia::render('Analytics', [
      'totalCourses' => $totalCourses,
      'totalEnrollments' => $totalEnrollments,
      'completedCourses' => $completedCourses,
      'totalTimeSpent' => $totalTimeSpent,
      'monthlyProgress' => $monthlyProgress,
      'user' => $user,
    ]);
  }
}