<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreAssessmentRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->isInstructor();
  }
  public function rules(): array
  {
    return [
      'lessonId' => 'required|exists:lessons,lessonId',
      'assessmentTitle' => 'required|string|max:255',
      'assessmentType' => 'required|in:quiz,assignment,exam',
      'questionData' => 'required|array',
      'passingScore' => 'required|numeric|min:0|max:100',
      'timeLimit' => 'nullable|integer|min:1',
      'maxAttempts' => 'required|integer|min:1',
    ];
  }
}