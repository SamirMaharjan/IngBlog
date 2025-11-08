<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    public function index(Request $request){
        $perPage = $request->get('per_page', 10);
        return response()->json(Tag::paginate($perPage));
    }

    public function store(Request $request){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $request->validate(['name'=>'required|string|unique:tags,name']);
        $tag = Tag::create(['name'=>$request->name,'slug'=>\Str::slug($request->name)]);
        return response()->json($tag,201);
    }

    public function show(Tag $tag){ return response()->json($tag); }

    public function update(Request $request, Tag $tag){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $request->validate(['name'=>'required|string|unique:tags,name,'.$tag->id]);
        $tag->update(['name'=>$request->name,'slug'=>\Str::slug($request->name)]);
        return response()->json($tag);
    }

    public function destroy(Request $request, Tag $tag){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $tag->delete(); return response()->json(['message'=>'Deleted']);
    }
}
