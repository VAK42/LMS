<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\PaymentTransaction;
use App\Models\Progress;
use App\Models\CourseReview;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class AnalyticsController extends Controller
{
  public function getDashboardData()
  {
    $totalUsers = User::count();
    $totalCourses = Course::count();
    $totalEnrollments = Enrollment::where('isPaid', true)->count();
    $totalRevenue = PaymentTransaction::where('transactionStatus', 'completed')->sum('amount');
    $completedLessons = Progress::where('isCompleted', true)->count();
    $totalLessons = \App\Models\Lesson::count();
    $averageCompletion = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;
    $averageRating = CourseReview::avg('rating') ?? 0;
    $lastMonthUsers = User::where('createdAt', '>=', Carbon::now()->subMonth())->count();
    $previousMonthUsers = User::whereBetween('createdAt', [Carbon::now()->subMonths(2), Carbon::now()->subMonth()])->count();
    $userGrowth = $previousMonthUsers > 0 ? (($lastMonthUsers - $previousMonthUsers) / $previousMonthUsers) * 100 : 0;
    $lastMonthCourses = Course::where('createdAt', '>=', Carbon::now()->subMonth())->count();
    $previousMonthCourses = Course::whereBetween('createdAt', [Carbon::now()->subMonths(2), Carbon::now()->subMonth()])->count();
    $courseGrowth = $previousMonthCourses > 0 ? (($lastMonthCourses - $previousMonthCourses) / $previousMonthCourses) * 100 : 0;
    $lastMonthRevenue = PaymentTransaction::where('transactionStatus', 'completed')->where('createdAt', '>=', Carbon::now()->subMonth())->sum('amount');
    $previousMonthRevenue = PaymentTransaction::where('transactionStatus', 'completed')->whereBetween('createdAt', [Carbon::now()->subMonths(2), Carbon::now()->subMonth()])->sum('amount');
    $revenueGrowth = $previousMonthRevenue > 0 ? (($lastMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100 : 0;
    $userRegistrations = [];
    for ($i = 29; $i >= 0; $i--) {
      $date = Carbon::now()->subDays($i)->format('Y-m-d');
      $count = User::whereDate('createdAt', $date)->count();
      $userRegistrations[] = ['date' => Carbon::parse($date)->format('M d'), 'users' => $count];
    }
    $topCourses = Course::select('courses.courseId', 'courses.courseTitle', DB::raw('COUNT(*) as enrollment_count'))->leftJoin('enrollments', 'courses.courseId', '=', 'enrollments.courseId')->where('enrollments.isPaid', true)->groupBy('courses.courseId', 'courses.courseTitle')->orderBy('enrollment_count', 'desc')->limit(10)->get()->map(function ($course) {
      return ['name' => $course->courseTitle, 'enrollments' => $course->enrollment_count];
    });
    $roleDistribution = User::select('role', DB::raw('COUNT(*) as count'))->groupBy('role')->get()->map(function ($item) {
      return ['name' => ucfirst($item->role), 'value' => $item->count];
    });
    $monthlyRevenue = [];
    for ($i = 5; $i >= 0; $i--) {
      $month = Carbon::now()->subMonths($i);
      $revenue = PaymentTransaction::where('transactionStatus', 'completed')->whereYear('createdAt', $month->year)->whereMonth('createdAt', $month->month)->sum('amount');
      $monthlyRevenue[] = ['month' => $month->format('M Y'), 'revenue' => (float) $revenue];
    }
    $recentActivities = [];
    $recentEnrollments = Enrollment::with(['user', 'course'])->where('isPaid', true)->orderBy('createdAt', 'desc')->limit(5)->get()->map(function ($enrollment) {
      return ['type' => 'enrollment', 'user' => $enrollment->user->userName, 'course' => $enrollment->course->courseTitle, 'timestamp' => Carbon::parse($enrollment->createdAt)->diffForHumans()];
    });
    $recentCompletions = Progress::with(['user', 'lesson.module.course'])->where('isCompleted', true)->orderBy('updatedAt', 'desc')->limit(5)->get()->map(function ($progress) {
      return ['type' => 'completion', 'user' => $progress->user->userName, 'course' => $progress->lesson->module->course->courseTitle, 'timestamp' => Carbon::parse($progress->updatedAt)->diffForHumans()];
    });
    $recentReviews = CourseReview::with(['user', 'course'])->orderBy('createdAt', 'desc')->limit(5)->get()->map(function ($review) {
      return ['type' => 'review', 'user' => $review->user->userName, 'course' => $review->course->courseTitle, 'rating' => $review->rating, 'timestamp' => Carbon::parse($review->createdAt)->diffForHumans()];
    });
    $recentActivities = collect([$recentEnrollments, $recentCompletions, $recentReviews])->flatten(1)->sortByDesc('timestamp')->take(15)->values();
    $recentUsers = User::orderBy('createdAt', 'desc')->limit(10)->get();
    return \Inertia\Inertia::render('Admin/Dashboard', [
      'metrics' => ['totalUsers' => $totalUsers, 'userGrowth' => round($userGrowth, 1), 'totalCourses' => $totalCourses, 'courseGrowth' => round($courseGrowth, 1), 'totalRevenue' => (float) $totalRevenue, 'revenueGrowth' => round($revenueGrowth, 1), 'totalEnrollments' => $totalEnrollments, 'averageCompletion' => round($averageCompletion, 1), 'averageRating' => round($averageRating, 2)],
      'charts' => ['userRegistrations' => $userRegistrations, 'topCourses' => $topCourses, 'roleDistribution' => $roleDistribution, 'monthlyRevenue' => $monthlyRevenue],
      'recentActivities' => $recentActivities,
      'recentUsers' => $recentUsers,
      'user' => auth()->user()
    ]);
  }
}