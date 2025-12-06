<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\DB;
class TransactionManagementController extends Controller
{
  public function index(Request $request)
  {
    $query = PaymentTransaction::with(['user', 'course']);
    if ($request->has('status')) {
      $query->where('transactionStatus', $request->status);
    }
    if ($request->has('isRefunded')) {
      $query->where('isRefunded', $request->isRefunded);
    }
    if ($request->has('dateFrom')) {
      $query->where('createdAt', '>=', $request->dateFrom);
    }
    if ($request->has('dateTo')) {
      $query->where('createdAt', '<=', $request->dateTo);
    }
    $transactions = $query->orderBy('createdAt', 'desc')->paginate(20);
    return Inertia::render('Admin/TransactionManagement', [
      'transactions' => $transactions,
      'filters' => $request->only(['status', 'isRefunded', 'dateFrom', 'dateTo']),
      'user' => $request->user(),
    ]);
  }
  public function show($transactionId)
  {
    $transaction = PaymentTransaction::with(['user', 'course'])->findOrFail($transactionId);
    return response()->json($transaction);
  }
  public function approve(Request $request, $transactionId)
  {
    $transaction = PaymentTransaction::findOrFail($transactionId);
    $transaction->update(['transactionStatus' => 'completed']);
    return response()->json(['message' => 'Transaction Approved!']);
  }
  public function reject(Request $request, $transactionId)
  {
    $validated = $request->validate([
      'adminNotes' => 'nullable|string',
    ]);
    $transaction = PaymentTransaction::findOrFail($transactionId);
    $transaction->update([
      'transactionStatus' => 'failed',
      'adminNotes' => $validated['adminNotes'] ?? null,
    ]);
    return response()->json(['message' => 'Transaction Rejected!']);
  }
  public function refund(Request $request, $transactionId)
  {
    $validated = $request->validate([
      'refundAmount' => 'required|numeric|min:0',
      'adminNotes' => 'nullable|string',
    ]);
    DB::transaction(function () use ($transactionId, $validated) {
      $transaction = PaymentTransaction::findOrFail($transactionId);
      $transaction->update([
        'isRefunded' => true,
        'refundAmount' => $validated['refundAmount'],
        'refundedAt' => now(),
        'adminNotes' => $validated['adminNotes'] ?? null,
        'transactionStatus' => 'refunded',
      ]);
    });
    return response()->json(['message' => 'Refund Processed!']);
  }
}