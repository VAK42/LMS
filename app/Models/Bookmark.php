<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Bookmark extends Model
{
  use HasFactory;
  protected $table = 'bookmarks';
  protected $primaryKey = 'bookmarkId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'lessonId',
    'note',
    'videoTimestamp',
  ];
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function lesson()
  {
    return $this->belongsTo(Lesson::class, 'lessonId', 'lessonId');
  }
}