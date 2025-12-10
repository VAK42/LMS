<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Enrollment extends Model
{
  use HasFactory;
  protected $table = 'enrollments';
  protected $primaryKey = null;
  public $incrementing = false;
  protected $keyType = 'string';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'courseId',
    'enrollmentDate',
    'isPaid',
    'completionPercent',
    'completedAt',
  ];
  protected function casts(): array
  {
    return [
      'enrollmentDate' => 'datetime',
      'completedAt' => 'datetime',
      'isPaid' => 'boolean',
      'completionPercent' => 'decimal:2',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
}