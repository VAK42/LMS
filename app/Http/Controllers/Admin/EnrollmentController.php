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
    if ($request->has('payment') && $request->payment !== '') {
      $isPaid = $request->payment === 'paid';
      $query->where('isPaid', $isPaid);
    }
    $enrollments = $query->orderBy('createdAt', 'desc')->paginate(2);
    $users = User::where('role', 'learner')->where('userId', '!=', auth()->id())->get();
    $courses = Course::where('isPublished', true)->get();
    return Inertia::render('Admin/EnrollmentManagement', [
      'enrollments' => $enrollments,
      'users' => $users,
      'courses' => $courses,
      'filters' => $request->only(['search', 'payment']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'userId' => 'required|exists:users,userId',
      'courseId' => 'required|exists:courses,courseId',
      'isPaid' => 'required|boolean',
      'completionPercent' => 'required|numeric|min:0|max:100',
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
      'isPaid' => $validated['isPaid'],
      'completionPercent' => $validated['completionPercent'],
      'enrollmentDate' => now(),
    ]);
    return redirect()->back()->with('success', 'Enrollment Created Successfully!');
  }
  public function update(Request $request, $userId, $courseId)
  {
    $validated = $request->validate([
      'isPaid' => 'required|boolean',
      'completionPercent' => 'required|numeric|min:0|max:100',
    ]);
    $updated = Enrollment::where('userId', $userId)->where('courseId', $courseId)->update($validated);
    if (!$updated) {
      return redirect()->back()->withErrors(['error' => 'Enrollment Not Found!']);
    }
    return redirect()->back()->with('success', 'Enrollment Updated Successfully!');
  }
  public function destroy($userId, $courseId)
  {
    Enrollment::where('userId', $userId)->where('courseId', $courseId)->delete();
    return redirect()->back()->with('success', 'Enrollment Deleted Successfully!');
  }
  public function export()
  {
    $enrollments = Enrollment::with(['user', 'course'])->get();
    return response()->json($enrollments);
  }
}