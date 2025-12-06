<?php
namespace App\Providers;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
class AuthServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    $this->registerPolicies();
    Gate::define('manageCourses', function ($user) {
      return in_array($user->role, ['admin', 'instructor']);
    });
    Gate::define('manageUsers', function ($user) {
      return $user->role === 'admin';
    });
    Gate::define('gradeSubmissions', function ($user) {
      return in_array($user->role, ['admin', 'instructor']);
    });
  }
}