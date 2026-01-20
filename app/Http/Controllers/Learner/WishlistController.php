<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wishlist;
use App\Models\Enrollment;
class WishlistController extends Controller
{
  public function index(Request $request)
  {
    $wishlists = Wishlist::where('userId', $request->user()->userId)
      ->with('course')
      ->paginate(20);
    return inertia('Learner/Wishlist', [
      'wishlists' => $wishlists,
    ]);
  }
  public function toggle(Request $request)
  {
    $validated = $request->validate([
      'courseId' => 'required|exists:courses,courseId',
    ]);
    $userId = $request->user()->userId;
    $courseId = $validated['courseId'];
    $isEnrolled = Enrollment::where('userId', $userId)
      ->where('courseId', $courseId)
      ->where('isPaid', true)
      ->exists();
    if ($isEnrolled) {
      Wishlist::where('userId', $userId)->where('courseId', $courseId)->delete();
      return response()->json(['message' => 'Purchased Courses Cannot Be In Wishlist!', 'inWishlist' => false]);
    }
    $existing = Wishlist::where('userId', $userId)->where('courseId', $courseId)->first();
    if ($existing) {
      $existing->delete();
      return response()->json(['message' => 'Removed From Wishlist!', 'inWishlist' => false]);
    }
    Wishlist::create([
      'userId' => $userId,
      'courseId' => $courseId,
    ]);
    return response()->json(['message' => 'Added To Wishlist!', 'inWishlist' => true]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'courseId' => 'required|exists:courses,courseId',
    ]);
    $wishlist = Wishlist::create([
      'userId' => $request->user()->userId,
      'courseId' => $validated['courseId'],
    ]);
    return response()->json(['message' => 'Added To Wishlist!', 'wishlist' => $wishlist]);
  }
  public function destroy(Request $request, $wishlistId)
  {
    $wishlist = Wishlist::where('wishlistId', $wishlistId)
      ->where('userId', $request->user()->userId)
      ->firstOrFail();
    $wishlist->delete();
    return response()->json(['message' => 'Removed From Wishlist!']);
  }
}