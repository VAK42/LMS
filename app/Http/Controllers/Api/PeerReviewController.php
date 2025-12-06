<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PeerReview;
class PeerReviewController extends Controller
{
  public function store(Request $request)
  {
    $validated = $request->validate([
      'submissionId' => 'required|exists:assessmentSubmissions,submissionId',
      'score' => 'required|integer',
      'feedback' => 'required|string',
    ]);
    PeerReview::create([
      'submissionId' => $validated['submissionId'],
      'reviewerId' => $request->user()->userId,
      'score' => $validated['score'],
      'feedback' => $validated['feedback'],
      'completedAt' => now(),
    ]);
    return response()->json(['message' => 'Peer Review Submitted!']);
  }
}