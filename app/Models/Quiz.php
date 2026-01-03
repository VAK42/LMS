<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Quiz extends Model
{
  protected $table = 'quizzes';
  protected $primaryKey = 'quizId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'courseId',
    'quizTitle',
    'passingScore',
    'timeLimitMinutes',
  ];
  protected $casts = [
    'passingScore' => 'integer',
    'timeLimitMinutes' => 'integer',
  ];
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
  public function questions()
  {
    return $this->hasMany(QuizQuestion::class, 'quizId', 'quizId')->orderBy('orderIndex');
  }
  public function attempts()
  {
    return $this->hasMany(QuizAttempt::class, 'quizId', 'quizId');
  }
}