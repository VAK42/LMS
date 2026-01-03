<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class QuizAttempt extends Model
{
  protected $table = 'quizAttempts';
  protected $primaryKey = 'attemptId';
  public $timestamps = false;
  protected $fillable = [
    'quizId',
    'userId',
    'score',
    'answers',
    'startedAt',
    'completedAt',
  ];
  protected $casts = [
    'answers' => 'array',
    'score' => 'integer',
    'startedAt' => 'datetime',
    'completedAt' => 'datetime',
  ];
  public function quiz()
  {
    return $this->belongsTo(Quiz::class, 'quizId', 'quizId');
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}