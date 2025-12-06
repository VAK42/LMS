<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wishlist;
class WishlistController extends Controller
{
  public function index(Request $request)
  {
    $wishlists = Wishlist::where('userId', $request->user()->userId)
      ->with('course')
      ->paginate(20);
    return response()->json($wishlists);
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