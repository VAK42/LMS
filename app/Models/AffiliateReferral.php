<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class AffiliateReferral extends Model
{
  use HasFactory;
  protected $table = 'affiliateReferrals';
  protected $primaryKey = 'referralId';
  public const createdAt = 'createdAt';
  public const updatedAt = null;
  protected $fillable = [
    'affiliateId',
    'referredUserId',
    'enrollmentId',
    'commissionAmount',
    'commissionStatus',
    'convertedAt',
    'paidAt',
  ];
  protected function casts(): array
  {
    return [
      'commissionAmount' => 'decimal:2',
      'convertedAt' => 'datetime',
      'paidAt' => 'datetime',
    ];
  }
  public function affiliate()
  {
    return $this->belongsTo(Affiliate::class, 'affiliateId', 'affiliateId');
  }
  public function referredUser()
  {
    return $this->belongsTo(User::class, 'referredUserId', 'userId');
  }
}