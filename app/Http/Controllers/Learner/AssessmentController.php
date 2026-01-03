<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\Enrollment;
use Inertia\Inertia;
class AssessmentController extends Controller
{
  public function show(Request $request, $assessmentId)
  {
    $assessment = Assessment::with('lesson.module.course')->findOrFail($assessmentId);
    $courseId = $assessment->lesson->module->course->courseId;
    $enrollment = Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $courseId)
      ->first();
    if (!$enrollment) {
      abort(403, 'Not Enrolled In This Course!');
    }
    $submission = AssessmentSubmission::where('userId', $request->user()->userId)
      ->where('assessmentId', $assessmentId)
      ->orderBy('submittedAt', 'desc')
      ->first();
    return Inertia::render('Learner/Essay', [
      'assessment' => $assessment,
      'submission' => $submission ? [
        'submissionId' => $submission->submissionId,
        'answers' => $submission->answerData,
        'score' => $submission->score,
        'feedback' => $submission->instructorFeedback,
        'submittedAt' => $submission->submittedAt,
        'isGraded' => $submission->score !== null,
      ] : null,
      'user' => $request->user(),
    ]);
  }
  public function submit(Request $request, $assessmentId)
  {
    $assessment = Assessment::with('lesson.module.course')->findOrFail($assessmentId);
    $courseId = $assessment->lesson->module->course->courseId;
    $enrollment = Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $courseId)
      ->first();
    if (!$enrollment) {
      return response()->json(['error' => 'Not Enrolled!'], 403);
    }
    $validated = $request->validate([
      'answers' => 'required|array',
    ]);
    $previousAttempts = AssessmentSubmission::where('userId', $request->user()->userId)
      ->where('assessmentId', $assessmentId)
      ->count();
    $submission = AssessmentSubmission::create([
      'assessmentId' => $assessmentId,
      'userId' => $request->user()->userId,
      'answerData' => $validated['answers'],
      'submittedAt' => now(),
      'attemptNumber' => $previousAttempts + 1,
    ]);
    return response()->json(['message' => 'Essay Submitted!', 'submissionId' => $submission->submissionId]);
  }
}