<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CourseReview;
use App\Models\Enrollment;
use App\Models\Course;
class ReviewController extends Controller
{
  public function index($courseId)
  {
    $reviews = CourseReview::where('courseId', $courseId)
      ->with('user')
      ->orderBy('createdAt', 'desc')
      ->paginate(20);
    return Inertia::render('Reviews', [
      'courseId' => $courseId,
      'reviews' => $reviews,
      'user' => request()->user(),
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'courseId' => 'required|exists:courses,courseId',
      'rating' => 'required|integer|min:1|max:5',
      'reviewText' => 'required|string',
    ]);
    $enrollment = Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $validated['courseId'])
      ->where('isPaid', true)
      ->first();
    if (!$enrollment) {
      return response()->json(['error' => 'Must Be Enrolled To Review!'], 403);
    }
    $existingReview = CourseReview::where('userId', $request->user()->userId)
      ->where('courseId', $validated['courseId'])
      ->first();
    if ($existingReview) {
      return response()->json(['error' => 'Already Reviewed This Course!'], 400);
    }
    $review = CourseReview::create([
      'courseId' => $validated['courseId'],
      'userId' => $request->user()->userId,
      'rating' => $validated['rating'],
      'reviewText' => $validated['reviewText'],
      'isVerifiedPurchase' => true,
    ]);
    $course = Course::findOrFail($validated['courseId']);
    $avgRating = CourseReview::where('courseId', $validated['courseId'])->avg('rating');
    $course->update(['averageRating' => round($avgRating, 2)]);
    return response()->json(['message' => 'Review Submitted!', 'review' => $review]);
  }
}