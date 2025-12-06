<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Assessment extends Model
{
  use HasFactory;
  protected $table = 'assessments';
  protected $primaryKey = 'assessmentId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'lessonId',
    'assessmentTitle',
    'assessmentType',
    'questionData',
    'passingScore',
    'timeLimit',
    'maxAttempts',
    'randomizeQuestions',
  ];
  protected function casts(): array
  {
    return [
      'questionData' => 'array',
      'passingScore' => 'decimal:2',
      'randomizeQuestions' => 'boolean',
    ];
  }
  public function lesson()
  {
    return $this->belongsTo(Lesson::class, 'lessonId', 'lessonId');
  }
  public function submissions()
  {
    return $this->hasMany(AssessmentSubmission::class, 'assessmentId', 'assessmentId');
  }
}