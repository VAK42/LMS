<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class LessonAccessMiddleware
{
  public function handle(Request $request, Closure $next): Response
  {
    $lessonId = $request->route('lessonId');
    $lesson = \App\Models\Lesson::with('module.course')->findOrFail($lessonId);
    $user = $request->user();
    if ($lesson->isFreePreview) {
      return $next($request);
    }
    if ($user && in_array($user->role, ['admin', 'instructor'])) {
      return $next($request);
    }
    if (!$user) {
      abort(401, 'Authentication Required!');
    }
    $course = $lesson->module->course;
    $hasEnrollment = \App\Models\Enrollment::where('userId', $user->userId)
      ->where('courseId', $course->courseId)
      ->where('isPaid', true)
      ->exists();
    if (!$hasEnrollment) {
      abort(403, 'You Must Enroll In This Course To Access This Lesson!');
    }
    return $next($request);
  }
}