<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Progress;
class DashboardController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    if ($user->role === 'instructor') {
      return redirect('/instructor/dashboard');
    }
    $enrollments = Enrollment::with(['course.instructor', 'course.modules.lessons'])
      ->where('userId', $user->userId)
      ->where('isPaid', true)
      ->get();
    $enrolledCourses = $enrollments->map(function ($enrollment) use ($user) {
      $totalLessons = 0;
      $lessonIds = [];
      foreach ($enrollment->course->modules as $module) {
        foreach ($module->lessons as $lesson) {
          $lessonIds[] = $lesson->lessonId;
          $totalLessons++;
        }
      }
      $completedLessons = count($lessonIds) > 0
      ? Progress::where('userId', $user->userId)
        ->whereIn('lessonId', $lessonIds)
        ->where('isCompleted', true)
        ->count()
      : 0;
      $progressPercent = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 0) : 0;
      return [
        'enrollment' => $enrollment,
        'course' => $enrollment->course,
        'totalLessons' => $totalLessons,
        'completedLessons' => $completedLessons,
        'progressPercent' => $progressPercent,
      ];
    });
    return Inertia::render('Learner/Dashboard', [
      'enrolledCourses' => $enrolledCourses,
      'totalEnrollments' => $enrollments->count(),
      'user' => $user
    ]);
  }
}