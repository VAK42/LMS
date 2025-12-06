<?php
namespace App\Http\Controllers\Api\Instructor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assessment;
class AssessmentBuilderController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'lessonId' => 'required|exists:lessons,lessonId',
      'assessmentTitle' => 'required|string',
      'assessmentType' => 'required|in:quiz,assignment,exam',
      'questionData' => 'required|array',
      'passingScore' => 'required|numeric',
    ]);
    Assessment::create($validated);
    return response()->json(['message' => 'Assessment Created!']);
  }
}