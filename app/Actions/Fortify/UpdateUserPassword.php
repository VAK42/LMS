<?php
namespace App\Actions\Fortify;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;
class UpdateUserPassword implements UpdatesUserPasswords
{
  use PasswordValidationRules;
  public function update($user, array $input): void
  {
    Validator::make($input, [
      'currentPassword' => ['required', 'string', 'currentPassword:web'],
      'password' => $this->passwordRules(),
    ], [
      'currentPassword.currentPassword' => 'The Provided Password Does Not Match Your Current Password!',
    ])->validate();
    $user->forceFill([
      'password' => Hash::make($input['password']),
    ])->save();
  }
}