<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Module extends Model
{
  use HasFactory;
  protected $table = 'modules';
  protected $primaryKey = 'moduleId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'courseId',
    'moduleTitle',
    'moduleDescription',
    'orderIndex',
    'durationMinutes',
  ];
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
  public function lessons()
  {
    return $this->hasMany(Lesson::class, 'moduleId', 'moduleId')->orderBy('orderIndex');
  }
}