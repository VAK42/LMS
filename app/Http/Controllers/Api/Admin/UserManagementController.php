<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
class UserManagementController extends Controller
{
  public function index()
  {
    $users = User::all();
    return response()->json($users);
  }
  public function updateRole(Request $request, $userId)
  {
    $validated = $request->validate([
      'role' => 'required|in:admin,instructor,learner',
    ]);
    User::findOrFail($userId)->update(['role' => $validated['role']]);
    return response()->json(['message' => 'User Role Updated!']);
  }
  public function destroy($userId)
  {
    User::findOrFail($userId)->delete();
    return response()->json(['message' => 'User Deleted!']);
  }
}