<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CertificateController extends Controller
{
  public function index(Request $request)
  {
    $query = Certificate::with(['user', 'course']);
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
    $certificates = $query->orderBy('issuedAt', 'desc')->orderBy('certificateId', 'desc')->paginate(2);
    return Inertia::render('Admin/CertificateManagement', [
      'certificates' => $certificates,
      'filters' => $request->only(['search']),
      'user' => auth()->user()
    ]);
  }
  public function destroy($certificateId)
  {
    $certificate = Certificate::findOrFail($certificateId);
    $certificate->delete();
    return redirect()->back()->with('success', 'Certificate Deleted Successfully!');
  }
  public function export()
  {
    $certificates = Certificate::with(['user', 'course'])->get();
    return response()->json($certificates);
  }
}