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
    $users = \App\Models\User::select('userId', 'userName', 'userEmail')->where('role', '!=', 'admin')->orderBy('userName')->get();
    $courses = \App\Models\Course::select('courseId', 'courseTitle')->orderBy('courseTitle')->get();
    return Inertia::render('Admin/CertificateManagement', [
      'certificates' => $certificates,
      'users' => $users,
      'courses' => $courses,
      'filters' => $request->only(['search']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'userId' => 'required|exists:users,userId',
      'courseId' => 'required|exists:courses,courseId',
      'uniqueCode' => 'required|string|max:255|unique:certificates,uniqueCode',
      'pdfPath' => 'nullable|string|max:500',
      'issuedAt' => 'required|date',
    ]);
    $exists = Certificate::where('userId', $validated['userId'])
      ->where('courseId', $validated['courseId'])
      ->exists();
    if ($exists) {
      return redirect()->back()->withErrors(['courseId' => 'This User Already Has A Certificate For This Course!'])->withInput();
    }
    Certificate::create($validated);
    return redirect()->back()->with('success', 'Certificate Created Successfully!');
  }
  public function update(Request $request, $certificateId)
  {
    $certificate = Certificate::findOrFail($certificateId);
    $validated = $request->validate([
      'userId' => 'required|exists:users,userId',
      'courseId' => 'required|exists:courses,courseId',
      'uniqueCode' => 'required|string|max:255|unique:certificates,uniqueCode,' . $certificateId . ',certificateId',
      'pdfPath' => 'nullable|string|max:500',
      'issuedAt' => 'required|date',
    ]);
    $certificate->update($validated);
    return redirect()->back()->with('success', 'Certificate Updated Successfully!');
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