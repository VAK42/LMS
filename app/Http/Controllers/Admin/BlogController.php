<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
class BlogController extends Controller
{
  public function index(Request $request)
  {
    $query = Blog::with(['instructor']);
    if ($request->has('search')) {
      $search = $request->search;
      $query->where('title', 'like', "%{$search}%");
    }
    if ($request->has('status') && $request->status !== '') {
      $query->where('isPublished', $request->status === 'published');
    }
    $blogs = $query->orderBy('createdAt', 'desc')->paginate(10);
    $instructors = User::where('role', 'instructor')->get(['userId', 'userName']);
    return Inertia::render('Admin/BlogManagement', [
      'blogs' => $blogs,
      'instructors' => $instructors,
      'filters' => $request->only(['search', 'status']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'title' => 'required|string|max:255',
      'content' => 'required|string',
      'instructorId' => 'required|exists:users,userId',
      'isPublished' => 'required|boolean',
      'thumbnail' => 'nullable|image|max:2048',
    ]);
    $validator->after(function ($validator) use ($request) {
      if (Blog::where('title', $request->title)->exists()) {
        $validator->errors()->add('title', 'A Blog With This Title Already Exists!');
      }
    });
    if ($validator->fails()) {
      throw new ValidationException($validator);
    }
    $data = $request->only(['title', 'content', 'instructorId', 'isPublished']);
    $data['slug'] = Str::slug($data['title']);
    if ($request->has('isPublished') && $request->isPublished) {
      $data['publishedAt'] = now();
    }
    if ($request->hasFile('thumbnail')) {
      $path = $request->file('thumbnail')->store('blogs', 'public');
      $data['thumbnail'] = $path;
    }
    Blog::create($data);
    return redirect()->back()->with('success', 'Blog Created Successfully!');
  }
  public function update(Request $request, $blogId)
  {
    $blog = Blog::findOrFail($blogId);
    $validator = Validator::make($request->all(), [
      'title' => 'required|string|max:255',
      'content' => 'required|string',
      'instructorId' => 'required|exists:users,userId',
      'isPublished' => 'required|boolean',
      'thumbnail' => 'nullable|image|max:2048',
    ]);
    $validator->after(function ($validator) use ($request, $blogId) {
      if (Blog::where('title', $request->title)->where('blogId', '!=', $blogId)->exists()) {
        $validator->errors()->add('title', 'A Blog With This Title Already Exists!');
      }
    });
    if ($validator->fails()) {
      throw new ValidationException($validator);
    }
    $data = $request->only(['title', 'content', 'instructorId', 'isPublished']);
    if ($blog->title !== $data['title']) {
       $data['slug'] = Str::slug($data['title']);
    }
    if ($request->isPublished && !$blog->isPublished) {
       $data['publishedAt'] = now();
    }
    if ($request->hasFile('thumbnail')) {
      if ($blog->thumbnail && Storage::disk('public')->exists($blog->thumbnail)) {
        Storage::disk('public')->delete($blog->thumbnail);
      }
      $path = $request->file('thumbnail')->store('blogs', 'public');
      $data['thumbnail'] = $path;
    }
    $blog->update($data);
    return redirect()->back()->with('success', 'Blog Updated Successfully!');
  }
  public function destroy($blogId)
  {
    $blog = Blog::findOrFail($blogId);
    if ($blog->thumbnail && Storage::disk('public')->exists($blog->thumbnail)) {
      Storage::disk('public')->delete($blog->thumbnail);
    }
    $blog->delete();
    return redirect()->back()->with('success', 'Blog Deleted Successfully!');
  }
  public function export()
  {
    $blogs = Blog::with(['instructor'])->get();
    return response()->json($blogs);
  }
}