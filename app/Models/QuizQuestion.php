<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class QuizQuestion extends Model
{
  protected $table = 'quizQuestions';
  protected $primaryKey = 'questionId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'quizId',
    'questionText',
    'options',
    'correctAnswer',
    'orderIndex',
  ];
  protected $casts = [
    'options' => 'array',
    'correctAnswer' => 'integer',
    'orderIndex' => 'integer',
  ];
  public function quiz()
  {
    return $this->belongsTo(Quiz::class, 'quizId', 'quizId');
  }
}