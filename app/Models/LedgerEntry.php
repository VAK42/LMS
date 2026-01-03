<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class LedgerEntry extends Model
{
  use HasFactory;
  protected $table = 'ledgerEntries';
  protected $primaryKey = 'ledgerId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = null;
  protected $fillable = [
    'walletId',
    'transactionId',
    'payoutId',
    'type',
    'amount',
    'balanceAfter',
    'description',
    'metadata',
  ];
  protected function casts(): array
  {
    return [
      'amount' => 'decimal:2',
      'balanceAfter' => 'decimal:2',
      'metadata' => 'array',
    ];
  }
  public function wallet()
  {
    return $this->belongsTo(Wallet::class, 'walletId', 'walletId');
  }
  public function transaction()
  {
    return $this->belongsTo(PaymentTransaction::class, 'transactionId', 'transactionId');
  }
  public function payout()
  {
    return $this->belongsTo(Payout::class, 'payoutId', 'payoutId');
  }
}