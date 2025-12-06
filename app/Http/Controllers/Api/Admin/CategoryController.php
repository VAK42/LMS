<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
class CategoryController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'categoryName' => 'required|string|max:255',
      'slug' => 'required|string|unique:categories,slug',
      'description' => 'nullable|string',
      'icon' => 'nullable|string',
    ]);
    Category::create($validated);
    return response()->json(['message' => 'Category Created!']);
  }
  public function update(Request $request, $categoryId)
  {
    $validated = $request->validate([
      'categoryName' => 'required|string|max:255',
      'description' => 'nullable|string',
    ]);
    Category::findOrFail($categoryId)->update($validated);
    return response()->json(['message' => 'Category Updated!']);
  }
}