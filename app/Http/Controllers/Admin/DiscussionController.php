<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\CourseDiscussion;
use Illuminate\Http\Request;
use Inertia\Inertia;
class DiscussionController extends Controller
{
  public function index(Request $request)
  {
    $query = CourseDiscussion::with(['user', 'course'])
      ->whereNull('parentId');
    if ($request->input('search')) {
      $search = $request->input('search');
      $query->where(function($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('content', 'like', "%{$search}%")
          ->orWhereHas('user', function($q) use ($search) {
            $q->where('userName', 'like', "%{$search}%");
          })
          ->orWhereHas('course', function($q) use ($search) {
            $q->where('courseTitle', 'like', "%{$search}%");
          });
      });
    }
    $discussions = $query->orderBy('createdAt', 'desc')
      ->paginate(2)
      ->withQueryString()
      ->through(function ($discussion) {
        return [
          'discussionId' => $discussion->discussionId,
          'title' => $discussion->title,
          'content' => $discussion->content,
          'courseTitle' => $discussion->course->courseTitle,
          'userName' => $discussion->user->userName,
          'createdAt' => $discussion->createdAt,
          'repliesCount' => $discussion->replies()->count(),
        ];
      });
    return Inertia::render('Admin/DiscussionManagement', [
      'discussions' => $discussions,
      'filters' => $request->only(['search']),
      'admin' => auth()->user()
    ]);
  }
  public function destroy($discussionId)
  {
    CourseDiscussion::findOrFail($discussionId)->delete();
    return redirect()->back()->with('success', 'Discussion Deleted Successfully!');
  }
}