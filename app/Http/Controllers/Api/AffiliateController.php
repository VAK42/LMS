<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Affiliate;
use App\Models\AffiliateReferral;
use Illuminate\Support\Str;
class AffiliateController extends Controller
{
  public function dashboard(Request $request)
  {
    $affiliate = Affiliate::firstOrCreate(
      ['userId' => $request->user()->userId],
      [
        'affiliateCode' => strtoupper(Str::random(8)),
        'commissionRate' => 10.00,
      ]
    );
    $referrals = AffiliateReferral::where('affiliateId', $affiliate->affiliateId)
      ->with(['referredUser'])
      ->get();
    return response()->json([
      'affiliate' => $affiliate,
      'referrals' => $referrals,
    ]);
  }
  public function generateCode(Request $request)
  {
    $affiliate = Affiliate::where('userId', $request->user()->userId)->first();
    if (!$affiliate) {
      $affiliate = Affiliate::create([
        'userId' => $request->user()->userId,
        'affiliateCode' => strtoupper(Str::random(8)),
        'commissionRate' => 10.00,
      ]);
    }
    return response()->json([
      'affiliateCode' => $affiliate->affiliateCode,
      'referralUrl' => url('/register?ref=' . $affiliate->affiliateCode),
    ]);
  }
}