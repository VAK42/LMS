<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use App\Models\CourseDiscussion;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class DiscussionController extends Controller
{
  public function page($courseId)
  {
    $userId = Auth::id();
    $isEnrolled = Enrollment::where('courseId', $courseId)->where('userId', $userId)->exists();
    if (!$isEnrolled) {
      return redirect()->route('course', ['id' => $courseId])->with('error', 'You Must Be Enrolled To Access Discussions!');
    }
    $course = Course::findOrFail($courseId);
    return Inertia::render('Learner/CourseDiscussion', [
      'courseId' => $course->courseId,
      'courseTitle' => $course->courseTitle,
      'user' => Auth::user(),
    ]);
  }
  public function index($courseId)
  {
    return response()->json(CourseDiscussion::where('courseId', $courseId)->whereNull('parentId')->with(['user', 'replies'])->orderBy('createdAt', 'desc')->get());
  }
  public function store(Request $request, $courseId)
  {
    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'content' => 'required|string',
    ]);
    $discussion = CourseDiscussion::create([
      'courseId' => $courseId,
      'userId' => Auth::id(),
      'title' => $validated['title'],
      'content' => $validated['content'],
    ]);
    return response()->json($discussion->load('user'), 201);
  }
  public function reply(Request $request, $discussionId)
  {
    $parent = CourseDiscussion::findOrFail($discussionId);
    $validated = $request->validate([
      'content' => 'required|string',
    ]);
    $reply = CourseDiscussion::create([
      'courseId' => $parent->courseId,
      'userId' => Auth::id(),
      'parentId' => $discussionId,
      'content' => $validated['content'],
    ]);
    return response()->json($reply->load('user'), 201);
  }
}