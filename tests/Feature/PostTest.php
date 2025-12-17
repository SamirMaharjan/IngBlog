<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->category = Category::factory()->create();
    }

    // ========== CREATE POST TESTS ==========
    public function test_create_post_with_valid_data()
    {
        $response = $this->actingAs($this->user)->postJson('/api/posts', [
            'title' => 'Test Post',
            'body' => 'This is a test post body',
            'category_id' => $this->category->id,
            'tags' => ['laravel', 'testing'],
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['data' => ['id', 'title', 'body', 'author', 'category', 'tags']])
                 ->assertJson(['data' => ['title' => 'Test Post', 'author' => ['id' => $this->user->id]]]);

        $this->assertDatabaseHas('posts', ['title' => 'Test Post']);
        $this->assertCount(2, Tag::all());
    }

    public function test_create_post_without_authentication()
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'body' => 'This is a test post body',
        ]);

        $response->assertStatus(401);
    }

    public function test_create_post_without_title()
    {
        $response = $this->actingAs($this->user)->postJson('/api/posts', [
            'body' => 'This is a test post body',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('title');
    }

    public function test_create_post_without_body()
    {
        $response = $this->actingAs($this->user)->postJson('/api/posts', [
            'title' => 'Test Post',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('body');
    }

    public function test_create_post_with_invalid_category_id()
    {
        $response = $this->actingAs($this->user)->postJson('/api/posts', [
            'title' => 'Test Post',
            'body' => 'This is a test post body',
            'category_id' => 999,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('category_id');
    }

    public function test_create_post_without_category()
    {
        $response = $this->actingAs($this->user)->postJson('/api/posts', [
            'title' => 'Test Post',
            'body' => 'This is a test post body',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['data' => ['title' => 'Test Post']]);
    }

    public function test_create_post_with_existing_tags()
    {
        $tag = Tag::factory()->create(['name' => 'php123']);
        // dd($tag->name);

        $response = $this->actingAs($this->user)->postJson('/api/posts', [
            'title' => 'Test Post',
            'body' => 'This is a test post body',
            'tags' => ['php123', 'laravel'],
            'user_id' => $this->user->id, // should be ignored
        ]);
        // dd($response->json());
        $response->assertStatus(201);
        $this->assertCount(2, Tag::all());
    }

    // ========== UPDATE POST TESTS ==========
    public function test_update_post_by_author()
    {
        $post = Post::factory()->create(['user_id' => $this->user->id, 'title' => 'Original Title']);

        $response = $this->actingAs($this->user)->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated Title',
            'body' => 'Updated body content',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['data' => ['title' => 'Updated Title']]);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Updated Title']);
    }

    public function test_update_post_without_authentication()
    {
        $post = Post::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(401);
    }

    public function test_update_post_by_non_author()
    {
        $otherUser = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($otherUser)->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(403)
                 ->assertJson(['message' => 'Forbidden']);
    }

    public function test_update_post_tags()
    {
        $post = Post::factory()->create(['user_id' => $this->user->id]);
        $tag1 = Tag::factory()->create(['name' => 'oldtag']);
        $post->tags()->attach($tag1->id);

        $response = $this->actingAs($this->user)->putJson("/api/posts/{$post->id}", [
            'title' => 'Same Title',
            'body' => 'Same body',
            'tags' => ['newtag1', 'newtag2'],
        ]);

        $response->assertStatus(200);
        $this->assertCount(2, $post->fresh()->tags);
    }

    public function test_update_post_with_invalid_category()
    {
        $post = Post::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->putJson("/api/posts/{$post->id}", [
            'category_id' => 999,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('category_id');
    }

    // ========== SEARCH POST TESTS ==========
    public function test_search_posts_by_title()
    {
        Post::factory()->create(['title' => 'Laravel Tutorial']);
        Post::factory()->create(['title' => 'PHP Basics']);
        Post::factory()->create(['title' => 'Laravel Advanced']);

        $response = $this->getJson('/api/posts/search?filter[q]=Laravel');
        $response->assertStatus(200)
                 ->assertJsonPath('data.0.title', 'Laravel Tutorial')
                 ->assertJsonPath('data.1.title', 'Laravel Advanced');
    }

    public function test_search_posts_by_author_name()
    {
        $author = User::factory()->create(['name' => 'John Doe']);
        Post::factory()->create(['user_id' => $author->id, 'title' => 'John Post']);
        Post::factory()->create(['title' => 'Other Post']);

        $response = $this->getJson('/api/posts/search?filter[q]=John');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    public function test_search_posts_by_category_name()
    {
        $category = Category::factory()->create(['name' => 'JavaScript']);
        Post::factory()->create(['category_id' => $category->id, 'title' => 'JS Post']);
        Post::factory()->create(['title' => 'PHP Post']);

        $response = $this->getJson('/api/posts/search?filter[q]=JavaScript');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    public function test_search_posts_by_tag_name()
    {
        $post = Post::factory()->create(['title' => 'Tagged Post']);
        $tag = Tag::factory()->create(['name' => 'python']);
        $post->tags()->attach($tag->id);

        Post::factory()->create(['title' => 'Untagged Post']);

        $response = $this->getJson('/api/posts/search?filter[q]=python');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.title', 'Tagged Post');
    }

    public function test_search_posts_with_pagination()
    {
        Post::factory(15)->create();

        $response = $this->getJson('/api/posts/search?filter[q]=&per_page=5');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data')
                 ->assertJsonPath('meta.per_page', 5);
    }

    public function test_search_posts_no_results()
    {
        Post::factory()->create(['title' => 'Laravel Post']);

        $response = $this->getJson('/api/posts/search?filter[q]=nonexistent');

        $response->assertStatus(200)
                 ->assertJsonCount(0, 'data');
    }

    public function test_search_posts_includes_relationships()
    {
        $post = Post::factory()->create();
        $category = Category::factory()->create();
        $tag = Tag::factory()->create();
        $post->update(['category_id' => $category->id]);
        $post->tags()->attach($tag->id);

        $response = $this->getJson('/api/posts/search?q=' . $post->title);

        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => [['author', 'category', 'tags']]]);
    }
}