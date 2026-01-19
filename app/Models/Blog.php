<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Blog extends Model
{
  use HasFactory;
  protected $primaryKey = 'blogId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'instructorId',
    'title',
    'slug',
    'content',
    'thumbnail',
    'isPublished',
    'publishedAt',
    'viewCount',
  ];
  protected function casts(): array
  {
    return [
      'isPublished' => 'boolean',
      'publishedAt' => 'datetime',
      'viewCount' => 'integer',
    ];
  }
  public function instructor()
  {
    return $this->belongsTo(User::class, 'instructorId', 'userId');
  }
}