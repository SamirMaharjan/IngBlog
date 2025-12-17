<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->title(),
            'body' => fake()->unique()->text(),
            'category_id' => \App\Models\Category::factory()->create()->id,
            'user_id' => \App\Models\User::factory()->create()->id,
            'status' => fake()->randomElement(['draft','published']),
        ];
    }
}
