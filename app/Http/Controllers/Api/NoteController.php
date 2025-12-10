<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LessonNote;
class NoteController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'lessonId' => 'required|exists:lessons,lessonId',
      'noteContent' => 'required|string',
      'videoTimestamp' => 'nullable|integer',
    ]);
    LessonNote::create([
      'userId' => $request->user()->userId,
      'lessonId' => $validated['lessonId'],
      'noteContent' => $validated['noteContent'],
      'videoTimestamp' => $validated['videoTimestamp'] ?? null,
    ]);
    return response()->json(['message' => 'Note Created!']);
  }
}