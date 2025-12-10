<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class TicketReply extends Model
{
  use HasFactory;
  protected $table = 'ticketReplies';
  protected $primaryKey = 'replyId';
  public const createdAt = 'createdAt';
  public const updatedAt = 'updatedAt';
  protected $fillable = [
    'ticketId',
    'userId',
    'message',
    'isStaffReply',
  ];
  protected function casts(): array
  {
    return [
      'isStaffReply' => 'boolean',
    ];
  }
  public function ticket()
  {
    return $this->belongsTo(SupportTicket::class, 'ticketId', 'ticketId');
  }
  public function user()
  {
    return $this->belongsTo(User::class, 'userId', 'userId');
  }
}