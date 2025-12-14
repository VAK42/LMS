<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\CourseReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class ReviewController extends Controller
{
  public function index(Request $request)
  {
    $query = CourseReview::with(['user', 'course']);
    if ($request->has('search')) {
      $search = $request->search;
      $query->whereHas('course', function ($q) use ($search) {
        $q->where('courseTitle', 'like', "%{$search}%");
      });
    }
    if ($request->has('rating') && $request->rating !== '') {
      $query->where('rating', $request->rating);
    }
    $reviews = $query->orderBy('createdAt', 'desc')->orderBy('reviewId', 'desc')->paginate(2);
    $users = \App\Models\User::select('userId', 'userName')->where('role', 'learner')->get();
    $courses = \App\Models\Course::select('courseId', 'courseTitle')->get();
    return Inertia::render('Admin/ReviewManagement', [
      'reviews' => $reviews,
      'filters' => $request->only(['search', 'rating']),
      'users' => $users,
      'courses' => $courses,
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'userId' => 'required|integer|exists:users,userId',
      'courseId' => 'required|integer|exists:courses,courseId',
      'rating' => 'required|integer|min:1|max:5',
      'reviewText' => 'nullable|string',
    ]);
    $validator->after(function ($validator) use ($request) {
      $exists = CourseReview::where('userId', $request->userId)
        ->where('courseId', $request->courseId)
        ->exists();
      if ($exists) {
        $validator->errors()->add('userId', 'This User Has Already Reviewed This Course!');
      }
    });
    if ($validator->fails()) {
      throw new \Illuminate\Validation\ValidationException($validator);
    }
    CourseReview::create([
      'userId' => (int)$request->userId,
      'courseId' => (int)$request->courseId,
      'rating' => (int)$request->rating,
      'reviewText' => $request->reviewText,
    ]);
    return redirect()->back()->with('success', 'Review Created Successfully!');
  }
  public function update(Request $request, $reviewId)
  {
    $review = CourseReview::findOrFail($reviewId);
    $validator = Validator::make($request->all(), [
      'userId' => 'required|integer|exists:users,userId',
      'courseId' => 'required|integer|exists:courses,courseId',
      'rating' => 'required|integer|min:1|max:5',
      'reviewText' => 'nullable|string',
    ]);
    $validator->after(function ($validator) use ($request, $reviewId) {
      $exists = CourseReview::where('userId', $request->userId)
        ->where('courseId', $request->courseId)
        ->where('reviewId', '!=', $reviewId)
        ->exists();
      if ($exists) {
        $validator->errors()->add('userId', 'This User Has Already Reviewed This Course!');
      }
    });
    if ($validator->fails()) {
      throw new \Illuminate\Validation\ValidationException($validator);
    }
    $review->update([
      'userId' => (int)$request->userId,
      'courseId' => (int)$request->courseId,
      'rating' => (int)$request->rating,
      'reviewText' => $request->reviewText,
    ]);
    return redirect()->back()->with('success', 'Review Updated Successfully!');
  }
  public function destroy($reviewId)
  {
    $review = CourseReview::findOrFail($reviewId);
    $review->delete();
    return redirect()->back()->with('success', 'Review Deleted Successfully!');
  }
  public function export()
  {
    $reviews = CourseReview::with(['course', 'user'])->get();
    return response()->json($reviews);
  }
}