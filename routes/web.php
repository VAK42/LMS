<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', function ()
{
  return Inertia::render('Home', ['user' => auth()->user(), ]);
});
Route::get('/courses', function ()
{
  $courses = \App\Models\Course::with(['instructor', 'category'])->published()->paginate(12);
  $categories = \App\Models\Category::all();
  return Inertia::render('CourseCatalog', ['courses' => $courses, 'categories' => $categories, 'user' => auth()->user(), ]);
});
Route::get('/courses/{courseId}', function ($courseId)
{
  $course = \App\Models\Course::with(['instructor', 'category', 'modules.lessons'])->findOrFail($courseId);
  $enrollmentCount = $course->enrollments()->where('isPaid', true)->count();
  return Inertia::render('CourseDetail', ['course' => $course, 'enrollmentCount' => $enrollmentCount, 'averageRating' => $course->averageRating, 'user' => auth()->user(), ]);
});
Route::get('/login', function ()
{
  return Inertia::render('Login');
})->name('login');
Route::get('/register', function ()
{
  return Inertia::render('Register');
});
Route::middleware('auth:sanctum')->group(function ()
{
  Route::get('/dashboard', function ()
  {
    $user = auth()->user();
    $enrollments = \App\Models\Enrollment::with(['course.instructor', 'course.modules.lessons'])->where('userId', $user->userId)->where('isPaid', true)->get();
    $enrolledCourses = $enrollments->map(function ($enrollment) use ($user)
    {
      $course = $enrollment->course;
      $totalLessons = $course->modules->sum(function ($module)
      {
        return $module->lessons->count();
      });
      $completedLessons = \App\Models\Progress::where('userId', $user->userId)->whereIn('lessonId', $course->modules->flatMap->lessons->pluck('lessonId'))->where('isCompleted', true)->count();
      $progressPercent = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;
      return ['enrollment' => $enrollment, 'course' => $course, 'totalLessons' => $totalLessons, 'completedLessons' => $completedLessons, 'progressPercent' => round($progressPercent, 2), ];
    });
    return Inertia::render('LearnerDashboard', ['enrolledCourses' => $enrolledCourses, 'totalEnrollments' => $enrolledCourses->count(), 'user' => $user, ]);
  });
  Route::get('/instructor/dashboard', function ()
  {
    $user = auth()->user();
    $courses = \App\Models\Course::with(['category', 'modules'])->where('instructorId', $user->userId)->orderBy('createdAt', 'desc')->paginate(10);
    return Inertia::render('InstructorDashboard', ['courses' => $courses, 'user' => $user, ]);
  })->middleware('can:isAdminOrInstructor');
});