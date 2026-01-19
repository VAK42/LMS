<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
class BlogController extends Controller
{
  public function index(Request $request)
  {
    $query = Blog::where('isPublished', true);
    if ($request->search) {
      $query->where(function ($q) use ($request) {
        $q->where('title', 'like', '%' . $request->search . '%')
          ->orWhere('content', 'like', '%' . $request->search . '%');
      });
    }
    $blogs = $query->with('instructor')
      ->orderBy('publishedAt', 'desc')
      ->paginate(9)
      ->withQueryString();
    return Inertia::render('Public/BlogIndex', [
      'blogs' => $blogs,
      'filters' => $request->only(['search'])
    ]);
  }
  public function show($slug)
  {
    $blog = Blog::where('slug', $slug)
      ->where('isPublished', true)
      ->with('instructor')
      ->firstOrFail();
    $blog->increment('viewCount');
    $relatedBlogs = Blog::where('isPublished', true)
      ->where('blogId', '!=', $blog->blogId)
      ->orderBy('publishedAt', 'desc')
      ->take(3)
      ->get();
    return Inertia::render('Public/BlogDetail', [
      'blog' => $blog,
      'relatedBlogs' => $relatedBlogs
    ]);
  }
}