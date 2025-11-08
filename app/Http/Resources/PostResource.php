<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request){
        return [
            'id'=>$this->id,
            'title'=>$this->title,
            'body'=>$this->body,
            'status'=>$this->status,
            'author'=>[
                'id'=>$this->author->id ?? null,
                'name'=>$this->author->name ?? null
            ],
            'category'=>$this->category,
            'tags'=>$this->tags,
            'comments'=>$this->whenLoaded('comments')
        ];
    }
}
