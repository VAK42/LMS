<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Coupon extends Model
{
  use HasFactory;
  protected $table = 'coupons';
  protected $primaryKey = 'couponId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'couponCode',
    'discountType',
    'discountValue',
    'minPurchase',
    'usageLimit',
    'usageCount',
    'validFrom',
    'validUntil',
    'isActive',
    'courseId',
  ];
  protected function casts(): array
  {
    return [
      'discountValue' => 'decimal:2',
      'minPurchase' => 'decimal:2',
      'validFrom' => 'datetime',
      'validUntil' => 'datetime',
      'isActive' => 'boolean',
    ];
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
}