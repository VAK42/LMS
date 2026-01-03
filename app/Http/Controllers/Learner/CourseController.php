<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use App\Models\Course as CourseModel;
use App\Models\Enrollment;
use App\Models\Progress;
use Illuminate\Http\Request;
class CourseController extends Controller
{
  public function learn($courseId)
  {
    $user = auth()->user();
    $enrollment = Enrollment::where('userId', $user->userId)
      ->where('courseId', $courseId)
      ->first();
    if (!$enrollment) {
      return redirect("/courses/{$courseId}");
    }
    $course = CourseModel::with(['modules.lessons'])->findOrFail($courseId);
    $completedLessonIds = Progress::where('userId', $user->userId)
      ->where('isCompleted', true)
      ->pluck('lessonId')
      ->toArray();
    $firstLesson = null;
    foreach ($course->modules as $module) {
      foreach ($module->lessons as $lesson) {
        if (!in_array($lesson->lessonId, $completedLessonIds)) {
          $firstLesson = $lesson;
          break 2;
        }
      }
    }
    if (!$firstLesson && $course->modules->count() > 0 && $course->modules->first()->lessons->count() > 0) {
      $firstLesson = $course->modules->first()->lessons->first();
    }
    if ($firstLesson) {
      return redirect("/lessons/{$firstLesson->lessonId}");
    }
    return redirect("/courses/{$courseId}");
  }
}