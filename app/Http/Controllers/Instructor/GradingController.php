<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AssessmentSubmission;
class GradingController extends Controller
{
  public function index()
  {
    $submissions = AssessmentSubmission::with(['assessment.lesson.module.course', 'user'])
      ->whereHas('assessment.lesson.module.course', function ($q) {
        $q->where('instructorId', auth()->id());
      })
      ->orderBy('submittedAt', 'desc')
      ->paginate(20);
    $submissions->getCollection()->transform(function ($submission) {
      return [
        'submissionId' => $submission->submissionId,
        'score' => $submission->score,
        'feedback' => $submission->instructorFeedback,
        'submittedAt' => $submission->submittedAt,
        'answers' => $submission->answerData,
        'user' => [
          'userId' => $submission->user->userId,
          'userName' => $submission->user->userName,
          'userEmail' => $submission->user->userEmail,
        ],
        'assessment' => [
          'assessmentId' => $submission->assessment->assessmentId,
          'assessmentTitle' => $submission->assessment->assessmentTitle,
          'passingScore' => (int) $submission->assessment->passingScore,
          'lesson' => [
            'lessonTitle' => $submission->assessment->lesson->lessonTitle,
            'module' => [
              'moduleTitle' => $submission->assessment->lesson->module->moduleTitle,
              'course' => [
                'courseTitle' => $submission->assessment->lesson->module->course->courseTitle,
              ]
            ]
          ]
        ]
      ];
    });
    return Inertia::render('Instructor/Grading', [
      'submissions' => $submissions,
    ]);
  }
  public function grade(Request $request, $submissionId)
  {
    $validated = $request->validate([
      'score' => 'required|numeric|min:0|max:100',
      'feedback' => 'nullable|string',
    ]);
    AssessmentSubmission::whereHas('assessment.lesson.module.course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('submissionId', $submissionId)->firstOrFail()->update([
      'score' => $validated['score'],
      'feedback' => $validated['feedback'] ?? null,
    ]);
    return response()->json(['message' => 'Grade Saved!']);
  }
}