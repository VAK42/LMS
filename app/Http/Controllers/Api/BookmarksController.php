<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Bookmark;
class BookmarksController extends Controller
{
  public function index(Request $request)
  {
    $bookmarks = Bookmark::where('userId', $request->user()->userId)
      ->with('lesson.module.course')
      ->orderBy('createdAt', 'desc')
      ->get();
    return Inertia::render('Bookmarks', [
      'bookmarks' => $bookmarks,
      'user' => $request->user(),
    ]);
  }
}