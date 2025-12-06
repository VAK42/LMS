<?php
namespace App\Http\Controllers\Api\Instructor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\Lesson;
class SyllabusController extends Controller
{
  public function storeModule(Request $request)
  {
    $validated = $request->validate([
      'courseId' => 'required|exists:courses,courseId',
      'moduleTitle' => 'required|string',
      'moduleDescription' => 'nullable|string',
      'orderIndex' => 'required|integer',
    ]);
    Module::create($validated);
    return response()->json(['message' => 'Module Created!']);
  }
  public function storeLesson(Request $request)
  {
    $validated = $request->validate([
      'moduleId' => 'required|exists:modules,moduleId',
      'lessonTitle' => 'required|string',
      'contentType' => 'required|in:text,video,pdf,quiz',
      'contentData' => 'required|array',
      'orderIndex' => 'required|integer',
    ]);
    Lesson::create($validated);
    return response()->json(['message' => 'Lesson Created!']);
  }
}