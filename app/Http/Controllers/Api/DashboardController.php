<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
class DashboardController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $enrolledCourses = $user->enrollments()->with(['course.instructor', 'course.category'])->get()->map(function ($enrollment) {
      return [
        'course' => $enrollment->course,
        'completionPercent' => $enrollment->completionPercent,
        'enrollmentDate' => $enrollment->enrollmentDate,
      ];
    });
    return Inertia::render('LearnerDashboard', [
      'user' => $user,
      'enrolledCourses' => $enrolledCourses,
    ]);
  }
}