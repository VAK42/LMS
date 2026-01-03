<?php
namespace App\Http\Controllers\Learner;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\Notification;
use App\Helpers\CertificateHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CertificateController extends Controller
{
  public function index()
  {
    $userId = auth()->user()->userId;
    $enrollments = Enrollment::where('userId', $userId)->where('completionPercent', 100)->with('course')->get();
    foreach ($enrollments as $enrollment) {
      $existingCert = Certificate::where('userId', $userId)->where('courseId', $enrollment->courseId)->first();
      if (!$existingCert) {
        $courseId = $enrollment->courseId;
        $allQuizzesPassed = true;
        $quizzes = Quiz::where('courseId', $courseId)->get();
        foreach ($quizzes as $quiz) {
          $passedAttempt = QuizAttempt::where('quizId', $quiz->quizId)
            ->where('userId', $userId)
            ->where('score', '>=', $quiz->passingScore)
            ->first();
          if (!$passedAttempt) {
            $allQuizzesPassed = false;
            break;
          }
        }
        $allAssessmentsPassed = true;
        $assessments = Assessment::whereHas('lesson.module', fn($q) => $q->where('courseId', $courseId))
          ->where('assessmentType', 'assignment')
          ->get();
        foreach ($assessments as $assessment) {
          $passedSubmission = AssessmentSubmission::where('assessmentId', $assessment->assessmentId)
            ->where('userId', $userId)
            ->where('isPassed', true)
            ->first();
          if (!$passedSubmission) {
            $allAssessmentsPassed = false;
            break;
          }
        }
        if ($allQuizzesPassed && $allAssessmentsPassed) {
          $uniqueCode = 'CERT-' . strtoupper(substr(md5(uniqid()), 0, 12));
          $certificate = Certificate::create([
            'userId' => $userId,
            'courseId' => $courseId,
            'uniqueCode' => $uniqueCode,
            'pdfPath' => "/storage/certificates/{$uniqueCode}.pdf",
          ]);
          CertificateHelper::generatePDF($certificate);
          Notification::create([
            'userId' => $userId,
            'notificationType' => 'certificate',
            'notificationTitle' => 'Certificate Earned!',
            'notificationContent' => "Congratulations! You Have Completed " . $enrollment->course->courseTitle . " & Earned A Certificate!",
            'isRead' => false,
          ]);
        }
      }
    }
    $certificates = Certificate::where('userId', $userId)->with('course.instructor')->get();
    return Inertia::render('Learner/Certificates', ['certificates' => $certificates, 'user' => auth()->user()]);
  }
  public function show($certificateId)
  {
    $certificate = Certificate::with('course.instructor', 'user')->findOrFail($certificateId);
    return Inertia::render('Learner/CertificateView', ['certificate' => $certificate, 'user' => auth()->user()]);
  }
}