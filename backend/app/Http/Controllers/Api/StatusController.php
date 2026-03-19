<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StatusController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                ['id' => 'api', 'message' => 'Laravel API is running'],
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json([
            'data' => [
                'id' => $id,
                'message' => 'Resource details',
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'message' => ['required', 'string', 'max:255'],
        ]);

        return response()->json([
            'data' => [
                'id' => (string) Str::uuid(),
                'message' => $payload['message'],
            ],
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $payload = $request->validate([
            'message' => ['required', 'string', 'max:255'],
        ]);

        return response()->json([
            'data' => [
                'id' => $id,
                'message' => $payload['message'],
            ],
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        return response()->json(null, 204);
    }
}
