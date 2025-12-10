<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class CourseBundle extends Model
{
  use HasFactory;
  protected $table = 'courseBundles';
  protected $primaryKey = 'bundleId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'bundleTitle',
    'bundleDescription',
    'bundlePrice',
    'originalPrice',
    'bundleImage',
    'isActive',
  ];
  protected function casts(): array
  {
    return [
      'bundlePrice' => 'decimal:2',
      'originalPrice' => 'decimal:2',
      'isActive' => 'boolean',
    ];
  }
  public function courses()
  {
    return $this->belongsToMany(Course::class, 'bundleCourses', 'bundleId', 'courseId');
  }
}