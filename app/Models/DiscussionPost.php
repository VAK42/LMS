<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class DiscussionPost extends Model
{
  use HasFactory;
  protected $table = 'discussionPosts';
  protected $primaryKey = 'postId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'threadId',
    'userId',
    'parentPostId',
    'postContent',
    'isAcceptedAnswer',
    'likeCount',
  ];
  protected function casts(): array
  {
    return [
      'isAcceptedAnswer' => 'boolean',
    ];
  }
  public function thread()
  {
    return $this->belongsTo(DiscussionThread::class, 'threadId', 'threadId');
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function parentPost()
  {
    return $this->belongsTo(DiscussionPost::class, 'parentPostId', 'postId');
  }
  public function replies()
  {
    return $this->hasMany(DiscussionPost::class, 'parentPostId', 'postId');
  }
}