<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Inertia\Inertia;
class HomeController extends Controller
{
  public function index()
  {
    $featuredCourses = Course::with(['instructor', 'category'])
      ->where('isPublished', true)
      ->orderBy('averageRating', 'desc')
      ->limit(6)
      ->get()
      ->map(function ($course) {
        return [
          'courseId' => $course->courseId,
          'courseTitle' => $course->courseTitle,
          'category' => $course->category,
          'instructor' => $course->instructor,
          'price' => (float) $course->simulatedPrice,
          'rating' => (float) $course->averageRating,
        ];
      });
    return Inertia::render('Public/Home', [
      'user' => auth()->user(),
      'featuredCourses' => $featuredCourses
    ]);
  }
}