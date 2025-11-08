<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index(Request $request){
        $perPage = $request->get('per_page', 10);
        $comments = Comment::with(['author','commentable'])->paginate($perPage);
        return response()->json($comments);
    }

    public function store(Request $request){
        $data = $request->validate([
            'commentable_type'=>'required|string',
            'commentable_id'=>'required|integer',
            'body'=>'required|string'
        ]);
        $modelClass = '\\App\\Models\\'.ucfirst($data['commentable_type']);
        $comment = new Comment([
            'user_id' => $request->user()->id,
            'body' => $data['body']
        ]);
        $instance = $modelClass::findOrFail($data['commentable_id']);
        $instance->comments()->save($comment);
        return response()->json($comment->load('author'),201);
    }

    public function update(Request $request, Comment $comment){
        if($request->user()->id !== $comment->user_id && !$request->user()->isAdmin() && $request->user()->id !== $comment->commentable->user_id){
            return response()->json(['message'=>'Forbidden'],403);
        }
        $data = $request->validate(['body'=>'required|string']);
        $comment->update($data);
        return response()->json($comment->load('author'));
    }

    public function destroy(Request $request, Comment $comment){
        if($request->user()->id !== $comment->user_id && !$request->user()->isAdmin() && $request->user()->id !== $comment->commentable->user_id){
            return response()->json(['message'=>'Forbidden'],403);
        }
        $comment->delete();
        return response()->json(['message'=>'Deleted']);
    }

    public function show(Comment $comment){
        return response()->json($comment->load('author','commentable'));
    }
}
