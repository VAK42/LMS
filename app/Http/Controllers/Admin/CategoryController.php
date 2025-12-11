<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CategoryController extends Controller
{
  public function index(Request $request)
  {
    $query = Category::withCount('courses');
    if ($request->has('search')) {
      $search = $request->search;
      $query->where('categoryName', 'like', "%{$search}%");
    }
    $categories = $query->orderBy('categoryName', 'asc')->paginate(2);
    return Inertia::render('Admin/CategoryManagement', [
      'categories' => $categories,
      'filters' => $request->only(['search']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'categoryName' => 'required|string|max:255|unique:categories,categoryName',
      'categoryDescription' => 'nullable|string',
    ]);
    Category::create($validated);
    return redirect()->back()->with('success', 'Category Created Successfully!');
  }
  public function update(Request $request, $categoryId)
  {
    $category = Category::findOrFail($categoryId);
    $validated = $request->validate([
      'categoryName' => 'required|string|max:255|unique:categories,categoryName,' . $categoryId . ',categoryId',
      'categoryDescription' => 'nullable|string',
    ]);
    $category->update($validated);
    return redirect()->back()->with('success', 'Category Updated Successfully!');
  }
  public function destroy($categoryId)
  {
    $category = Category::findOrFail($categoryId);
    $coursesCount = $category->courses()->count();
    if ($coursesCount > 0) {
      return redirect()->back()->withErrors(['error' => "Cannot Delete Category With {$coursesCount} Courses!"]);
    }
    $category->delete();
    return redirect()->back()->with('success', 'Category Deleted Successfully!');
  }
}