<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;
class CouponController extends Controller
{
  public function apply(Request $request)
  {
    $validated = $request->validate([
      'couponCode' => 'required|string',
      'courseId' => 'required|exists:courses,courseId',
    ]);
    $coupon = Coupon::where('couponCode', $validated['couponCode'])
      ->where('isActive', true)
      ->first();
    if (!$coupon) {
      return response()->json(['error' => 'Invalid Coupon!'], 404);
    }
    return response()->json(['discount' => $coupon->discountValue, 'type' => $coupon->discountType]);
  }
}