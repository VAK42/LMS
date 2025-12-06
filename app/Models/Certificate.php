<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Certificate extends Model
{
  use HasFactory;
  protected $table = 'certificates';
  protected $primaryKey = 'certificateId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'courseId',
    'uniqueCode',
    'pdfPath',
    'issuedAt',
  ];
  protected function casts(): array
  {
    return [
      'issuedAt' => 'datetime',
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