<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class PeerReview extends Model
{
  use HasFactory;
  protected $table = 'peerReviews';
  protected $primaryKey = 'peerReviewId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'submissionId',
    'reviewerId',
    'score',
    'feedback',
    'rubricScores',
    'completedAt',
  ];
  protected function casts(): array
  {
    return [
      'rubricScores' => 'array',
      'completedAt' => 'datetime',
    ];
  }
  public function submission()
  {
    return $this->belongsTo(AssessmentSubmission::class, 'submissionId', 'submissionId');
  }
  public function reviewer()
  {
    return $this->belongsTo(User::class, 'reviewerId', 'userId');
  }
}