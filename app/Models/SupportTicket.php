<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class SupportTicket extends Model
{
  use HasFactory;
  protected $table = 'supportTickets';
  protected $primaryKey = 'ticketId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'userId',
    'subject',
    'message',
    'status',
    'priority',
    'assignedTo',
    'resolvedAt',
  ];
  protected function casts(): array
  {
    return [
      'resolvedAt' => 'datetime',
    ];
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
  public function assignee()
  {
    return $this->belongsTo(User::class, 'assignedTo', 'userId');
  }
  public function replies()
  {
    return $this->hasMany(TicketReply::class, 'ticketId', 'ticketId');
  }
}