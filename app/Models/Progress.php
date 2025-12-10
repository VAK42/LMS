<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Progress extends Model
{
  use HasFactory;
  protected $table = 'progress';
  protected $primaryKey = 'progressId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'lessonId',
    'isCompleted',
    'completionPercent',
    'timeSpentSeconds',
    'score',
    'startedAt',
    'completedAt',
  ];
  protected function casts(): array
  {
    return [
      'isCompleted' => 'boolean',
      'completionPercent' => 'decimal:2',
      'score' => 'decimal:2',
      'startedAt' => 'datetime',
      'completedAt' => 'datetime',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function lesson()
  {
    return $this->belongsTo(Lesson::class, 'lessonId', 'lessonId');
  }
}