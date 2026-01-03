<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Payout extends Model
{
  use HasFactory;
  protected $table = 'payouts';
  protected $primaryKey = 'payoutId';
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  protected $fillable = [
    'instructorId',
    'amount',
    'status',
    'paymentMethod',
    'bankInfo',
    'adminNotes',
    'processedAt',
    'processedBy',
  ];
  protected function casts(): array
  {
    return [
      'amount' => 'decimal:2',
      'bankInfo' => 'array',
      'processedAt' => 'datetime',
    ];
  }
  public function instructor()
  {
    return $this->belongsTo(User::class, 'instructorId', 'userId');
  }
  public function processedByUser()
  {
    return $this->belongsTo(User::class, 'processedBy', 'userId');
  }
  public function ledgerEntries()
  {
    return $this->hasMany(LedgerEntry::class, 'payoutId', 'payoutId');
  }
}