<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class GiftCode extends Model
{
  use HasFactory;
  protected $table = 'giftCodes';
  protected $primaryKey = 'giftCodeId';
  public const createdAt = 'createdAt';
  public const updatedAt = null;
  protected $fillable = [
    'giftCode',
    'courseId',
    'purchaserId',
    'recipientEmail',
    'recipientName',
    'giftMessage',
    'isRedeemed',
    'redeemedBy',
    'redeemedAt',
    'expiresAt',
  ];
  protected function casts(): array
  {
    return [
      'isRedeemed' => 'boolean',
      'redeemedAt' => 'datetime',
      'expiresAt' => 'datetime',
    ];
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
  public function purchaser()
  {
    return $this->belongsTo(User::class, 'purchaserId', 'userId');
  }
  public function redeemer()
  {
    return $this->belongsTo(User::class, 'redeemedBy', 'userId');
  }
}