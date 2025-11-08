<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request){
        $perPage = $request->get('per_page', 10);
        return response()->json(User::paginate($perPage));
    }

    public function store(Request $request){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $data = $request->validate([
            'name'=>'required|string','email'=>'required|email|unique:users,email',
            'password'=>'required|string|min:6','role'=>'sometimes|in:admin,author'
        ]);
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        return response()->json($user,201);
    }

    public function show(User $user){ return response()->json($user); }

    public function update(Request $request, User $user){
        if(!$request->user()->isAdmin() && $request->user()->id !== $user->id) return response()->json(['message'=>'Forbidden'],403);
        $data = $request->validate([
            'name'=>'sometimes|string','email'=>'sometimes|email|unique:users,email,'.$user->id,
            'password'=>'sometimes|string|min:6','role'=>'sometimes|in:admin,author'
        ]);
        if(isset($data['password'])) $data['password'] = Hash::make($data['password']);
        $user->update($data);
        return response()->json($user);
    }

    public function destroy(Request $request, User $user){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $user->delete(); return response()->json(['message'=>'Deleted']);
    }
}
