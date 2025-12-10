<?php
namespace App\Http\Controllers\Api\Instructor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AssessmentSubmission;
class GradingController extends Controller
{
  public function index(Request $request)
  {
    $submissions = AssessmentSubmission::with(['user', 'assessment'])
      ->whereHas('assessment.lesson.module.course', function ($q) use ($request) {
        $q->where('instructorId', $request->user()->userId);
      })
      ->orderBy('submittedAt', 'desc')
      ->paginate(20);
    return Inertia::render('Instructor/Grading', [
      'submissions' => $submissions,
    ]);
  }
  public function grade(Request $request, $submissionId)
  {
    $validated = $request->validate([
      'score' => 'required|numeric',
      'instructorFeedback' => 'nullable|string',
    ]);
    AssessmentSubmission::findOrFail($submissionId)->update([
      'score' => $validated['score'],
      'instructorFeedback' => $validated['instructorFeedback'] ?? null,
      'gradedAt' => now(),
    ]);
    return response()->json(['message' => 'Submission Graded!']);
  }
}