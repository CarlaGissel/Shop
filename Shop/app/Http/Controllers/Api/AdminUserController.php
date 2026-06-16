<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', 'in:admin,customer'],
        ]);

        $user = User::create($data);

        return response()->json(['data' => $user], 201);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', 'in:admin,customer'],
        ]);

        $user->update($data);

        return response()->json(['data' => $user]);
    }

    public function destroy(User $user): JsonResponse
    {
        abort_if($user->role === 'admin' && User::where('role', 'admin')->count() === 1, 422, 'No se puede eliminar el unico administrador.');

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado.']);
    }
}
