<?php
namespace App\Policies;
use App\Models\User;
use App\Models\Course;
class CoursePolicy
{
  public function viewAny(User $user)
  {
    return true;
  }
  public function view(User $user, Course $course)
  {
    return $course->isPublished || $user->userId === $course->instructorId || $user->role === 'admin';
  }
  public function create(User $user)
  {
    return $user->role === 'instructor' || $user->role === 'admin';
  }
  public function update(User $user, Course $course)
  {
    return $user->userId === $course->instructorId || $user->role === 'admin';
  }
  public function delete(User $user, Course $course)
  {
    return $user->userId === $course->instructorId || $user->role === 'admin';
  }
  public function publish(User $user, Course $course)
  {
    return $user->userId === $course->instructorId || $user->role === 'admin';
  }
}