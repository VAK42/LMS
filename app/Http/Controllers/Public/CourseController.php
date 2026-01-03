<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Quiz;
use App\Models\Assessment;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
class CourseController extends Controller
{
  public function index(Request $request)
  {
    $query = Course::with(['instructor', 'category'])
      ->where('isPublished', true);
    if ($request->has('category')) {
      $query->where('categoryId', $request->category);
    }
    if ($request->has('search')) {
      $query->where('courseTitle', 'like', '%' . $request->search . '%');
    }
    $courses = $query->paginate(3)
      ->through(function ($course) {
        $course->simulatedPrice = (float) $course->simulatedPrice;
        $course->averageRating = (float) $course->averageRating;
        return $course;
      });
    $categories = Category::all();
    return Inertia::render('Public/CourseCatalog', [
      'courses' => $courses,
      'categories' => $categories,
      'filters' => $request->only(['category', 'search']),
      'user' => auth()->user()
    ]);
  }
  public function show($courseId)
  {
    $course = Course::with(['instructor', 'category', 'modules.lessons'])->findOrFail($courseId);
    $reviewsCount = $course->reviews()->count();
    $enrollmentCount = $course->enrollments()->where('isPaid', true)->count();
    $totalMinutes = 0;
    $articlesCount = 0;
    $videoCount = 0;
    foreach ($course->modules as $module) {
      foreach ($module->lessons as $lesson) {
        $hasContent = isset($lesson->contentData['path']) || isset($lesson->contentData['html']);
        $totalMinutes += $hasContent ? ($lesson->durationMinutes ?? 0) : 0;
        if (in_array($lesson->contentType, ['pdf', 'text'])) {
          $articlesCount++;
        } elseif ($lesson->contentType === 'video') {
          $videoCount++;
        }
      }
    }
    $videoDuration = round($totalMinutes / 60, 1);
    $course->modules->transform(function ($module) {
      $moduleDuration = $module->lessons->sum(function ($l) {
        $hasContent = isset($l->contentData['path']) || isset($l->contentData['html']);
        return $hasContent ? ($l->durationMinutes ?? 0) : 0;
      });
      $module->duration = $moduleDuration;
      $module->lessonCount = $module->lessons->count();
      $module->lessons->transform(function ($lesson) {
        $hasContent = isset($lesson->contentData['path']) || isset($lesson->contentData['html']);
        $lesson->duration = $hasContent ? ($lesson->durationMinutes ?? 0) : 0;
        return $lesson;
      });
      return $module;
    });
    $hasCertificate = Certificate::whereHas('course', function($q) use ($courseId) {
      $q->where('courseId', $courseId);
    })->exists();
    $user = auth()->user();
    $isEnrolled = false;
    if ($user) {
      $isEnrolled = Enrollment::where('userId', $user->userId)
        ->where('courseId', $courseId)
        ->where('isPaid', true)
        ->exists();
    }
    $quiz = Quiz::where('courseId', $courseId)->first();
    $assessment = Assessment::whereHas('lesson.module', function ($q) use ($courseId) {
      $q->where('courseId', $courseId);
    })->where('assessmentType', 'assignment')->first();
    $isInWishlist = false;
    if ($user) {
      $isInWishlist = Wishlist::where('userId', $user->userId)
        ->where('courseId', $courseId)
        ->exists();
    }
    return Inertia::render('Public/CourseDetail', [
      'course' => array_merge($course->toArray(), [
        'price' => (float) $course->simulatedPrice,
        'rating' => (float) $course->averageRating,
        'ratingsCount' => $reviewsCount,
        'studentsCount' => $course->totalEnrollments ?? $enrollmentCount,
        'lastUpdated' => $course->updatedAt ?? $course->createdAt,
        'whatYouLearn' => $course->courseMeta['whatYouLearn'] ?? [],
        'videoDuration' => $videoDuration,
        'articlesCount' => $articlesCount,
        'resourcesCount' => $articlesCount,
        'hasCertificate' => $hasCertificate,
      ]),
      'adminQrPath' => Storage::disk('public')->exists('adminQr.png') ? '/storage/adminQr.png' : null,
      'enrollmentCount' => $enrollmentCount,
      'averageRating' => (float) $course->averageRating,
      'isEnrolled' => $isEnrolled,
      'isInWishlist' => $isInWishlist,
      'quiz' => $quiz ? ['quizId' => $quiz->quizId, 'quizTitle' => $quiz->quizTitle] : null,
      'assessment' => $assessment ? ['assessmentId' => $assessment->assessmentId, 'assessmentTitle' => $assessment->assessmentTitle] : null,
      'user' => $user
    ]);
  }
}