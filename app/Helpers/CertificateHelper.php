<?php
namespace App\Helpers;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Models\Certificate;
use Illuminate\Support\Facades\Storage;
class CertificateHelper
{
  public static function generatePDF(Certificate $certificate)
  {
    $certificate->load('course.instructor', 'user');
    $html = view('certificates.pdf', [
      'userName' => $certificate->user->userName,
      'courseTitle' => $certificate->course->courseTitle,
      'instructorName' => $certificate->course->instructor->userName ?? 'Unknown',
      'issuedDate' => $certificate->createdAt->format('F d, Y'),
      'certificateCode' => $certificate->uniqueCode,
    ])->render();
    $options = new Options();
    $options->set('isHtml5ParserEnabled', true);
    $options->set('isRemoteEnabled', true);
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'landscape');
    $dompdf->render();
    $filename = "{$certificate->uniqueCode}.pdf";
    $pdfContent = $dompdf->output();
    Storage::disk('public')->put("certificates/{$filename}", $pdfContent);
    return "/storage/certificates/{$filename}";
  }
}