<?php

namespace App\Http\Controllers;

use App\Models\Reader;
use Illuminate\Http\Request;

class ReaderController extends Controller
{
    public function index()
    {
        return Reader::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'phone_number' => 'required|string',
            'name'         => 'required|string',
            'chat_id'      => 'required|unique:readers,chat_id',
        ]);
        return response(Reader::create($data), 201);
    }

    public function show(Reader $reader)
    {
        return $reader;
    }

    public function update(Request $request, Reader $reader)
    {
        $data = $request->validate([
            'phone_number' => 'sometimes|string',
            'name'         => 'sometimes|string',
            'chat_id'      => 'sometimes|unique:readers,chat_id,' . $reader->id,
        ]);
        return $reader->update($data) ? $reader : response(['message' => 'Update failed'], 500);
    }

    public function destroy(Reader $reader)
    {
        $reader->delete();
        return response(null, 204);
    }
}
