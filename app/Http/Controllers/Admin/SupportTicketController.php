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
      $query->where('status', $request->status);
    }
    if ($request->has('priority') && $request->priority !== '') {
      $query->where('priority', $request->priority);
    }
    $tickets = $query->orderBy('createdAt', 'desc')->orderBy('ticketId', 'desc')->paginate(2);
    $users = \App\Models\User::select('userId', 'userName', 'userEmail')
      ->where('role', '!=', 'admin')
      ->orderBy('userName')
      ->get();
    return Inertia::render('Admin/SupportTicketManagement', [
      'tickets' => $tickets,
      'users' => $users,
      'filters' => $request->only(['search', 'status', 'priority']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'userId' => 'required|exists:users,userId',
      'subject' => 'required|string|max:255',
      'message' => 'required|string',
      'status' => 'required|in:open,inProgress,resolved,closed',
      'priority' => 'required|in:low,medium,high,urgent',
      'assignedTo' => 'nullable|exists:users,userId',
    ]);
    SupportTicket::create($validated);
    return redirect()->back()->with('success', 'Support Ticket Created Successfully!');
  }
  public function update(Request $request, $ticketId)
  {
    $ticket = SupportTicket::findOrFail($ticketId);
    $validated = $request->validate([
      'subject' => 'required|string|max:255',
      'message' => 'required|string',
      'status' => 'required|in:open,inProgress,resolved,closed',
      'priority' => 'required|in:low,medium,high,urgent',
      'adminResponse' => 'nullable|string',
    ]);
    if (($validated['status'] === 'resolved' || $validated['status'] === 'closed') && $ticket->status !== 'resolved' && $ticket->status !== 'closed') {
      $validated['resolvedAt'] = now();
    }
    $ticket->update($validated);
    if (!empty($validated['adminResponse'])) {
      \App\Models\TicketReply::create([
        'ticketId' => $ticket->ticketId,
        'userId' => auth()->id(),
        'message' => $validated['adminResponse'],
        'isStaffReply' => true
      ]);
    }
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