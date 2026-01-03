<?php
namespace App\Http\Controllers\Shared;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
class NotificationController extends Controller
{
  public function index(Request $request)
  {
    $notifications = Notification::where('userId', $request->user()->userId)
      ->orderBy('createdAt', 'desc')
      ->paginate(20);
    return Inertia::render('Shared/Notifications', [
      'notifications' => $notifications,
      'user' => $request->user(),
    ]);
  }
  public function markAsRead(Request $request, $notificationId)
  {
    $notification = Notification::where('notificationId', $notificationId)
      ->where('userId', $request->user()->userId)
      ->firstOrFail();
    $notification->update(['isRead' => true]);
    return redirect()->back();
  }
  public function markAllAsRead(Request $request)
  {
    Notification::where('userId', $request->user()->userId)
      ->where('isRead', false)
      ->update(['isRead' => true]);
    return redirect()->back();
  }
  public function destroy(Request $request, $notificationId)
  {
    Notification::where('notificationId', $notificationId)
      ->where('userId', $request->user()->userId)
      ->delete();
    return redirect()->back();
  }
}