<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class LessonNote extends Model
{
  use HasFactory;
  protected $table = 'lessonNotes';
  protected $primaryKey = 'noteId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'lessonId',
    'noteContent',
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