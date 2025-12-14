<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class CourseReview extends Model
{
  use HasFactory;
  protected $table = 'courseReviews';
  protected $primaryKey = 'reviewId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'courseId',
    'userId',
    'rating',
    'reviewText',
    'instructorResponse',
    'respondedAt',
    'helpfulCount',
    'notHelpfulCount',
    'isVerifiedPurchase',
  ];
  protected function casts(): array
  {
    return [
      'respondedAt' => 'datetime',
      'isVerifiedPurchase' => 'boolean',
    ];
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}