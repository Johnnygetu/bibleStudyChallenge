<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return Admin::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate(['chat_id' => 'required|unique:admins,chat_id']);
        return response(Admin::create($data), 201);
    }

    public function show(Admin $admin)
    {
        return $admin;
    }

    public function update(Request $request, Admin $admin)
    {
        $data = $request->validate(['chat_id' => 'required|unique:admins,chat_id,' . $admin->id]);
        return $admin->update($data) ? $admin : response(['message' => 'Update failed'], 500);
    }

    public function destroy(Admin $admin)
    {
        $admin->delete();
        return response(null, 204);
    }
}
