<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CourseController extends Controller
{
  public function index(Request $request)
  {
    $query = Course::with(['instructor', 'category']);
    if ($request->has('search')) {
      $search = $request->search;
      $query->where('courseTitle', 'like', "%{$search}%");
    }
    if ($request->has('category') && $request->category !== '') {
      $query->where('categoryId', $request->category);
    }
    if ($request->has('status') && $request->status !== '') {
      $query->where('isPublished', $request->status === 'published');
    }
    $courses = $query->orderBy('createdAt', 'desc')->orderBy('courseId', 'desc')->paginate(2);
    $categories = Category::all();
    $instructors = User::where('role', 'instructor')->get();
    return Inertia::render('Admin/CourseManagement', [
      'courses' => $courses,
      'categories' => $categories,
      'instructors' => $instructors,
      'filters' => $request->only(['search', 'category', 'status']),
      'user' => auth()->user()
    ]);
  }
  public function update(Request $request, $courseId)
  {
    $course = Course::findOrFail($courseId);
    $validated = $request->validate([
      'courseTitle' => 'required|string|max:255',
      'categoryId' => 'required|exists:categories,categoryId',
      'instructorId' => 'required|exists:users,userId',
      'simulatedPrice' => 'required|numeric|min:0',
      'isPublished' => 'required|boolean',
      'courseMeta' => 'nullable|json',
    ]);
    $course->update($validated);
    return redirect()->back()->with('success', 'Course Updated Successfully!');
  }
  public function destroy($courseId)
  {
    $course = Course::findOrFail($courseId);
    $course->delete();
    return redirect()->back()->with('success', 'Course Deleted Successfully!');
  }
  public function export()
  {
    $courses = Course::with(['instructor', 'category'])->get();
    return response()->json($courses);
  }
}