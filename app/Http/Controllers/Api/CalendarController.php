<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CourseEvent;
class CalendarController extends Controller
{
  public function index(Request $request)
  {
    $events = CourseEvent::whereHas('course.enrollments', function ($q) use ($request) {
      $q->where('userId', $request->user()->userId);
    })->get();
    return Inertia::render('Calendar', [
      'events' => $events,
    ]);
  }
}