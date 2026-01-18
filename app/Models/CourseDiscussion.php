<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class CourseDiscussion extends Model
{
  use HasFactory;
  protected $table = 'courseDiscussions';
  protected $primaryKey = 'discussionId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'courseId',
    'userId',
    'parentId',
    'title',
    'content',
  ];
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function replies()
  {
    return $this->hasMany(CourseDiscussion::class, 'parentId', 'discussionId')->with('user');
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
}