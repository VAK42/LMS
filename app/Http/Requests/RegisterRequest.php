<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class RegisterRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }
  public function rules(): array
  {
    return [
      'userName' => 'required|string|max:255',
      'userEmail' => 'required|email|unique:users,userEmail',
      'password' => 'required|string|min:8|confirmed',
    ];
  }
}