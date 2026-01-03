<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class Wallet extends Model
{
  use HasFactory;
  protected $table = 'wallets';
  protected $primaryKey = 'walletId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'userId',
    'balance',
    'pendingBalance',
    'totalEarnings',
  ];
  protected function casts(): array
  {
    return [
      'balance' => 'decimal:2',
      'pendingBalance' => 'decimal:2',
      'totalEarnings' => 'decimal:2',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function ledgerEntries()
  {
    return $this->hasMany(LedgerEntry::class, 'walletId', 'walletId');
  }
  public function credit(float $amount, string $description, ?int $transactionId = null, ?array $metadata = null): LedgerEntry
  {
    return DB::transaction(function () use ($amount, $description, $transactionId, $metadata) {
      $this->balance += $amount;
      $this->totalEarnings += $amount;
      $this->save();
      return LedgerEntry::create([
        'walletId' => $this->walletId,
        'transactionId' => $transactionId,
        'type' => 'credit',
        'amount' => $amount,
        'balanceAfter' => $this->balance,
        'description' => $description,
        'metadata' => $metadata,
      ]);
    });
  }
  public function debit(float $amount, string $description, ?int $payoutId = null, ?array $metadata = null): LedgerEntry
  {
    return DB::transaction(function () use ($amount, $description, $payoutId, $metadata) {
      $this->balance -= $amount;
      $this->save();
      return LedgerEntry::create([
        'walletId' => $this->walletId,
        'payoutId' => $payoutId,
        'type' => 'payout',
        'amount' => $amount,
        'balanceAfter' => $this->balance,
        'description' => $description,
        'metadata' => $metadata,
      ]);
    });
  }
  public static function getOrCreateForUser(int $userId): self
  {
    return self::firstOrCreate(['userId' => $userId], [
      'balance' => 0,
      'pendingBalance' => 0,
      'totalEarnings' => 0,
    ]);
  }
}