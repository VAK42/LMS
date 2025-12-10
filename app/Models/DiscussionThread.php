<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class DiscussionThread extends Model
{
  use HasFactory;
  protected $table = 'discussionThreads';
  protected $primaryKey = 'threadId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'courseId',
    'userId',
    'threadTitle',
    'threadContent',
    'isPinned',
    'isClosed',
    'viewCount',
  ];
  protected function casts(): array
  {
    return [
      'isPinned' => 'boolean',
      'isClosed' => 'boolean',
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
  public function posts()
  {
    return $this->hasMany(DiscussionPost::class, 'threadId', 'threadId');
  }
}