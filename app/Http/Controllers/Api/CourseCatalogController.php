<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Category;
class CourseCatalogController extends Controller
{
  public function index(Request $request)
  {
    $query = Course::with(['instructor', 'category'])->where('isPublished', true);
    if ($request->has('category')) {
      $query->where('categoryId', $request->category);
    }
    if ($request->has('search')) {
      $query->where('courseTitle', 'like', '%' . $request->search . '%');
    }
    $courses = $query->paginate(12);
    $categories = Category::all();
    return Inertia::render('CourseCatalog', [
      'courses' => $courses,
      'categories' => $categories,
      'filters' => $request->only(['category', 'search']),
      'user' => $request->user(),
    ]);
  }
}