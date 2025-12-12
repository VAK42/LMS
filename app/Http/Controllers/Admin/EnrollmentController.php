<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
class EnrollmentController extends Controller
{
  public function index(Request $request)
  {
    $query = Enrollment::with(['user', 'course']);
    $query->whereHas('user', function ($q) {
      $q->where('userId', '!=', auth()->id());
    });
    if ($request->has('search')) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->whereHas('user', function ($uq) use ($search) {
          $uq->where('userName', 'like', "%{$search}%");
        })->orWhereHas('course', function ($cq) use ($search) {
          $cq->where('courseTitle', 'like', "%{$search}%");
        });
      });
    }
    $enrollments = $query->orderBy('createdAt', 'desc')->paginate(2);
    $users = User::where('role', 'learner')->where('userId', '!=', auth()->id())->get();
    $courses = Course::where('isPublished', true)->get();
    return Inertia::render('Admin/EnrollmentManagement', [
      'enrollments' => $enrollments,
      'users' => $users,
      'courses' => $courses,
      'filters' => $request->only(['search', 'status']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'userId' => 'required|exists:users,userId',
      'courseId' => 'required|exists:courses,courseId',
    ]);
    $exists = Enrollment::where('userId', $validated['userId'])
      ->where('courseId', $validated['courseId'])
      ->exists();
    if ($exists) {
      return redirect()->back()->withErrors(['error' => 'User Is Already Enrolled In This Course!']);
    }
    Enrollment::create([
      'userId' => $validated['userId'],
      'courseId' => $validated['courseId'],
      'enrollmentStatus' => 'active',
      'progressPercentage' => 0,
      'enrolledAt' => now(),
    ]);
    return redirect()->back()->with('success', 'Manual Enrollment Created Successfully!');
  }
  public function update(Request $request, $enrollmentId)
  {
    $enrollment = Enrollment::findOrFail($enrollmentId);
    $validated = $request->validate([
      'enrollmentStatus' => 'required|in:active,completed,dropped',
      'progressPercentage' => 'required|numeric|min:0|max:100',
    ]);
    $enrollment->update($validated);
    return redirect()->back()->with('success', 'Enrollment Updated Successfully!');
  }
  public function destroy($enrollmentId)
  {
    $enrollment = Enrollment::findOrFail($enrollmentId);
    $enrollment->delete();
    return redirect()->back()->with('success', 'Enrollment Deleted Successfully!');
  }
  public function export()
  {
    $enrollments = Enrollment::with(['user', 'course'])->get();
    return response()->json($enrollments);
  }
}