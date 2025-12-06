<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bookmark;
class BookmarkController extends Controller
{
  public function index(Request $request)
  {
    $bookmarks = Bookmark::where('userId', $request->user()->userId)
      ->with('lesson')
      ->paginate(20);
    return response()->json($bookmarks);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'lessonId' => 'required|exists:lessons,lessonId',
      'note' => 'nullable|string',
      'videoTimestamp' => 'nullable|integer',
    ]);
    $bookmark = Bookmark::create([
      'userId' => $request->user()->userId,
      'lessonId' => $validated['lessonId'],
      'note' => $validated['note'] ?? null,
      'videoTimestamp' => $validated['videoTimestamp'] ?? null,
    ]);
    return response()->json(['message' => 'Bookmark Created!', 'bookmark' => $bookmark]);
  }
  public function destroy(Request $request, $bookmarkId)
  {
    $bookmark = Bookmark::where('bookmarkId', $bookmarkId)
      ->where('userId', $request->user()->userId)
      ->firstOrFail();
    $bookmark->delete();
    return response()->json(['message' => 'Bookmark Removed!']);
  }
}