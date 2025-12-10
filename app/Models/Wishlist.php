<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Wishlist extends Model
{
  use HasFactory;
  protected $table = 'wishlists';
  protected $primaryKey = 'wishlistId';
  public const createdAt = 'createdAt';
  public const updatedAt = null;
  protected $fillable = [
    'userId',
    'courseId',
  ];
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
}