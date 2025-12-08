<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api;
use Inertia\Inertia;
Route::get('/', function () {
  $featuredCourses = \App\Models\Course::with(['instructor', 'category'])
    ->where('isPublished', true)
    ->orderBy('averageRating', 'desc')
    ->limit(6)
    ->get()
    ->map(function ($course) {
      return [
        'courseId' => $course->courseId,
        'courseTitle' => $course->courseTitle,
        'category' => $course->category,
        'instructor' => $course->instructor,
        'price' => (float) $course->simulatedPrice,
        'rating' => (float) $course->averageRating,
      ];
    });
  return Inertia::render('Home', [
    'user' => auth()->user(),
    'featuredCourses' => $featuredCourses
  ]);
});
Route::get('/login', [Api\AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [Api\AuthController::class, 'login']);
Route::get('/register', [Api\AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [Api\AuthController::class, 'register']);
Route::post('/logout', [Api\AuthController::class, 'logout'])->name('logout');
Route::get('/password/reset', function () {
  return Inertia::render('ForgotPassword');
})->name('password.request');
Route::post('/password/email', [Api\ForgotPasswordController::class, 'sendResetLink'])->name('password.email');
Route::get('/password/reset/{token}', [Api\ForgotPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/password/reset', [Api\ForgotPasswordController::class, 'reset'])->name('password.update');
Route::get('/email/verify/{token}', [Api\EmailVerificationController::class, 'verify'])->name('verification.verify');
Route::get('/courses', function () {
  $courses = \App\Models\Course::with(['instructor', 'category'])
    ->where('isPublished', true)
    ->paginate(12)
    ->through(function ($course) {
      $course->simulatedPrice = (float) $course->simulatedPrice;
      $course->averageRating = (float) $course->averageRating;
      return $course;
    });
  $categories = \App\Models\Category::all();
  return Inertia::render('CourseCatalog', ['courses' => $courses, 'categories' => $categories, 'user' => auth()->user()]);
});
Route::get('/courses/{courseId}', function ($courseId) {
  $course = \App\Models\Course::with(['instructor', 'category', 'modules.lessons'])->findOrFail($courseId);
  $reviewsCount = $course->reviews()->count();
  $enrollmentCount = $course->enrollments()->where('isPaid', true)->count();
  $totalMinutes = 0;
  $articlesCount = 0;
  $videoCount = 0;
  foreach ($course->modules as $module) {
    foreach ($module->lessons as $lesson) {
      $totalMinutes += $lesson->durationMinutes ?? 0;
      if (in_array($lesson->contentType, ['pdf', 'text'])) {
        $articlesCount++;
      } elseif ($lesson->contentType === 'video') {
        $videoCount++;
      }
    }
  }
  $videoDuration = round($totalMinutes / 60, 1);
  $course->modules->transform(function ($module) {
    $moduleDuration = $module->lessons->sum('durationMinutes');
    $module->duration = $moduleDuration;
    $module->lessonCount = $module->lessons->count();
    $module->lessons->transform(function ($lesson) {
      $lesson->duration = $lesson->durationMinutes ?? 0;
      return $lesson;
    });
    return $module;
  });
  $hasCertificate = \App\Models\Certificate::whereHas('course', function($q) use ($courseId) {
    $q->where('courseId', $courseId);
  })->exists();
  return Inertia::render('CourseDetail', [
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
    'enrollmentCount' => $enrollmentCount,
    'averageRating' => (float) $course->averageRating,
    'user' => auth()->user()
  ]);
});
Route::middleware('auth')->group(function () {
  Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'admin') {
      return redirect('/admin/dashboard');
    } elseif ($user->role === 'instructor') {
      return redirect('/instructor/dashboard');
    }
    $enrollments = \App\Models\Enrollment::with(['course.instructor', 'course.modules.lessons'])->where('userId', $user->userId)->where('isPaid', true)->get();
    return Inertia::render('LearnerDashboard', ['enrolledCourses' => $enrollments, 'user' => $user]);
  });
  Route::get('/lessons/{lessonId}', function ($lessonId) {
    $lesson = \App\Models\Lesson::with(['module.course'])->findOrFail($lessonId);
    return Inertia::render('LessonDetail', ['lesson' => $lesson, 'user' => auth()->user()]);
  });
  Route::get('/settings', function () {
    return Inertia::render('Settings', ['user' => auth()->user()]);
  })->name('settings');
  Route::get('/profile', function () {
    return Inertia::render('Profile', ['user' => auth()->user()]);
  })->name('profile');
  Route::get('/supportTickets', [Api\SupportTicketController::class, 'index'])->name('supportTickets');
  Route::get('/affiliate', function () {
    return Inertia::render('AffiliateProgram', ['user' => auth()->user()]);
  })->name('affiliate');
  Route::get('/bookmarks', function () {
    $bookmarks = \App\Models\Bookmark::where('userId', auth()->user()->userId)->with('lesson')->paginate(20);
    return Inertia::render('Bookmarks', ['bookmarks' => $bookmarks, 'user' => auth()->user()]);
  })->name('bookmarks');
  Route::get('/wishlist', function () {
    $wishlistItems = \App\Models\Wishlist::where('userId', auth()->user()->userId)->with('course')->get();
    return Inertia::render('Wishlist', ['wishlistItems' => $wishlistItems, 'user' => auth()->user()]);
  })->name('wishlist');
  Route::get('/bundles', function () {
    $bundles = \App\Models\CourseBundle::where('isActive', true)->get();
    return Inertia::render('Bundles', ['bundles' => $bundles, 'user' => auth()->user()]);
  })->name('bundles');
  Route::get('/leaderboard', function () {
    $leaderboard = \App\Models\Leaderboard::orderBy('rank')->limit(100)->with('user')->get();
    return Inertia::render('Leaderboard', ['leaderboard' => $leaderboard, 'user' => auth()->user()]);
  })->name('leaderboard');
  Route::get('/analytics', function () {
    return Inertia::render('Analytics', ['user' => auth()->user()]);
  })->name('analytics');
  Route::get('/notifications', function () {
    $notifications = \App\Models\Notification::where('userId', auth()->user()->userId)->orderBy('createdAt', 'desc')->paginate(20);
    return Inertia::render('Notifications', ['notifications' => $notifications, 'user' => auth()->user()]);
  })->name('notifications');
  Route::get('/certificates', function () {
    $certificates = \App\Models\Certificate::where('userId', auth()->user()->userId)->with('course')->get();
    return Inertia::render('Certificates', ['certificates' => $certificates, 'user' => auth()->user()]);
  })->name('certificates');
  Route::get('/certificates/{certificateId}', function ($certificateId) {
    $certificate = \App\Models\Certificate::with('course', 'user')->findOrFail($certificateId);
    return Inertia::render('CertificateView', ['certificate' => $certificate]);
  })->name('certificates.view');
  Route::get('/calendar', function () {
    return Inertia::render('Calendar', ['user' => auth()->user()]);
  })->name('calendar');
  Route::get('/instructor/dashboard', function () {
    $user = auth()->user();
    $courses = \App\Models\Course::with(['category', 'modules'])->where('instructorId', $user->userId)->orderBy('createdAt', 'desc')->paginate(10);
    return Inertia::render('InstructorDashboard', ['courses' => $courses, 'user' => $user]);
  })->middleware('role:instructor');
  Route::get('/instructor/courses/{courseId}/edit', function ($courseId) {
    $course = \App\Models\Course::with('modules.lessons')->findOrFail($courseId);
    return Inertia::render('Instructor/CourseEdit', ['course' => $course, 'user' => auth()->user()]);
  })->middleware('role:instructor');
  Route::get('/instructor/grading', function () {
    $submissions = \App\Models\AssessmentSubmission::with(['assessment', 'user'])->whereHas('assessment.lesson.module.course', function ($q) {
      $q->where('instructorId', auth()->id());
    })->paginate(20);
    return Inertia::render('Instructor/Grading', ['submissions' => $submissions, 'user' => auth()->user()]);
  })->middleware('role:instructor');
  Route::get('/instructor/students', function () {
    $enrollments = \App\Models\Enrollment::with(['user', 'course'])->whereHas('course', function ($q) {
      $q->where('instructorId', auth()->id());
    })->paginate(50);
    return Inertia::render('Instructor/Students', ['enrollments' => $enrollments, 'user' => auth()->user()]);
  })->middleware('role:instructor');
  Route::get('/admin/dashboard', function () {
    $totalUsers = \App\Models\User::count();
    $totalCourses = \App\Models\Course::count();
    $totalEnrollments = \App\Models\Enrollment::where('isPaid', true)->count();
    $completedLessons = \App\Models\Progress::where('isCompleted', true)->count();
    $totalLessons = \App\Models\Lesson::count();
    $averageCompletion = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;
    $recentUsers = \App\Models\User::orderBy('createdAt', 'desc')->limit(10)->get();
    return Inertia::render('AdminDashboard', [
      'metrics' => [
        'totalUsers' => $totalUsers,
        'totalCourses' => $totalCourses,
        'totalEnrollments' => $totalEnrollments,
        'averageCompletion' => $averageCompletion,
        'recentUsers' => $recentUsers,
      ],
      'user' => auth()->user()
    ]);
  })->middleware('role:admin');
  Route::get('/admin/transactions', function () {
    $transactions = \App\Models\PaymentTransaction::with(['user', 'course'])->paginate(20);
    return Inertia::render('Admin/TransactionManagement', ['transactions' => $transactions, 'filters' => [], 'user' => auth()->user()]);
  })->middleware('role:admin');
});