<?php
namespace App\Actions\Fortify;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
  public function update($user, array $input): void
  {
    Validator::make($input, [
      'userName' => ['required', 'string', 'max:255'],
      'userEmail' => [
        'required',
        'string',
        'email',
        'max:255',
        Rule::unique('users')->ignore($user->userId, 'userId'),
      ],
    ])->validate();
    if ($input['userEmail'] !== $user->userEmail &&
      $user instanceof MustVerifyEmail) {
      $this->updateVerifiedUser($user, $input);
    } else {
      $user->forceFill([
        'userName' => $input['userName'],
        'userEmail' => $input['userEmail'],
      ])->save();
    }
  }
  protected function updateVerifiedUser($user, array $input): void
  {
    $user->forceFill([
      'userName' => $input['userName'],
      'userEmail' => $input['userEmail'],
      'emailVerifiedAt' => null,
    ])->save();
    $user->sendEmailVerificationNotification();
  }
}