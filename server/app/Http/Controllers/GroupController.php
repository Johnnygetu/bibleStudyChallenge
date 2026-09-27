<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    public function index()
    {
        return Group::withCount('readers')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:groups,name',
        ]);

        $group = Group::create($data);

        return response($group->loadCount('readers'), 201);
    }

    public function show(Group $group)
    {
        return $group->load('readers');
    }

    public function update(Request $request, Group $group)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:groups,name,'.$group->id,
        ]);

        $group->update($data);

        return $group->loadCount('readers');
    }

    public function destroy(Group $group)
    {
        $group->readers()->detach();
        $group->delete();

        return response(null, 204);
    }

    /**
     * Move a reader from this group to another one.
     */
    public function swapMember(Request $request, Group $group)
    {
        $data = $request->validate([
            'reader_id' => 'required|integer|exists:readers,id',
            'target_group_id' => 'required|integer|exists:groups,id',
        ]);

        if ((int) $data['target_group_id'] === $group->id) {
            return response(['message' => 'Pick a different group to move this reader to.'], 422);
        }

        if (! $group->readers()->whereKey($data['reader_id'])->exists()) {
            return response(['message' => 'That reader is not in this group.'], 422);
        }

        DB::transaction(function () use ($group, $data) {
            $target = Group::findOrFail($data['target_group_id']);

            $group->readers()->detach($data['reader_id']);
            $target->readers()->syncWithoutDetaching([$data['reader_id']]);
        });

        return response([
            'group' => Group::withCount('readers')->findOrFail($group->id),
            'target' => Group::withCount('readers')->findOrFail($data['target_group_id']),
        ]);
    }

    /**
     * Create the requested number of groups and randomly distribute all
     * readers across them.
     */
    public function assignRandom(Request $request)
    {
        $data = $request->validate([
            'count' => 'required|integer|min:1|max:50',
        ]);

        $readers = Reader::all();

        if ($readers->isEmpty()) {
            return response(['message' => 'There are no readers to assign to groups yet.'], 422);
        }

        DB::transaction(function () use ($data, $readers) {
            $groups = collect(range(1, $data['count']))
                ->map(fn ($n) => Group::create(['name' => 'Group '.$n]));

            // Shuffle once, then deal readers round-robin so the groups
            // end up random but evenly sized.
            $readers->shuffle()->values()->each(function ($reader, $index) use ($groups) {
                $groups[$index % $groups->count()]->readers()->attach($reader->id);
            });
        });

        return response(Group::withCount('readers')->latest()->get(), 201);
    }
}
