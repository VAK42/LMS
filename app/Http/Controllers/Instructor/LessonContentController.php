<?php
namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class LessonContentController extends Controller
{
  public function uploadContent(Request $request, $lessonId)
  {
    $lesson = Lesson::whereHas('module.course', function ($q) use ($request) {
      $q->where('instructorId', $request->user()->userId);
    })->where('lessonId', $lessonId)->firstOrFail();
    if ($lesson->contentType === 'text') {
      $validated = $request->validate([
        'htmlContent' => 'required|string',
      ]);
      $lesson->update([
        'contentData' => ['html' => $validated['htmlContent']],
        'durationMinutes' => 1,
      ]);
      return response()->json(['message' => 'Content Saved!']);
    }
    $validated = $request->validate([
      'file' => 'required|file|max:512000',
      'durationMinutes' => 'nullable|integer|min:1',
    ]);
    $file = $request->file('file');
    $extension = $file->getClientOriginalExtension();
    if ($lesson->contentType === 'video' && !in_array($extension, ['mp4', 'webm', 'mov'])) {
      return response()->json(['error' => 'Invalid Video Format! Use MP4, WebM, MOV!'], 400);
    }
    if ($lesson->contentType === 'pdf' && $extension !== 'pdf') {
      return response()->json(['error' => 'Invalid File Format! Use PDF!'], 400);
    }
    $oldContent = $lesson->contentData;
    if ($oldContent && isset($oldContent['path'])) {
      Storage::disk('public')->delete($oldContent['path']);
    }
    $path = $file->store('lessons/' . $lesson->lessonId, 'public');
    $durationMinutes = 1;
    if ($lesson->contentType === 'video' && $request->has('durationMinutes')) {
      $durationMinutes = (int) $request->durationMinutes;
    }
    $lesson->update([
      'contentData' => [
        'path' => $path,
        'filename' => $file->getClientOriginalName(),
        'size' => $file->getSize(),
      ],
      'durationMinutes' => $durationMinutes,
    ]);
    return response()->json([
      'message' => 'File Uploaded!',
      'path' => '/storage/' . $path,
    ]);
  }
  public function getContent($lessonId)
  {
    $lesson = Lesson::findOrFail($lessonId);
    return response()->json([
      'contentType' => $lesson->contentType,
      'contentData' => $lesson->contentData,
    ]);
  }
}