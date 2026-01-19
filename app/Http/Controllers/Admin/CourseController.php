<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
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
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'courseTitle' => 'required|string|max:255',
      'courseDescription' => 'required|string',
      'categoryId' => 'required|exists:categories,categoryId',
      'instructorId' => 'required|exists:users,userId',
      'simulatedPrice' => 'required|numeric|min:0',
      'isPublished' => 'required|boolean',
      'courseMeta' => 'nullable|json',
      'courseImage' => 'nullable|image|max:2048',
    ]);
    $validator->after(function ($validator) use ($request) {
      $exists = Course::where('courseTitle', $request->courseTitle)->exists();
      if ($exists) {
        $validator->errors()->add('courseTitle', 'A Course With This Title Already Exists!');
      }
    });
    if ($validator->fails()) {
      throw new ValidationException($validator);
    }
    $data = $request->only(['courseTitle', 'courseDescription', 'categoryId', 'instructorId', 'simulatedPrice', 'isPublished', 'courseMeta']);
    if ($request->hasFile('courseImage')) {
      $path = $request->file('courseImage')->store('courses', 'public');
      $data['courseImage'] = $path;
    }
    Course::create($data);
    return redirect()->back()->with('success', 'Course Created Successfully!');
  }
  public function update(Request $request, $courseId)
  {
    $course = Course::findOrFail($courseId);
    $validator = Validator::make($request->all(), [
      'courseTitle' => 'required|string|max:255',
      'courseDescription' => 'required|string',
      'categoryId' => 'required|exists:categories,categoryId',
      'instructorId' => 'required|exists:users,userId',
      'simulatedPrice' => 'required|numeric|min:0',
      'isPublished' => 'required|boolean',
      'courseMeta' => 'nullable|json',
      'courseImage' => 'nullable|image|max:2048',
    ]);
    $validator->after(function ($validator) use ($request, $courseId) {
      $exists = Course::where('courseTitle', $request->courseTitle)
        ->where('courseId', '!=', $courseId)
        ->exists();
      if ($exists) {
        $validator->errors()->add('courseTitle', 'A Course With This Title Already Exists!');
      }
    });
    if ($validator->fails()) {
      throw new ValidationException($validator);
    }
    $data = $request->only(['courseTitle', 'courseDescription', 'categoryId', 'instructorId', 'simulatedPrice', 'isPublished', 'courseMeta']);
    if ($request->hasFile('courseImage')) {
      if ($course->courseImage && Storage::disk('public')->exists($course->courseImage)) {
        Storage::disk('public')->delete($course->courseImage);
      }
      $path = $request->file('courseImage')->store('courses', 'public');
      $data['courseImage'] = $path;
    }
    $course->update($data);
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