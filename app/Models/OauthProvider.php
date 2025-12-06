<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class OauthProvider extends Model
{
  use HasFactory;
  protected $table = 'oauthProviders';
  protected $primaryKey = 'oauthId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'provider',
    'providerId',
    'accessToken',
    'refreshToken',
  ];
  protected $hidden = [
    'accessToken',
    'refreshToken',
  ];
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}