<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Leaderboard extends Model
{
  use HasFactory;
  protected $table = 'leaderboard';
  protected $primaryKey = 'leaderboardId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'totalPoints',
    'rank',
    'achievements',
  ];
  protected function casts(): array
  {
    return [
      'achievements' => 'array',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}