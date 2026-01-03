<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\Module;
use App\Models\Progress;
use App\Models\Quiz;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LessonController extends Controller
{
  public function show($lessonId)
  {
    $user = auth()->user();
    $lesson = Lesson::with(['module.course.modules.lessons'])->findOrFail($lessonId);
    $courseId = $lesson->module->course->courseId;
    $enrollment = Enrollment::where('userId', $user->userId)
      ->where('courseId', $courseId)
      ->first();
    if (!$enrollment) {
      return redirect("/courses/{$courseId}")->with('error', 'You Must Enroll First!');
    }
    $course = $lesson->module->course;
    $allModules = Module::where('courseId', $courseId)->with('lessons')->orderBy('orderIndex')->get();
    $completedLessonIds = Progress::where('userId', $user->userId)
      ->whereIn('lessonId', function ($q) use ($courseId) {
        $q->select('lessonId')
          ->from('lessons')
          ->whereIn('moduleId', function ($q2) use ($courseId) {
            $q2->select('moduleId')
              ->from('modules')
              ->where('courseId', $courseId);
          });
      })
      ->where('isCompleted', true)
      ->pluck('lessonId')
      ->toArray();
    $modules = [];
    foreach ($allModules as $m) {
      $lessonsList = [];
      foreach ($m->lessons as $l) {
        $lessonsList[] = [
          'lessonId' => $l->lessonId,
          'lessonTitle' => $l->lessonTitle,
          'contentType' => $l->contentType,
          'durationMinutes' => $l->durationMinutes,
          'isCompleted' => in_array($l->lessonId, $completedLessonIds),
        ];
      }
      $modules[] = [
        'moduleId' => $m->moduleId,
        'moduleTitle' => $m->moduleTitle,
        'orderIndex' => $m->orderIndex,
        'lessons' => $lessonsList,
      ];
    }
    $quiz = Quiz::where('courseId', $courseId)->first();
    $assessment = Assessment::whereHas('lesson.module', function ($q) use ($courseId) {
      $q->where('courseId', $courseId);
    })->where('assessmentType', 'assignment')->first();
    $progress = Progress::where('userId', $user->userId)
      ->where('lessonId', $lessonId)
      ->first();
    return Inertia::render('Learner/LessonViewer', [
      'lesson' => [
        'lessonId' => $lesson->lessonId,
        'lessonTitle' => $lesson->lessonTitle,
        'contentType' => $lesson->contentType,
        'contentData' => $lesson->contentData,
        'durationMinutes' => $lesson->durationMinutes,
      ],
      'course' => [
        'courseId' => $course->courseId,
        'courseTitle' => $course->courseTitle,
      ],
      'modules' => $modules,
      'quiz' => $quiz ? ['quizId' => $quiz->quizId, 'quizTitle' => $quiz->quizTitle] : null,
      'assessment' => $assessment ? ['assessmentId' => $assessment->assessmentId, 'assessmentTitle' => $assessment->assessmentTitle] : null,
      'progress' => $progress,
      'user' => $user
    ]);
  }
  public function complete($lessonId)
  {
    $user = auth()->user();
    $progress = Progress::firstOrCreate(
      ['userId' => $user->userId, 'lessonId' => $lessonId],
      ['startedAt' => now()]
    );
    $progress->update(['isCompleted' => true, 'completedAt' => now()]);
    $lesson = Lesson::with('module')->find($lessonId);
    if ($lesson) {
      $courseId = $lesson->module->courseId;
      $totalLessons = Lesson::whereHas('module', fn($q) => $q->where('courseId', $courseId))->count();
      $completedCount = Progress::where('userId', $user->userId)
        ->whereHas('lesson.module', fn($q) => $q->where('courseId', $courseId))
        ->where('isCompleted', true)->count();
      $percent = $totalLessons > 0 ? ($completedCount / $totalLessons) * 100 : 0;
      Enrollment::where('userId', $user->userId)->where('courseId', $courseId)
        ->update(['completionPercent' => $percent, 'completedAt' => $percent >= 100 ? now() : null]);
    }
    return response()->json(['message' => 'Lesson Completed!']);
  }
}