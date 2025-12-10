<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Category extends Model
{
  use HasFactory;
  protected $table = 'categories';
  protected $primaryKey = 'categoryId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'categoryName',
    'slug',
    'description',
    'icon',
    'courseCount',
  ];
  public function courses()
  {
    return $this->hasMany(Course::class, 'categoryId', 'categoryId');
  }
}