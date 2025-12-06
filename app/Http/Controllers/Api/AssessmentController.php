<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use Inertia\Inertia;
class AssessmentController extends Controller
{
  public function show($assessmentId)
  {
    $assessment = Assessment::with('lesson.module.course')->findOrFail($assessmentId);
    return Inertia::render('AssessmentTaking', [
      'assessment' => $assessment,
    ]);
  }
  public function submit(Request $request, $assessmentId)
  {
    $validated = $request->validate([
      'submissionData' => 'required|json',
    ]);
    $previousAttempts = AssessmentSubmission::where('userId', $request->user()->userId)
      ->where('assessmentId', $assessmentId)
      ->count();
    $submission = AssessmentSubmission::create([
      'assessmentId' => $assessmentId,
      'userId' => $request->user()->userId,
      'submissionData' => $validated['submissionData'],
      'submittedAt' => now(),
      'attemptNumber' => $previousAttempts + 1,
    ]);
    return response()->json(['message' => 'Assessment Submitted', 'submission' => $submission]);
  }
}