<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\CourseReview;
use Illuminate\Http\Request;
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
    return Inertia::render('Admin/ReviewManagement', [
      'reviews' => $reviews,
      'filters' => $request->only(['search', 'rating']),
      'user' => auth()->user()
    ]);
  }
  public function destroy($reviewId)
  {
    $review = CourseReview::findOrFail($reviewId);
    $review->delete();
    return redirect()->back()->with('success', 'Review Deleted Successfully!');
  }
}