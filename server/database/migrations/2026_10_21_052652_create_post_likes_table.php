<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('post_likes', function (Blueprint $table) {
            // posts.id is a UUID string key, so the foreign key must match its
            // type — a plain foreignId() (bigint) fails errno 150 at MySQL.
            $table->uuid('post_id');
            $table->foreignId('reader_id');
            $table->timestamps();
            $table->foreign('post_id')->references('id')->on('posts')->cascadeOnDelete();
            $table->foreign('reader_id')->references('id')->on('readers')->cascadeOnDelete();
            $table->unique(['post_id', 'reader_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_likes');
    }
};
