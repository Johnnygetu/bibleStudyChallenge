<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained('book_chapters')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['plan_id', 'chapter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
