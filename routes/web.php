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
Route::get('/forgotPassword', function () {
  return Inertia::render('ForgotPassword');
})->name('forgotPassword');
Route::post('/forgotPassword', [Api\ForgotPasswordController::class, 'sendResetLink'])->name('sendResetLink');
Route::get('/passwordReset', function () {
  return Inertia::render('PasswordReset');
})->name('passwordReset');
Route::post('/passwordReset', [Api\ForgotPasswordController::class, 'reset'])->name('password.update');
Route::get('/email/verify/{token}', [Api\EmailVerificationController::class, 'verify'])->name('verification.verify');
Route::get('/oauth/{provider}', [Api\OAuthController::class, 'redirectToProvider'])->name('oauth.redirect');
Route::get('/oauth/{provider}/callback', [Api\OAuthController::class, 'handleProviderCallback'])->name('oauth.callback');
Route::get('/courses', function (Illuminate\Http\Request $request) {
  $query = \App\Models\Course::with(['instructor', 'category'])
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
  $categories = \App\Models\Category::all();
  return Inertia::render('CourseCatalog', [
    'courses' => $courses,
    'categories' => $categories,
    'filters' => $request->only(['category', 'search']),
    'user' => auth()->user()
  ]);
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
Route::get('/twoFactorChallenge', function () {
  return Inertia::render('TwoFactorChallenge');
});
Route::post('/twoFactorChallenge', [Api\AuthController::class, 'verifyTwoFactor']);
Route::middleware(['auth', App\Http\Middleware\AdminRouteMiddleware::class])->group(function () {
  Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'instructor') {
      return redirect('/instructor/dashboard');
    }
    $enrollments = \App\Models\Enrollment::with(['course.instructor', 'course.modules.lessons'])->where('userId', $user->userId)->where('isPaid', true)->get();
    return Inertia::render('LearnerDashboard', ['enrolledCourses' => $enrollments, 'user' => $user]);
  });
  Route::get('/lessons/{lessonId}', function ($lessonId) {
    $lesson = \App\Models\Lesson::with(['module.course'])->findOrFail($lessonId);
    return Inertia::render('LessonViewer', ['lesson' => $lesson, 'user' => auth()->user()]);
  });
  Route::get('/settings', function () {
    $user = auth()->user();
    return Inertia::render('Settings', [
      'user' => [
        'userId' => $user->userId,
        'userName' => $user->userName,
        'userEmail' => $user->userEmail,
        'role' => $user->role,
        'twoFactorSecret' => $user->twoFactorSecret,
        'twoFactorConfirmedAt' => $user->twoFactorConfirmedAt,
      ]
    ]);
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
  Route::post('/user/twoFactorAuthentication', [Api\TwoFactorController::class, 'enable'])->name('twoFactor.enable');
  Route::post('/user/confirmedTwoFactorAuthentication', [Api\TwoFactorController::class, 'confirm'])->name('twoFactor.confirm');
  Route::delete('/user/twoFactorAuthentication', [Api\TwoFactorController::class, 'disable'])->name('twoFactor.disable');
  Route::get('/user/twoFactorRecoveryCodes', [Api\TwoFactorController::class, 'showRecoveryCodes'])->name('twoFactor.recoveryCodes');
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
  Route::get('/dashboard', [Api\DashboardController::class, 'index']);
  Route::get('/analytics', [Api\AnalyticsController::class, 'index']);
  Route::get('/profile', [Api\ProfileController::class, 'show']);
  Route::get('/lessons/{lessonId}', [Api\LessonController::class, 'show'])->middleware(App\Http\Middleware\LessonAccessMiddleware::class);
  Route::get('/assessments/{assessmentId}', [Api\AssessmentController::class, 'show']);
  Route::get('/notifications', [Api\NotificationController::class, 'index']);
  Route::get('/certificates', [Api\CertificateController::class, 'index']);
  Route::get('/certificates/{certificateId}', [Api\CertificateController::class, 'show']);
  Route::get('/bundles', [Api\BundleController::class, 'index']);
  Route::get('/courses/{courseId}/discussion', [Api\DiscussionController::class, 'index']);
  Route::get('/courses/{courseId}/reviews', [Api\ReviewController::class, 'index']);
  Route::get('/leaderboard', [Api\GamificationController::class, 'index']);
  Route::get('/supportTickets', [Api\SupportTicketController::class, 'index']);
  Route::get('/supportTickets/{ticketId}', [Api\SupportTicketController::class, 'show']);
  Route::get('/affiliate/dashboard', [Api\AffiliateController::class, 'dashboard']);
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
  Route::prefix('admin')->middleware('role:admin')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\AnalyticsController::class, 'getDashboardData']);
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index']);
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store']);
    Route::put('/users/{userId}', [App\Http\Controllers\Admin\UserController::class, 'update']);
    Route::delete('/users/{userId}', [App\Http\Controllers\Admin\UserController::class, 'destroy']);
    Route::get('/courses', [App\Http\Controllers\Admin\CourseController::class, 'index']);
    Route::put('/courses/{courseId}', [App\Http\Controllers\Admin\CourseController::class, 'update']);
    Route::delete('/courses/{courseId}', [App\Http\Controllers\Admin\CourseController::class, 'destroy']);
    Route::get('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'index']);
    Route::post('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'store']);
    Route::put('/categories/{categoryId}', [App\Http\Controllers\Admin\CategoryController::class, 'update']);
    Route::delete('/categories/{categoryId}', [App\Http\Controllers\Admin\CategoryController::class, 'destroy']);
    Route::get('/reviews', [App\Http\Controllers\Admin\ReviewController::class, 'index']);
    Route::delete('/reviews/{reviewId}', [App\Http\Controllers\Admin\ReviewController::class, 'destroy']);
    Route::get('/enrollments', [App\Http\Controllers\Admin\EnrollmentController::class, 'index']);
    Route::post('/enrollments', [App\Http\Controllers\Admin\EnrollmentController::class, 'store']);
    Route::put('/enrollments/{enrollmentId}', [App\Http\Controllers\Admin\EnrollmentController::class, 'update']);
    Route::delete('/enrollments/{enrollmentId}', [App\Http\Controllers\Admin\EnrollmentController::class, 'destroy']);
    Route::get('/coupons', [App\Http\Controllers\Admin\CouponController::class, 'index']);
    Route::post('/coupons', [App\Http\Controllers\Admin\CouponController::class, 'store']);
    Route::put('/coupons/{couponId}', [App\Http\Controllers\Admin\CouponController::class, 'update']);
    Route::delete('/coupons/{couponId}', [App\Http\Controllers\Admin\CouponController::class, 'destroy']);
    Route::get('/support', [App\Http\Controllers\Admin\SupportTicketController::class, 'index']);
    Route::put('/support/{ticketId}', [App\Http\Controllers\Admin\SupportTicketController::class, 'update']);
    Route::delete('/support/{ticketId}', [App\Http\Controllers\Admin\SupportTicketController::class, 'destroy']);
    Route::get('/certificates', [App\Http\Controllers\Admin\CertificateController::class, 'index']);
    Route::delete('/certificates/{certificateId}', [App\Http\Controllers\Admin\CertificateController::class, 'destroy']);
    Route::get('/notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index']);
    Route::post('/notifications', [App\Http\Controllers\Admin\NotificationController::class, 'store']);
    Route::delete('/notifications/{notificationId}', [App\Http\Controllers\Admin\NotificationController::class, 'destroy']);
    Route::get('/transactions', [App\Http\Controllers\Admin\TransactionController::class, 'index']);
  });
});