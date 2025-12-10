<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;
class AdminDashboardController extends Controller
{
  public function index()
  {
    $totalUsers = User::count();
    $totalCourses = Course::count();
    $totalInstructors = User::where('role', 'instructor')->count();
    $totalLearners = User::where('role', 'learner')->count();
    return Inertia::render('AdminDashboard', [
      'stats' => [
        'totalUsers' => $totalUsers,
        'totalCourses' => $totalCourses,
        'totalInstructors' => $totalInstructors,
        'totalLearners' => $totalLearners,
      ],
    ]);
  }
}