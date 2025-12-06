<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Badge extends Model
{
  use HasFactory;
  protected $table = 'badges';
  protected $primaryKey = 'badgeId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'badgeName',
    'badgeDescription',
    'badgeIcon',
    'requiredPoints',
  ];
}