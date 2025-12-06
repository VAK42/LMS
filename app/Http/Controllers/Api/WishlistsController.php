<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Wishlist;
class WishlistsController extends Controller
{
  public function index(Request $request)
  {
    $wishlists = Wishlist::where('userId', $request->user()->userId)
      ->with('course.instructor')
      ->orderBy('createdAt', 'desc')
      ->get();
    return Inertia::render('Wishlist', [
      'wishlists' => $wishlists,
      'user' => $request->user(),
    ]);
  }
}