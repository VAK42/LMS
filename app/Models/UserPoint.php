<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class UserPoint extends Model
{
  use HasFactory;
  protected $table = 'userPoints';
  protected $primaryKey = 'pointId';
  public const createdAt = null;
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'totalPoints',
    'currentStreak',
    'longestStreak',
    'lastActivityDate',
    'level',
  ];
  protected function casts(): array
  {
    return [
      'lastActivityDate' => 'date',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}