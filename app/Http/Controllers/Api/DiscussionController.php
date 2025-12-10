<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DiscussionThread;
use App\Models\DiscussionPost;
class DiscussionController extends Controller
{
  public function index($courseId)
  {
    $threads = DiscussionThread::where('courseId', $courseId)
      ->with(['user', 'posts'])
      ->orderBy('isPinned', 'desc')
      ->orderBy('createdAt', 'desc')
      ->paginate(20);
    return Inertia::render('Discussion', [
      'courseId' => $courseId,
      'threads' => $threads,
    ]);
  }
  public function storeThread(Request $request)
  {
    $validated = $request->validate([
      'courseId' => 'required|exists:courses,courseId',
      'threadTitle' => 'required|string',
      'threadContent' => 'required|string',
    ]);
    DiscussionThread::create([
      'courseId' => $validated['courseId'],
      'userId' => $request->user()->userId,
      'threadTitle' => $validated['threadTitle'],
      'threadContent' => $validated['threadContent'],
    ]);
    return redirect()->back();
  }
  public function storePost(Request $request)
  {
    $validated = $request->validate([
      'threadId' => 'required|exists:discussionThreads,threadId',
      'postContent' => 'required|string',
    ]);
    DiscussionPost::create([
      'threadId' => $validated['threadId'],
      'userId' => $request->user()->userId,
      'postContent' => $validated['postContent'],
    ]);
    return redirect()->back();
  }
}