<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Lesson;
use App\Models\Progress;
class LessonController extends Controller
{
  public function show(Request $request, $lessonId)
  {
    $lesson = Lesson::with(['module.course'])->findOrFail($lessonId);
    $progress = Progress::where('userId', $request->user()->userId)
      ->where('lessonId', $lessonId)
      ->first();
    $nextLesson = Lesson::where('moduleId', $lesson->moduleId)
      ->where('orderIndex', '>', $lesson->orderIndex)
      ->orderBy('orderIndex')
      ->first();
    return Inertia::render('LessonViewer', [
      'lesson' => $lesson,
      'course' => $lesson->module->course,
      'module' => $lesson->module,
      'progress' => $progress,
      'nextLesson' => $nextLesson,
      'user' => $request->user(),
    ]);
  }
  public function markComplete(Request $request, $lessonId)
  {
    $lesson = Lesson::with('module.course')->findOrFail($lessonId);
    $progress = Progress::updateOrCreate(
      ['userId' => $request->user()->userId, 'lessonId' => $lessonId],
      ['isCompleted' => true, 'completionPercent' => 100, 'completedAt' => now()]
    );
    if (!$progress->wasRecentlyCreated && !$progress->startedAt) {
      $progress->update(['startedAt' => now()]);
    }
    $enrollment = \App\Models\Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $lesson->module->course->courseId)
      ->first();
    if ($enrollment) {
      $totalLessons = \App\Models\Lesson::whereHas('module', function ($q) use ($lesson) {
        $q->where('courseId', $lesson->module->course->courseId);
      })->count();
      $completedLessons = Progress::where('userId', $request->user()->userId)
        ->where('isCompleted', true)
        ->whereHas('lesson.module', function ($q) use ($lesson) {
          $q->where('courseId', $lesson->module->course->courseId);
        })->count();
      $completionPercent = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;
      $enrollment->update(['completionPercent' => round($completionPercent, 2)]);
    }
    return redirect()->back();
  }
}