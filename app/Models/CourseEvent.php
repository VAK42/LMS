<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class CourseEvent extends Model
{
  use HasFactory;
  protected $table = 'courseEvents';
  protected $primaryKey = 'eventId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'courseId',
    'eventTitle',
    'eventDescription',
    'eventType',
    'eventDate',
    'durationMinutes',
    'meetingLink',
  ];
  protected function casts(): array
  {
    return [
      'eventDate' => 'datetime',
    ];
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
}