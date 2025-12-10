<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Lesson extends Model
{
  use HasFactory;
  protected $table = 'lessons';
  protected $primaryKey = 'lessonId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'moduleId',
    'lessonTitle',
    'contentType',
    'contentData',
    'orderIndex',
    'durationMinutes',
    'isMandatory',
    'isFreePreview',
  ];
  protected function casts(): array
  {
    return [
      'contentData' => 'array',
      'isMandatory' => 'boolean',
      'isFreePreview' => 'boolean',
    ];
  }
  public function module()
  {
    return $this->belongsTo(Module::class, 'moduleId', 'moduleId');
  }
  public function assessments()
  {
    return $this->hasMany(Assessment::class, 'lessonId', 'lessonId');
  }
  public function progress()
  {
    return $this->hasMany(Progress::class, 'lessonId', 'lessonId');
  }
}