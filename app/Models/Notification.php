<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Notification extends Model
{
  use HasFactory;
  protected $table = 'notifications';
  protected $primaryKey = 'notificationId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'notificationType',
    'notificationTitle',
    'notificationContent',
    'notificationData',
    'isRead',
    'readAt',
  ];
  protected function casts(): array
  {
    return [
      'notificationData' => 'array',
      'isRead' => 'boolean',
      'readAt' => 'datetime',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}