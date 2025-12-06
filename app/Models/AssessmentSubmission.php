<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class AssessmentSubmission extends Model
{
  use HasFactory;
  protected $table = 'assessmentSubmissions';
  protected $primaryKey = 'submissionId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'assessmentId',
    'userId',
    'answerData',
    'submissionData',
    'score',
    'attemptNumber',
    'isPassed',
    'instructorFeedback',
    'submittedAt',
    'gradedAt',
  ];
  protected function casts(): array
  {
    return [
      'answerData' => 'array',
      'submissionData' => 'json',
      'score' => 'decimal:2',
      'isPassed' => 'boolean',
      'submittedAt' => 'datetime',
      'gradedAt' => 'datetime',
    ];
  }
  public function assessment()
  {
    return $this->belongsTo(Assessment::class, 'assessmentId', 'assessmentId');
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}