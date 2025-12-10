<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreCourseRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->isInstructor();
  }
  public function rules(): array
  {
    return [
      'courseTitle' => 'required|string|max:255',
      'courseDescription' => 'required|string',
      'categoryId' => 'required|exists:categories,categoryId',
      'simulatedPrice' => 'required|numeric|min:0',
      'courseImage' => 'nullable|string',
    ];
  }
}