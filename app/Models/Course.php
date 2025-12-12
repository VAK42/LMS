<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Course extends Model
{
  use HasFactory;
  protected $table = 'courses';
  protected $primaryKey = 'courseId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'courseTitle',
    'courseDescription',
    'simulatedPrice',
    'courseImage',
    'instructorId',
    'categoryId',
    'courseMeta',
    'isPublished',
    'averageRating',
    'totalEnrollments',
  ];
  protected function casts(): array
  {
    return [
      'courseMeta' => 'array',
      'simulatedPrice' => 'decimal:2',
      'averageRating' => 'decimal:2',
      'isPublished' => 'boolean',
    ];
  }
  public function instructor()
  {
    return $this->belongsTo(User::class, 'instructorId', 'userId');
  }
  public function category()
  {
    return $this->belongsTo(Category::class, 'categoryId', 'categoryId');
  }
  public function modules()
  {
    return $this->hasMany(Module::class, 'courseId', 'courseId')->orderBy('orderIndex');
  }
  public function enrollments()
  {
    return $this->hasMany(Enrollment::class, 'courseId', 'courseId');
  }
  public function discussionThreads()
  {
    return $this->hasMany(DiscussionThread::class, 'courseId', 'courseId');
  }
  public function reviews()
  {
    return $this->hasMany(\App\Models\CourseReview::class, 'courseId', 'courseId');
  }
  public function bundles()
  {
    return $this->belongsToMany(\App\Models\CourseBundle::class, 'bundleCourses', 'courseId', 'bundleId');
  }
  public function scopePublished($query)
  {
    return $query->where('isPublished', true);
  }
}