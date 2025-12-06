<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CourseBundle;
class BundleController extends Controller
{
  public function index()
  {
    $bundles = CourseBundle::with('courses')->where('isActive', true)->get();
    return Inertia::render('Bundles', [
      'bundles' => $bundles,
    ]);
  }
}