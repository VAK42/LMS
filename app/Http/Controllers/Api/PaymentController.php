<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentTransaction;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
class PaymentController extends Controller
{
  public function create(Request $request)
  {
    $validated = $request->validate([
      'courseId' => 'required|exists:courses,courseId',
      'amount' => 'required|numeric',
    ]);
    $existingEnrollment = Enrollment::where('userId', $request->user()->userId)
      ->where('courseId', $validated['courseId'])
      ->where('isPaid', true)
      ->first();
    if ($existingEnrollment) {
      return response()->json(['error' => 'Already Enrolled In This Course!'], 400);
    }
    $pendingTransaction = PaymentTransaction::where('userId', $request->user()->userId)
      ->where('courseId', $validated['courseId'])
      ->where('transactionStatus', 'pending')
      ->first();
    if ($pendingTransaction) {
      return response()->json(['error' => 'Pending Transaction Already Exists!', 'transactionId' => $pendingTransaction->transactionId], 400);
    }
    $transaction = PaymentTransaction::create([
      'userId' => $request->user()->userId,
      'courseId' => $validated['courseId'],
      'amount' => $validated['amount'],
      'transactionStatus' => 'pending',
      'paymentMethod' => 'vietqr',
    ]);
    return response()->json(['transactionId' => $transaction->transactionId]);
  }
  public function complete(Request $request, $transactionId)
  {
    DB::transaction(function () use ($request, $transactionId) {
      $transaction = PaymentTransaction::findOrFail($transactionId);
      if ($transaction->userId !== $request->user()->userId) {
        abort(403, 'Unauthorized');
      }
      $transaction->update(['transactionStatus' => 'completed']);
      Enrollment::firstOrCreate(
        [
          'userId' => $request->user()->userId,
          'courseId' => $transaction->courseId,
        ],
        [
          'enrollmentDate' => now(),
          'isPaid' => true,
        ]
      );
    });
    return response()->json(['message' => 'Payment Completed!']);
  }
}