<?php
namespace App\Services;
use App\Models\Certificate;
use App\Models\Enrollment;
class CertificateService
{
  public function generateCertificate($userId, $courseId)
  {
    $enrollment = Enrollment::where('userId', $userId)
      ->where('courseId', $courseId)
      ->where('completionPercent', 100)
      ->firstOrFail();
    $uniqueCode = 'CERT-' . strtoupper(substr(md5($userId . $courseId . time()), 0, 12));
    $certificate = Certificate::create([
      'userId' => $userId,
      'courseId' => $courseId,
      'uniqueCode' => $uniqueCode,
      'pdfPath' => "/certificates/{$uniqueCode}.pdf",
      'issuedAt' => now(),
    ]);
    return $certificate;
  }
  public function verifyCertificate($uniqueCode)
  {
    return Certificate::with(['user', 'course'])
      ->where('uniqueCode', $uniqueCode)
      ->first();
  }
}