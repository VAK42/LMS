<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Locale extends Model
{
  use HasFactory;
  protected $table = 'locales';
  protected $primaryKey = 'localeId';
  public const createdAt = 'createdAt';
  public const updatedAt = null;
  protected $fillable = [
    'code',
    'name',
    'isActive',
  ];
  protected function casts(): array
  {
    return [
      'isActive' => 'boolean',
    ];
  }
}