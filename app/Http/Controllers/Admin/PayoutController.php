<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class PayoutController extends Controller
{
  public function index(Request $request)
  {
    $query = Payout::with(['instructor', 'processedByUser']);
    if ($request->has('status') && $request->status !== '') {
      $query->where('status', $request->status);
    }
    if ($request->has('search') && $request->search !== '') {
      $search = $request->search;
      $query->whereHas('instructor', function ($q) use ($search) {
        $q->where('userName', 'like', "%{$search}%");
      });
    }
    $payouts = $query->orderBy('createdAt', 'desc')->paginate(10);
    $pendingPayouts = Payout::where('status', 'pending')->sum('amount');
    $completedPayouts = Payout::where('status', 'completed')->sum('amount');
    $totalPayouts = Payout::count();
    return Inertia::render('Admin/PayoutManagement', [
      'payouts' => $payouts,
      'filters' => $request->only(['search', 'status']),
      'stats' => [
        'pendingPayouts' => (float) $pendingPayouts,
        'completedPayouts' => (float) $completedPayouts,
        'totalPayouts' => $totalPayouts,
      ],
      'user' => auth()->user(),
    ]);
  }
  public function instructorBalances()
  {
    $instructors = User::where('role', 'instructor')
      ->with('wallet')
      ->get()
      ->filter(function ($instructor) {
        return $instructor->wallet && $instructor->wallet->balance > 0;
      })
      ->map(function ($instructor) {
        return [
          'userId' => $instructor->userId,
          'userName' => $instructor->userName,
          'userEmail' => $instructor->userEmail,
          'balance' => (float) $instructor->wallet->balance,
          'totalEarnings' => (float) $instructor->wallet->totalEarnings,
          'bankQrPath' => $instructor->bankQrPath,
          'bankName' => $instructor->bankName,
          'bankAccountNumber' => $instructor->bankAccountNumber,
          'bankAccountName' => $instructor->bankAccountName,
        ];
      })
      ->values();
    return response()->json($instructors);
  }
  public function create(Request $request)
  {
    $validated = $request->validate([
      'instructorId' => 'required|exists:users,userId',
      'amount' => 'required|numeric|min:0.01',
    ]);
    $wallet = Wallet::where('userId', $validated['instructorId'])->first();
    if (!$wallet || $wallet->balance < $validated['amount']) {
      return response()->json(['error' => 'Insufficient Balance!'], 400);
    }
    $instructor = User::find($validated['instructorId']);
    $payout = Payout::create([
      'instructorId' => $validated['instructorId'],
      'amount' => $validated['amount'],
      'status' => 'pending',
      'paymentMethod' => 'bankTransfer',
      'bankInfo' => [
        'bankQrPath' => $instructor->bankQrPath,
        'bankName' => $instructor->bankName,
        'bankAccountNumber' => $instructor->bankAccountNumber,
        'bankAccountName' => $instructor->bankAccountName,
      ],
    ]);
    return response()->json(['message' => 'Payout Created!', 'payoutId' => $payout->payoutId]);
  }
  public function process(Request $request, $payoutId)
  {
    $validated = $request->validate([
      'adminNotes' => 'nullable|string',
    ]);
    DB::transaction(function () use ($payoutId, $validated) {
      $payout = Payout::findOrFail($payoutId);
      if ($payout->status !== 'pending') {
        abort(400, 'Payout Already Processed!');
      }
      $wallet = Wallet::where('userId', $payout->instructorId)->firstOrFail();
      if ($wallet->balance < $payout->amount) {
        abort(400, 'Insufficient Balance!');
      }
      $wallet->debit(
        $payout->amount,
        'Payout Processed',
        $payout->payoutId,
        ['method' => 'bankTransfer']
      );
      $payout->update([
        'status' => 'completed',
        'processedAt' => now(),
        'processedBy' => auth()->id(),
        'adminNotes' => $validated['adminNotes'] ?? null,
      ]);
    });
    return response()->json(['message' => 'Payout Processed Successfully!']);
  }
  public function cancel($payoutId)
  {
    $payout = Payout::findOrFail($payoutId);
    if ($payout->status !== 'pending') {
      return response()->json(['error' => 'Only Pending Payouts Can Be Cancelled!'], 400);
    }
    $payout->update(['status' => 'failed']);
    return response()->json(['message' => 'Payout Cancelled!']);
  }
}