<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Course;
use Illuminate\Http\Request;
class AssessmentController extends Controller
{
  public function getAssessment(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)
      ->where('instructorId', $request->user()->userId)
      ->firstOrFail();
    $assessment = Assessment::whereHas('lesson.module', function ($q) use ($courseId) {
      $q->where('courseId', $courseId);
    })->where('assessmentType', 'assignment')->with('lesson')->first();
    if ($assessment) {
      return response()->json([
        'assessmentId' => $assessment->assessmentId,
        'assessmentTitle' => $assessment->assessmentTitle,
        'passingScore' => (int) $assessment->passingScore,
        'questions' => $assessment->questionData ?? [],
      ]);
    }
    return response()->json(null);
  }
  public function saveAssessment(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)
      ->where('instructorId', $request->user()->userId)
      ->with('modules.lessons')
      ->firstOrFail();
    $validated = $request->validate([
      'assessmentTitle' => 'required|string|max:255',
      'passingScore' => 'required|integer|min:0|max:100',
      'questions' => 'nullable|array',
      'questions.*.questionText' => 'sometimes|required|string',
      'questions.*.maxScore' => 'sometimes|required|integer|min:1',
    ]);
    $firstLesson = null;
    foreach ($course->modules as $module) {
      if ($module->lessons->count() > 0) {
        $firstLesson = $module->lessons->first();
        break;
      }
    }
    if (!$firstLesson) {
      return response()->json(['error' => 'Add At Least One Lesson First!'], 400);
    }
    $assessment = Assessment::updateOrCreate(
      ['lessonId' => $firstLesson->lessonId, 'assessmentType' => 'assignment'],
      [
        'assessmentTitle' => $validated['assessmentTitle'],
        'passingScore' => $validated['passingScore'],
        'questionData' => $validated['questions'] ?? [],
      ]
    );
    return response()->json($assessment);
  }
}