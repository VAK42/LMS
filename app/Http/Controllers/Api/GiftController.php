<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GiftCode;
class GiftController extends Controller
{
  public function redeem(Request $request)
  {
    $validated = $request->validate([
      'giftCode' => 'required|string',
    ]);
    $gift = GiftCode::where('giftCode', $validated['giftCode'])
      ->where('isRedeemed', false)
      ->first();
    if (!$gift) {
      return response()->json(['error' => 'Invalid Or Already Redeemed Gift Code!'], 404);
    }
    $gift->update([
      'isRedeemed' => true,
      'redeemedBy' => $request->user()->userId,
      'redeemedAt' => now(),
    ]);
    return response()->json(['message' => 'Gift Redeemed Successfully!', 'courseId' => $gift->courseId]);
  }
}