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
        Schema::create('tg_users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('chat_id')->nullable(false);
            $table->string('full_name')->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tg_users');
    }
};
