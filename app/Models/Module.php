<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Module extends Model
{
  use HasFactory;
  protected $table = 'modules';
  protected $primaryKey = 'moduleId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
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