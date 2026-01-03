<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
class QuizController extends Controller
{
  public function show(Request $request, $quizId)
  {
    $quiz = Quiz::with('questions', 'course')->findOrFail($quizId);
    $enrollment = Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $quiz->courseId)
      ->first();
    if (!$enrollment) {
      abort(403, 'Not Enrolled In This Course!');
    }
    $lastAttempt = QuizAttempt::where('quizId', $quizId)
      ->where('userId', $request->user()->userId)
      ->orderBy('startedAt', 'desc')
      ->first();
    return Inertia::render('Learner/Quiz', [
      'quiz' => $quiz,
      'lastAttempt' => $lastAttempt,
      'user' => $request->user(),
    ]);
  }
  public function submit(Request $request, $quizId)
  {
    $quiz = Quiz::with('questions')->findOrFail($quizId);
    $enrollment = Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $quiz->courseId)
      ->first();
    if (!$enrollment) {
      return response()->json(['error' => 'Not Enrolled!'], 403);
    }
    $validated = $request->validate([
      'answers' => 'required|array',
    ]);
    $answers = $validated['answers'];
    $correctCount = 0;
    $totalQuestions = $quiz->questions->count();
    foreach ($quiz->questions as $question) {
      $userAnswer = $answers[$question->questionId] ?? null;
      if ($userAnswer !== null && (int)$userAnswer === $question->correctAnswer) {
        $correctCount++;
      }
    }
    $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;
    $passed = $score >= $quiz->passingScore;
    $attempt = QuizAttempt::create([
      'quizId' => $quizId,
      'userId' => $request->user()->userId,
      'score' => $score,
      'answers' => $answers,
      'completedAt' => now(),
    ]);
    return response()->json([
      'score' => $score,
      'passed' => $passed,
      'correctCount' => $correctCount,
      'totalQuestions' => $totalQuestions,
      'attemptId' => $attempt->attemptId,
    ]);
  }
}