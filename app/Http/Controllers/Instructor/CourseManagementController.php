<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Category;
class CourseManagementController extends Controller
{
  public function index(Request $request)
  {
    $courses = Course::where('instructorId', $request->user()->userId)->get();
    return Inertia::render('InstructorDashboard', [
      'courses' => $courses,
    ]);
  }
  public function create()
  {
    $categories = Category::all();
    return Inertia::render('Instructor/CourseCreate', ['categories' => $categories, 'user' => auth()->user()]);
  }
  public function edit($courseId)
  {
    $course = Course::with('modules.lessons')->findOrFail($courseId);
    $categories = Category::all();
    return Inertia::render('Instructor/CourseEdit', ['course' => $course, 'categories' => $categories, 'user' => auth()->user()]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'courseTitle' => 'required|string',
      'courseDescription' => 'required|string',
      'categoryId' => 'required|exists:categories,categoryId',
      'simulatedPrice' => 'required|numeric',
      'courseMeta' => 'nullable|array',
    ]);
    $course = Course::create(array_merge($validated, ['instructorId' => $request->user()->userId]));
    return response()->json(['courseId' => $course->courseId, 'message' => 'Course Created!']);
  }
  public function update(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)->where('instructorId', $request->user()->userId)->firstOrFail();
    $validated = $request->validate([
      'courseTitle' => 'required|string',
      'courseDescription' => 'required|string',
      'categoryId' => 'required|exists:categories,categoryId',
      'simulatedPrice' => 'required|numeric|min:0',
      'courseMeta' => 'nullable|array',
    ]);
    $course->update($validated);
    return response()->json(['message' => 'Course Updated!']);
  }
  public function deleteCourse(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)->where('instructorId', $request->user()->userId)->firstOrFail();
    $course->delete();
    return redirect('/instructor/dashboard');
  }
  public function publish(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)->where('instructorId', $request->user()->userId)->firstOrFail();
    $course->update(['isPublished' => !$course->isPublished]);
    return redirect()->back();
  }
  public function addModule(Request $request, $courseId)
  {
    $course = Course::where('courseId', $courseId)->where('instructorId', $request->user()->userId)->firstOrFail();
    $validated = $request->validate([
      'moduleTitle' => 'required|string',
      'moduleDescription' => 'nullable|string',
      'orderIndex' => 'required|integer',
    ]);
    $module = Module::create([
      'courseId' => $course->courseId,
      'moduleTitle' => $validated['moduleTitle'],
      'moduleDescription' => $validated['moduleDescription'] ?? '',
      'orderIndex' => $validated['orderIndex'],
    ]);
    return response()->json($module);
  }
  public function updateModule(Request $request, $moduleId)
  {
    $module = Module::whereHas('course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('moduleId', $moduleId)->firstOrFail();
    $validated = $request->validate([
      'moduleTitle' => 'required|string|max:255',
    ]);
    $module->update(['moduleTitle' => $validated['moduleTitle']]);
    return response()->json(['message' => 'Module Updated!']);
  }
  public function reorderModule(Request $request, $moduleId)
  {
    $module = Module::whereHas('course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('moduleId', $moduleId)->firstOrFail();
    $validated = $request->validate([
      'direction' => 'required|in:up,down',
    ]);
    $modules = Module::where('courseId', $module->courseId)->orderBy('orderIndex')->get();
    $currentIndex = $modules->search(fn($m) => $m->moduleId === $module->moduleId);
    $targetIndex = $validated['direction'] === 'up' ? $currentIndex - 1 : $currentIndex + 1;
    if ($targetIndex < 0 || $targetIndex >= $modules->count()) {
      return response()->json(['error' => 'Cannot Move!'], 400);
    }
    $targetModule = $modules[$targetIndex];
    $tempOrder = $module->orderIndex;
    $module->update(['orderIndex' => $targetModule->orderIndex]);
    $targetModule->update(['orderIndex' => $tempOrder]);
    return response()->json(['message' => 'Reordered!']);
  }
  public function deleteModule(Request $request, $moduleId)
  {
    $module = Module::whereHas('course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('moduleId', $moduleId)->firstOrFail();
    $module->lessons()->delete();
    $module->delete();
    return response()->json(['message' => 'Module Deleted!']);
  }
  public function addLesson(Request $request, $moduleId)
  {
    $module = Module::whereHas('course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('moduleId', $moduleId)->firstOrFail();
    $validated = $request->validate([
      'lessonTitle' => 'required|string',
      'contentType' => 'required|in:video,text,pdf',
      'orderIndex' => 'required|integer',
      'durationMinutes' => 'nullable|integer',
    ]);
    $durationMinutes = 1;
    if ($validated['contentType'] === 'video') {
      $durationMinutes = $validated['durationMinutes'] ?? 1;
    }
    $lesson = Lesson::create([
      'moduleId' => $module->moduleId,
      'lessonTitle' => $validated['lessonTitle'],
      'contentType' => $validated['contentType'],
      'orderIndex' => $validated['orderIndex'],
      'durationMinutes' => $durationMinutes,
      'contentData' => json_encode(['content' => '']),
    ]);
    return response()->json($lesson);
  }
  public function deleteLesson(Request $request, $lessonId)
  {
    $lesson = Lesson::whereHas('module.course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('lessonId', $lessonId)->firstOrFail();
    $lesson->delete();
    return response()->json(['message' => 'Lesson Deleted!']);
  }
}