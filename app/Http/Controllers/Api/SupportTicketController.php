<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SupportTicket;
use App\Models\TicketReply;
class SupportTicketController extends Controller
{
  public function index(Request $request)
  {
    $tickets = SupportTicket::where('userId', $request->user()->userId)
      ->with('replies')
      ->orderBy('createdAt', 'desc')
      ->get();
    return Inertia::render('SupportTickets', [
      'tickets' => $tickets,
      'user' => $request->user(),
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'subject' => 'required|string|max:255',
      'message' => 'required|string',
      'priority' => 'required|in:low,medium,high',
    ]);
    $ticket = SupportTicket::create([
      'userId' => $request->user()->userId,
      'subject' => $validated['subject'],
      'message' => $validated['message'],
      'priority' => $validated['priority'],
      'status' => 'open',
    ]);
    return response()->json(['message' => 'Ticket Created!', 'ticket' => $ticket]);
  }
  public function show(Request $request, $ticketId)
  {
    $ticket = SupportTicket::where('ticketId', $ticketId)
      ->where('userId', $request->user()->userId)
      ->with(['replies.user'])
      ->firstOrFail();
    return response()->json($ticket);
  }
  public function reply(Request $request, $ticketId)
  {
    $ticket = SupportTicket::where('ticketId', $ticketId)
      ->where('userId', $request->user()->userId)
      ->firstOrFail();
    $validated = $request->validate([
      'message' => 'required|string',
    ]);
    $reply = TicketReply::create([
      'ticketId' => $ticketId,
      'userId' => $request->user()->userId,
      'message' => $validated['message'],
      'isStaffReply' => false,
    ]);
    return response()->json(['message' => 'Reply Added!', 'reply' => $reply]);
  }
  public function close(Request $request, $ticketId)
  {
    $ticket = SupportTicket::where('ticketId', $ticketId)
      ->where('userId', $request->user()->userId)
      ->firstOrFail();
    $ticket->update(['status' => 'closed']);
    return response()->json(['message' => 'Ticket Closed!']);
  }
}