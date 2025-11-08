<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Http\Resources\PostResource;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class PostController extends Controller
{
    public function index(Request $request){
        $perPage = $request->get('per_page', 10);
        $posts = QueryBuilder::for(Post::class)
            ->allowedFilters([
                AllowedFilter::partial('title'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('user_id'),
                AllowedFilter::scope('tag')
            ])
            ->with(['author','category','tags'])
            ->paginate($perPage);
        return PostResource::collection($posts);
    }

    public function store(Request $request){
        $data = $request->validate([
            'title'=>'required|string|max:255',
            'body'=>'required|string',
            'category_id'=>'nullable|exists:categories,id',
            'tags'=>'array'
        ]);
        $data['user_id'] = $request->user()->id;
        $post = Post::create($data);
        if(!empty($data['tags'])){
            // attach tags (simple create/find)
            foreach($data['tags'] as $t){
                $tag = \App\Models\Tag::firstOrCreate(['name'=>$t,'slug'=>\Str::slug($t)]);
                $post->tags()->attach($tag->id);
            }
        }
        return new PostResource($post->load(['author','category','tags']));
    }

    public function show(Post $post){
        return new PostResource($post->load(['author','category','tags','comments']));
    }

    public function update(Request $request, Post $post){
        // author or admin only
        if($request->user()->id !== $post->user_id && !$request->user()->isAdmin()){
            return response()->json(['message'=>'Forbidden'],403);
        }
        $data = $request->validate([
            'title'=>'sometimes|required|string|max:255',
            'body'=>'sometimes|required|string',
            'category_id'=>'nullable|exists:categories,id',
            'tags'=>'array'
        ]);
        $post->update($data);
        if(isset($data['tags'])){
            $post->tags()->detach();
            foreach($data['tags'] as $t){
                $tag = \App\Models\Tag::firstOrCreate(['name'=>$t,'slug'=>\Str::slug($t)]);
                $post->tags()->attach($tag->id);
            }
        }
        return new PostResource($post->load(['author','category','tags']));
    }

    public function destroy(Request $request, Post $post){
        if($request->user()->id !== $post->user_id && !$request->user()->isAdmin()){
            return response()->json(['message'=>'Forbidden'],403);
        }
        $post->delete();
        return response()->json(['message'=>'Deleted'],200);
    }

    public function search(Request $request){
        $q = $request->get('q');
        $perPage = $request->get('per_page', 10);
        $posts = QueryBuilder::for(Post::class)
            ->allowedFilters([
                AllowedFilter::callback('q', function($query, $value){
                    $query->where('title', 'like', "%$value%")
                          ->orWhereHas('author', function($q) use($value){ $q->where('name','like',"%$value%"); })
                          ->orWhereHas('category', function($q) use($value){ $q->where('name','like',"%$value%"); })
                          ->orWhereHas('tags', function($q) use($value){ $q->where('name','like',"%$value%"); });
                })
            ])
            ->with(['author','category','tags'])
            ->paginate($perPage);
        return PostResource::collection($posts);
    }
}
