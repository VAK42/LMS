<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;
  protected $table = 'users';
  protected $primaryKey = 'userId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'userName',
    'userEmail',
    'password',
    'role',
    'avatarPath',
    'emailVerifiedAt',
    'twoFactorSecret',
    'twoFactorRecoveryCodes',
    'twoFactorConfirmedAt',
    'preferredLocale',
    'bio',
    'website',
    'twitter',
    'linkedin',
    'github',
    'notificationPreferences',
    'privacySettings',
    'showProfile',
    'showProgress',
  ];
  protected $hidden = [
    'password',
    'rememberToken',
    'twoFactorSecret',
    'twoFactorRecoveryCodes',
  ];
  protected $casts = [
    'emailVerifiedAt' => 'datetime',
    'twoFactorConfirmedAt' => 'datetime',
    'password' => 'hashed',
    'notificationPreferences' => 'array',
    'privacySettings' => 'array',
    'showProfile' => 'boolean',
    'showProgress' => 'boolean',
  ];
  public function courses()
  {
    return $this->hasMany(Course::class, 'instructorId', 'userId');
  }
  public function enrollments()
  {
    return $this->hasMany(Enrollment::class, 'userId', 'userId');
  }
  public function progress()
  {
    return $this->hasMany(Progress::class, 'userId', 'userId');
  }
  public function assessmentSubmissions()
  {
    return $this->hasMany(AssessmentSubmission::class, 'userId', 'userId');
  }
  public function certificates()
  {
    return $this->hasMany(Certificate::class, 'userId', 'userId');
  }
  public function notifications()
  {
    return $this->hasMany(Notification::class, 'userId', 'userId');
  }
  public function activityLogs()
  {
    return $this->hasMany(ActivityLog::class, 'userId', 'userId');
  }
  public function isAdmin()
  {
    return $this->role === 'admin';
  }
  public function isInstructor()
  {
    return $this->role === 'instructor';
  }
  public function isLearner()
  {
    return $this->role === 'learner';
  }
  public function isAdminOrInstructor()
  {
    return $this->role === 'admin' || $this->role === 'instructor';
  }
  public function supportTickets()
  {
    return $this->hasMany(\App\Models\SupportTicket::class, 'userId', 'userId');
  }
  public function oauthProviders()
  {
    return $this->hasMany(\App\Models\OauthProvider::class, 'userId', 'userId');
  }
  public function affiliate()
  {
    return $this->hasOne(\App\Models\Affiliate::class, 'userId', 'userId');
  }
  public function leaderboard()
  {
    return $this->hasOne(\App\Models\Leaderboard::class, 'userId', 'userId');
  }
  public function bookmarks()
  {
    return $this->hasMany(\App\Models\Bookmark::class, 'userId', 'userId');
  }
  public function wishlists()
  {
    return $this->hasMany(\App\Models\Wishlist::class, 'userId', 'userId');
  }
  public function getRememberTokenName()
  {
    return 'rememberToken';
  }
}