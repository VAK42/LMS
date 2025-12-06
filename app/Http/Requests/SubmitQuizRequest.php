<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class SubmitQuizRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }
  public function rules(): array
  {
    return [
      'assessmentId' => 'required|exists:assessments,assessmentId',
      'answers' => 'required|array',
    ];
  }
}