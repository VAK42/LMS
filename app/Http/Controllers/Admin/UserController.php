<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
class UserController extends Controller
{
  public function index(Request $request)
  {
    $query = User::query();
    $query->where('userId', '!=', auth()->id());
    if ($request->has('search')) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->where('userName', 'like', "%{$search}%")
          ->orWhere('userEmail', 'like', "%{$search}%");
      });
    }
    if ($request->has('role') && $request->role !== '') {
      $query->where('role', $request->role);
    }
    $users = $query->orderBy('createdAt', 'desc')->orderBy('userId', 'desc')->paginate(2);
    return Inertia::render('Admin/UserManagement', [
      'users' => $users,
      'filters' => $request->only(['search', 'role']),
      'user' => auth()->user()
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'userName' => 'required|string|max:255',
      'userEmail' => 'required|email|unique:users,userEmail',
      'password' => 'required|string|min:8',
      'role' => 'required|in:admin,instructor,learner',
    ]);
    User::create([
      'userName' => $validated['userName'],
      'userEmail' => $validated['userEmail'],
      'password' => Hash::make($validated['password']),
      'role' => $validated['role'],
      'emailVerifiedAt' => now(),
    ]);
    return redirect()->back()->with('success', 'User Created Successfully!');
  }
  public function update(Request $request, $userId)
  {
    $user = User::findOrFail($userId);
    $validated = $request->validate([
      'userName' => 'required|string|max:255',
      'userEmail' => 'required|email|unique:users,userEmail,' . $userId . ',userId',
      'password' => 'nullable|string|min:8',
      'role' => 'required|in:admin,instructor,learner',
    ]);
    $user->update([
      'userName' => $validated['userName'],
      'userEmail' => $validated['userEmail'],
      'role' => $validated['role'],
    ]);
    if (!empty($validated['password'])) {
      $user->update(['password' => Hash::make($validated['password'])]);
    }
    return redirect()->back()->with('success', 'User Updated Successfully!');
  }
  public function destroy($userId)
  {
    $user = User::findOrFail($userId);
    if ($user->userId === auth()->id()) {
      return redirect()->back()->withErrors(['error' => 'Cannot Delete Your Own Account!']);
    }
    $user->delete();
    return redirect()->back()->with('success', 'User Deleted Successfully!');
  }
  public function export(): JsonResponse
  {
    $users = User::select(['userId', 'userName', 'userEmail', 'role', 'emailVerifiedAt', 'createdAt'])->where('role', '!=', 'admin')->get();
    return response()->json($users);
  }
}