<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
class BlogController extends Controller
{
  public function index(Request $request)
  {
    $query = Blog::where('instructorId', Auth::id());
    if ($request->search) {
      $query->where('title', 'like', '%' . $request->search . '%');
    }
    $blogs = $query->orderBy('createdAt', 'desc')
      ->paginate(10)
      ->withQueryString();
    return Inertia::render('Instructor/BlogIndex', [
      'blogs' => $blogs,
      'filters' => $request->only(['search'])
    ]);
  }
  public function create()
  {
    return Inertia::render('Instructor/BlogEditor');
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'content' => 'required|string',
      'thumbnail' => 'nullable|image|max:2048',
      'isPublished' => 'boolean'
    ]);
    $thumbnailPath = null;
    if ($request->hasFile('thumbnail')) {
      $thumbnailPath = $request->file('thumbnail')->store('blogs', 'public');
    }
    $blog = Blog::create([
      'instructorId' => Auth::id(),
      'title' => $validated['title'],
      'slug' => (string) Str::uuid(),
      'content' => $validated['content'],
      'thumbnail' => $thumbnailPath,
      'isPublished' => $validated['isPublished'],
      'publishedAt' => $validated['isPublished'] ? now() : null,
    ]);
    return redirect('/instructor/blogs')->with('success', 'Blog Created Successfully!');
  }
  public function edit(Blog $blog)
  {
    if ($blog->instructorId !== Auth::id()) {
      abort(403);
    }
    return Inertia::render('Instructor/BlogEditor', [
      'blog' => $blog
    ]);
  }
  public function update(Request $request, Blog $blog)
  {
    if ($blog->instructorId !== Auth::id()) {
      abort(403);
    }
    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'content' => 'required|string',
      'thumbnail' => 'nullable|image|max:2048',
      'isPublished' => 'boolean'
    ]);
    if ($request->hasFile('thumbnail')) {
      if ($blog->thumbnail) {
        Storage::disk('public')->delete($blog->thumbnail);
      }
      $blog->thumbnail = $request->file('thumbnail')->store('blogs', 'public');
    }
    $blog->update([
      'title' => $validated['title'],
      'content' => $validated['content'],
      'isPublished' => $validated['isPublished'],
      'publishedAt' => $validated['isPublished'] && !$blog->isPublished ? now() : $blog->publishedAt,
    ]);
    return redirect('/instructor/blogs')->with('success', 'Blog Updated Successfully!');
  }
  public function destroy(Blog $blog)
  {
    if ($blog->instructorId !== Auth::id()) {
      abort(403);
    }
    if ($blog->thumbnail) {
      Storage::disk('public')->delete($blog->thumbnail);
    }
    $blog->delete();
    return redirect()->back()->with('success', 'Blog Deleted Successfully!');
  }
  public function uploadImage(Request $request)
  {
    $request->validate([
      'image' => 'required|image|max:2048'
    ]);
    $path = $request->file('image')->store('blog-content', 'public');
    return response()->json(['url' => Storage::url($path)]);
  }
}