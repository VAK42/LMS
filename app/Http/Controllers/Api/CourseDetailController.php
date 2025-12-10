<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
class CourseDetailController extends Controller
{
  public function show($courseId)
  {
    $course = Course::with(['instructor', 'category', 'modules.lessons'])->findOrFail($courseId);
    return Inertia::render('CourseDetail', [
      'course' => $course,
    ]);
  }
}