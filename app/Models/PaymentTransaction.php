<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class PaymentTransaction extends Model
{
  use HasFactory;
  protected $table = 'paymentTransactions';
  protected $primaryKey = 'transactionId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'courseId',
    'amount',
    'qrCodePath',
    'transactionStatus',
    'paymentMethod',
    'transactionMeta',
    'isRefunded',
    'refundAmount',
    'refundedAt',
    'adminNotes',
  ];
  protected function casts(): array
  {
    return [
      'amount' => 'decimal:2',
      'transactionMeta' => 'array',
      'isRefunded' => 'boolean',
      'refundAmount' => 'decimal:2',
      'refundedAt' => 'datetime',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function course()
  {
    return $this->belongsTo(Course::class, 'courseId', 'courseId');
  }
}