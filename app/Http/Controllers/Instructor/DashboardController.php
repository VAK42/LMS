<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Wallet;
use Inertia\Inertia;
class DashboardController extends Controller
{
  public function index()
  {
    $user = auth()->user();
    $courses = Course::with(['category', 'modules'])
      ->where('instructorId', $user->userId)
      ->orderBy('createdAt', 'desc')
      ->paginate(10);
    $totalStudents = Enrollment::whereHas('course', function ($q) use ($user) {
      $q->where('instructorId', $user->userId);
    })->count();
    $wallet = Wallet::where('userId', $user->userId)->first();
    $stats = [
      'totalStudents' => $totalStudents,
      'totalEarnings' => $wallet ? (float) $wallet->totalEarnings : 0,
      'totalCourses' => $courses->total(),
      'publishedCourses' => Course::where('instructorId', $user->userId)->where('isPublished', true)->count(),
    ];
    return Inertia::render('Instructor/Dashboard', ['courses' => $courses, 'stats' => $stats, 'user' => $user]);
  }
}