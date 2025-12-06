<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Affiliate extends Model
{
  use HasFactory;
  protected $table = 'affiliates';
  protected $primaryKey = 'affiliateId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'affiliateCode',
    'commissionRate',
    'totalEarnings',
    'pendingEarnings',
    'totalReferrals',
    'isActive',
  ];
  protected function casts(): array
  {
    return [
      'commissionRate' => 'decimal:2',
      'totalEarnings' => 'decimal:2',
      'pendingEarnings' => 'decimal:2',
      'isActive' => 'boolean',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function referrals()
  {
    return $this->hasMany(AffiliateReferral::class, 'affiliateId', 'affiliateId');
  }
}