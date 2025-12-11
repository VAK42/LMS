<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CouponController extends Controller
{
  public function index(Request $request)
  {
    $query = Coupon::query();
    if ($request->has('search')) {
      $search = $request->search;
      $query->where('couponCode', 'like', "%{$search}%");
    }
    if ($request->has('status') && $request->status !== '') {
      $isActive = $request->status === 'active';
      $query->where('isActive', $isActive)
        ->where(function ($q) use ($isActive) {
          if ($isActive) {
            $q->where('expiresAt', '>', now())
              ->orWhereNull('expiresAt');
          }
        });
    }
    $coupons = $query->orderBy('createdAt', 'desc')->paginate(2);
    return Inertia::render('Admin/CouponManagement', [
      'coupons' => $coupons,
      'filters' => $request->only(['search', 'status']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'couponCode' => 'required|string|max:50|unique:coupons,couponCode',
      'discountType' => 'required|in:percentage,fixed',
      'discountValue' => 'required|numeric|min:0',
      'expiresAt' => 'nullable|date|after:now',
      'usageLimit' => 'nullable|integer|min:1',
      'isActive' => 'required|boolean',
    ]);
    Coupon::create($validated);
    return redirect()->back()->with('success', 'Coupon Created Successfully!');
  }
  public function update(Request $request, $couponId)
  {
    $coupon = Coupon::findOrFail($couponId);
    $validated = $request->validate([
      'couponCode' => 'required|string|max:50|unique:coupons,couponCode,' . $couponId . ',couponId',
      'discountType' => 'required|in:percentage,fixed',
      'discountValue' => 'required|numeric|min:0',
      'expiresAt' => 'nullable|date',
      'usageLimit' => 'nullable|integer|min:0',
      'isActive' => 'required|boolean',
    ]);
    $coupon->update($validated);
    return redirect()->back()->with('success', 'Coupon Updated Successfully!');
  }
  public function destroy($couponId)
  {
    $coupon = Coupon::findOrFail($couponId);
    $coupon->delete();
    return redirect()->back()->with('success', 'Coupon Deleted Successfully!');
  }
}