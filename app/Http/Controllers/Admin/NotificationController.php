<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
class NotificationController extends Controller
{
  public function index(Request $request)
  {
    $query = Notification::with('user');
    $query->whereHas('user', function ($q) {
      $q->where('userId', '!=', auth()->id());
    });
    if ($request->has('search')) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->where('notificationTitle', 'like', "%{$search}%")
          ->orWhereHas('user', function ($uq) use ($search) {
            $uq->where('userName', 'like', "%{$search}%");
          });
      });
    }
    if ($request->has('type') && $request->type !== '') {
      $query->where('notificationType', $request->type);
    }
    $notifications = $query->orderBy('createdAt', 'desc')->paginate(2);
    $users = User::where('userId', '!=', auth()->id())->get();
    return Inertia::render('Admin/NotificationManagement', [
      'notifications' => $notifications,
      'users' => $users,
      'filters' => $request->only(['search', 'type']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'notificationTitle' => 'required|string|max:255',
      'notificationMessage' => 'required|string',
      'notificationType' => 'required|in:info,warning,success,error',
      'recipientType' => 'required|in:all,role,specific',
      'recipientRole' => 'nullable|required_if:recipientType,role|in:admin,instructor,learner',
      'recipientIds' => 'nullable|required_if:recipientType,specific|array',
    ]);
    $recipients = [];
    if ($validated['recipientType'] === 'all') {
      $recipients = User::where('userId', '!=', auth()->id())->pluck('userId')->toArray();
    } elseif ($validated['recipientType'] === 'role') {
      $recipients = User::where('role', $validated['recipientRole'])->where('userId', '!=', auth()->id())->pluck('userId')->toArray();
    } else {
      $recipients = $validated['recipientIds'];
    }
    foreach ($recipients as $userId) {
      Notification::create([
        'userId' => $userId,
        'notificationTitle' => $validated['notificationTitle'],
        'notificationMessage' => $validated['notificationMessage'],
        'notificationType' => $validated['notificationType'],
        'isRead' => false,
      ]);
    }
    return redirect()->back()->with('success', 'Notification Sent To ' . count($recipients) . ' User(s)');
  }
  public function destroy($notificationId)
  {
    $notification = Notification::findOrFail($notificationId);
    $notification->delete();
    return redirect()->back()->with('success', 'Notification Deleted Successfully!');
  }
}