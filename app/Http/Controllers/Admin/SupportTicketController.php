<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;
class SupportTicketController extends Controller
{
  public function index(Request $request)
  {
    $query = SupportTicket::with('user');
    if ($request->has('search')) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->where('subject', 'like', "%{$search}%")
          ->orWhereHas('user', function ($uq) use ($search) {
            $uq->where('userName', 'like', "%{$search}%");
          });
      });
    }
    if ($request->has('status') && $request->status !== '') {
      $query->where('ticketStatus', $request->status);
    }
    if ($request->has('priority') && $request->priority !== '') {
      $query->where('priority', $request->priority);
    }
    $tickets = $query->orderBy('createdAt', 'desc')->orderBy('ticketId', 'desc')->paginate(2);
    return Inertia::render('Admin/SupportTicketManagement', [
      'tickets' => $tickets,
      'filters' => $request->only(['search', 'status', 'priority']),
      'user' => auth()->user()
    ]);
  }
  public function update(Request $request, $ticketId)
  {
    $ticket = SupportTicket::findOrFail($ticketId);
    $validated = $request->validate([
      'ticketStatus' => 'required|in:open,inProgress,resolved,closed',
      'priority' => 'required|in:low,medium,high,urgent',
      'adminResponse' => 'nullable|string',
    ]);
    if ($validated['ticketStatus'] === 'resolved' || $validated['ticketStatus'] === 'closed') {
      $validated['resolvedAt'] = now();
    }
    $ticket->update($validated);
    return redirect()->back()->with('success', 'Support Ticket Updated Successfully!');
  }
  public function destroy($ticketId)
  {
    $ticket = SupportTicket::findOrFail($ticketId);
    $ticket->delete();
    return redirect()->back()->with('success', 'Support Ticket Deleted Successfully!');
  }
  public function export()
  {
    $tickets = SupportTicket::with('user')->get();
    return response()->json($tickets);
  }
}