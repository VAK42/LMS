<?php
namespace App\Http\Controllers\Api\Instructor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
class CourseManagementController extends Controller
{
  public function index(Request $request)
  {
    $courses = Course::where('instructorId', $request->user()->userId)->get();
    return Inertia::render('InstructorDashboard', [
      'courses' => $courses,
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'courseTitle' => 'required|string',
      'courseDescription' => 'required|string',
      'categoryId' => 'required|exists:categories,categoryId',
      'simulatedPrice' => 'required|numeric',
    ]);
    Course::create(array_merge($validated, ['instructorId' => $request->user()->userId]));
    return redirect()->back();
  }
}