<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
class TransactionController extends Controller
{
  public function index(Request $request)
  {
    $query = PaymentTransaction::with(['user', 'course']);
    $query->whereHas('user', function ($q) {
      $q->where('userId', '!=', auth()->id());
    });
    if ($request->has('search')) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->whereHas('user', function ($uq) use ($search) {
          $uq->where('userName', 'like', "%{$search}%");
        })->orWhereHas('course', function ($cq) use ($search) {
          $cq->where('courseTitle', 'like', "%{$search}%");
        });
      });
    }
    if ($request->has('status') && $request->status !== '') {
      $query->where('transactionStatus', $request->status);
    }
    $transactions = $query->orderBy('createdAt', 'desc')->paginate(2);
    return Inertia::render('Admin/TransactionManagement', [
      'transactions' => $transactions,
      'filters' => $request->only(['search', 'status']),
      'user' => auth()->user()
    ]);
  }
}