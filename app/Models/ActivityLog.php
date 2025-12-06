<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class ActivityLog extends Model
{
  use HasFactory;
  protected $table = 'activityLogs';
  protected $primaryKey = 'logId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'actionType',
    'resourceType',
    'resourceId',
    'actionMetadata',
    'ipAddress',
    'userAgent',
  ];
  protected function casts(): array
  {
    return [
      'actionMetadata' => 'array',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}