<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Certificate;
class CertificateController extends Controller
{
  public function show($certificateId)
  {
    $certificate = Certificate::with(['user', 'course'])->findOrFail($certificateId);
    return Inertia::render('CertificateView', [
      'certificate' => $certificate,
    ]);
  }
  public function index(Request $request)
  {
    $certificates = Certificate::where('userId', $request->user()->userId)
      ->with('course')
      ->get();
    return Inertia::render('Certificates', [
      'certificates' => $certificates,
    ]);
  }
}