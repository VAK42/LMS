<?php
namespace App\Actions\Fortify;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
class CreateNewUser implements CreatesNewUsers
{
  use PasswordValidationRules;
  public function create(array $input): User
  {
    Validator::make($input, [
      'userName' => ['required', 'string', 'max:255'],
      'userEmail' => ['required', 'string', 'email', 'max:255', 'unique:users'],
      'password' => $this->passwordRules(),
      'role' => ['required', 'string', 'in:learner,instructor'],
    ])->validate();
    return User::create([
      'userName' => $input['userName'],
      'userEmail' => $input['userEmail'],
      'password' => Hash::make($input['password']),
      'role' => $input['role'] ?? 'learner',
    ]);
  }
}