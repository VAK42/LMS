<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class PaymentTransaction extends Model
{
  use HasFactory;
  protected $table = 'paymentTransactions';
  protected $primaryKey = 'transactionId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'userId',
    'courseId',
    'amount',
    'instructorAmount',
    'platformFee',
    'escrowReleasedAt',
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
      'instructorAmount' => 'decimal:2',
      'platformFee' => 'decimal:2',
      'escrowReleasedAt' => 'datetime',
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
  public function ledgerEntries()
  {
    return $this->hasMany(LedgerEntry::class, 'transactionId', 'transactionId');
  }
}