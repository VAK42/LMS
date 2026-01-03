<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\LedgerEntry;
use App\Models\Payout;
use Illuminate\Http\Request;
use Inertia\Inertia;
class EarningsController extends Controller
{
  public function dashboard(Request $request)
  {
    $user = $request->user();
    if (!$user->isInstructor() && !$user->isAdmin()) {
      abort(403, 'Unauthorized!');
    }
    $wallet = Wallet::getOrCreateForUser($user->userId);
    $recentTransactions = LedgerEntry::where('walletId', $wallet->walletId)
      ->with('transaction.course', 'payout')
      ->orderBy('createdAt', 'desc')
      ->take(10)
      ->get();
    $pendingPayouts = Payout::where('instructorId', $user->userId)
      ->where('status', 'pending')
      ->sum('amount');
    $completedPayouts = Payout::where('instructorId', $user->userId)
      ->where('status', 'completed')
      ->sum('amount');
    return Inertia::render('Instructor/Earnings', [
      'wallet' => [
        'balance' => (float) $wallet->balance,
        'pendingBalance' => (float) $wallet->pendingBalance,
        'totalEarnings' => (float) $wallet->totalEarnings,
      ],
      'recentTransactions' => $recentTransactions,
      'payoutStats' => [
        'pending' => (float) $pendingPayouts,
        'completed' => (float) $completedPayouts,
      ],
      'bankInfo' => [
        'bankQrPath' => $user->bankQrPath,
        'bankName' => $user->bankName,
        'bankAccountNumber' => $user->bankAccountNumber,
        'bankAccountName' => $user->bankAccountName,
      ],
      'user' => $user,
    ]);
  }
  public function history(Request $request)
  {
    $user = $request->user();
    $wallet = Wallet::where('userId', $user->userId)->first();
    if (!$wallet) {
      return response()->json(['entries' => []]);
    }
    $entries = LedgerEntry::where('walletId', $wallet->walletId)
      ->with('transaction.course', 'payout')
      ->orderBy('createdAt', 'desc')
      ->paginate(20);
    return response()->json($entries);
  }
  public function updateBankInfo(Request $request)
  {
    $validated = $request->validate([
      'bankName' => 'nullable|string|max:255',
      'bankAccountNumber' => 'nullable|string|max:50',
      'bankAccountName' => 'nullable|string|max:255',
    ]);
    $user = $request->user();
    $user->update($validated);
    return response()->json(['message' => 'Bank Info Updated!']);
  }
  public function uploadBankQr(Request $request)
  {
    $request->validate([
      'bankQr' => 'required|image|max:2048',
    ]);
    $user = $request->user();
    if ($user->bankQrPath) {
      \Illuminate\Support\Facades\Storage::disk('public')->delete($user->bankQrPath);
    }
    $path = $request->file('bankQr')->store('bankQr', 'public');
    $user->update(['bankQrPath' => $path]);
    return response()->json(['message' => 'Bank QR Uploaded!', 'path' => $path]);
  }
}