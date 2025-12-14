<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Category extends Model
{
  use HasFactory;
  protected $table = 'categories';
  protected $primaryKey = 'categoryId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'categoryName',
    'slug',
    'description',
    'icon',
    'courseCount',
  ];
  protected $appends = ['categoryDescription'];
  public function getCategoryDescriptionAttribute()
  {
    return $this->description;
  }
  public function courses()
  {
    return $this->hasMany(Course::class, 'categoryId', 'categoryId');
  }
}