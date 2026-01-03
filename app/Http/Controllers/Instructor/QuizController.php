<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Course;
use Illuminate\Http\Request;
class QuizController extends Controller
{
  public function getQuiz(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)
      ->where('instructorId', $request->user()->userId)
      ->firstOrFail();
    $quiz = Quiz::where('courseId', $courseId)->with('questions')->first();
    return response()->json($quiz);
  }
  public function saveQuiz(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)
      ->where('instructorId', $request->user()->userId)
      ->firstOrFail();
    $validated = $request->validate([
      'quizTitle' => 'required|string|max:255',
      'passingScore' => 'required|integer|min:0|max:100',
      'timeLimitMinutes' => 'nullable|integer|min:1',
      'questions' => 'nullable|array',
      'questions.*.questionText' => 'sometimes|required|string',
      'questions.*.options' => 'sometimes|required|array|size:4',
      'questions.*.options.*' => 'sometimes|required|string',
      'questions.*.correctAnswer' => 'sometimes|required|integer|min:0|max:3',
    ]);
    $quiz = Quiz::updateOrCreate(
      ['courseId' => $courseId],
      [
        'quizTitle' => $validated['quizTitle'],
        'passingScore' => $validated['passingScore'],
        'timeLimitMinutes' => $validated['timeLimitMinutes'] ?? null,
      ]
    );
    if (isset($validated['questions'])) {
      QuizQuestion::where('quizId', $quiz->quizId)->delete();
      foreach ($validated['questions'] as $index => $q) {
        QuizQuestion::create([
          'quizId' => $quiz->quizId,
          'questionText' => $q['questionText'],
          'options' => $q['options'],
          'correctAnswer' => $q['correctAnswer'],
          'orderIndex' => $index + 1,
        ]);
      }
    }
    $quiz->load('questions');
    return response()->json($quiz);
  }
  public function addQuestion(Request $request, $quizId)
  {
    $quiz = Quiz::whereHas('course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('quizId', $quizId)->firstOrFail();
    $validated = $request->validate([
      'questionText' => 'required|string',
      'options' => 'required|array|size:4',
      'options.*' => 'required|string',
      'correctAnswer' => 'required|integer|min:0|max:3',
    ]);
    $maxOrder = QuizQuestion::where('quizId', $quizId)->max('orderIndex') ?? 0;
    $question = QuizQuestion::create([
      'quizId' => $quizId,
      'questionText' => $validated['questionText'],
      'options' => $validated['options'],
      'correctAnswer' => $validated['correctAnswer'],
      'orderIndex' => $maxOrder + 1,
    ]);
    return response()->json($question);
  }
  public function updateQuestion(Request $request, $questionId)
  {
    $question = QuizQuestion::whereHas('quiz.course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('questionId', $questionId)->firstOrFail();
    $validated = $request->validate([
      'questionText' => 'required|string',
      'options' => 'required|array|size:4',
      'options.*' => 'required|string',
      'correctAnswer' => 'required|integer|min:0|max:3',
    ]);
    $question->update($validated);
    return response()->json($question);
  }
  public function deleteQuestion(Request $request, $questionId)
  {
    $question = QuizQuestion::whereHas('quiz.course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('questionId', $questionId)->firstOrFail();
    $question->delete();
    return response()->json(['message' => 'Question Deleted!']);
  }
}