<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['user_id','title','body','category_id','status'];

    public function author(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function tags(){
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function comments(){
        return $this->morphMany(Comment::class, 'commentable');
    }
}
