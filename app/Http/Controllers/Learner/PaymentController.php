<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentTransaction;
use App\Models\Enrollment;
use App\Models\Wallet;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
class PaymentController extends Controller
{
  private const instructorShare = 0.80;
  private const platformFee = 0.20;
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
    $instructorAmount = $validated['amount'] * self::instructorShare;
    $platformFee = $validated['amount'] * self::platformFee;
    $transaction = PaymentTransaction::create([
      'userId' => $request->user()->userId,
      'courseId' => $validated['courseId'],
      'amount' => $validated['amount'],
      'instructorAmount' => $instructorAmount,
      'platformFee' => $platformFee,
      'transactionStatus' => 'pending',
      'paymentMethod' => 'bankTransfer',
    ]);
    return response()->json(['transactionId' => $transaction->transactionId]);
  }
  public function complete(Request $request, $transactionId)
  {
    DB::transaction(function () use ($request, $transactionId) {
      $transaction = PaymentTransaction::with('course.instructor')->findOrFail($transactionId);
      if ($transaction->userId !== $request->user()->userId) {
        abort(403, 'Unauthorized!');
      }
      if ($transaction->transactionStatus !== 'pending') {
        abort(400, 'Transaction Already Processed!');
      }
      $transaction->update([
        'transactionStatus' => 'completed',
        'escrowReleasedAt' => now(),
      ]);
      $instructorId = $transaction->course->instructorId;
      $instructorWallet = Wallet::getOrCreateForUser($instructorId);
      $instructorWallet->credit(
        $transaction->instructorAmount,
        'Course Sale: ' . $transaction->course->courseTitle,
        $transaction->transactionId,
        ['courseId' => $transaction->courseId, 'learnerId' => $transaction->userId]
      );
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
  public function confirmPayment(Request $request, $transactionId)
  {
    $user = $request->user();
    if (!$user->isAdmin()) {
      abort(403, 'Unauthorized!');
    }
    DB::transaction(function () use ($transactionId) {
      $transaction = PaymentTransaction::with('course.instructor')->findOrFail($transactionId);
      if ($transaction->transactionStatus !== 'pending') {
        abort(400, 'Transaction Already Processed!');
      }
      $transaction->update([
        'transactionStatus' => 'completed',
        'escrowReleasedAt' => now(),
      ]);
      $instructorId = $transaction->course->instructorId;
      $instructorWallet = Wallet::getOrCreateForUser($instructorId);
      $instructorWallet->credit(
        $transaction->instructorAmount,
        'Course Sale: ' . $transaction->course->courseTitle,
        $transaction->transactionId,
        ['courseId' => $transaction->courseId, 'learnerId' => $transaction->userId]
      );
      Enrollment::firstOrCreate(
        [
          'userId' => $transaction->userId,
          'courseId' => $transaction->courseId,
        ],
        [
          'enrollmentDate' => now(),
          'isPaid' => true,
        ]
      );
    });
    return response()->json(['message' => 'Payment Confirmed!']);
  }
}