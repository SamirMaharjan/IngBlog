<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index(Request $request){
        $perPage = $request->get('per_page', 10);
        return response()->json(Category::paginate($perPage));
    }

    public function store(Request $request){
        $request->validate(['name'=>'required|string|unique:categories,name']);
        $cat = Category::create(['name'=>$request->name,'slug'=>\Str::slug($request->name)]);
        return response()->json($cat,201);
    }

    public function show(Category $category){ return response()->json($category); }

    public function update(Request $request, Category $category){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $request->validate(['name'=>'required|string|unique:categories,name,'.$category->id]);
        $category->update(['name'=>$request->name,'slug'=>\Str::slug($request->name)]);
        return response()->json($category);
    }

    public function destroy(Request $request, Category $category){
        if(!$request->user()->isAdmin()) return response()->json(['message'=>'Forbidden'],403);
        $category->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
