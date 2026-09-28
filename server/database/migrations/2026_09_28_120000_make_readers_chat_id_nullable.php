<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The reader app is a Telegram mini app, but registration still works
     * outside Telegram: the chat id is attached later once a launch provides
     * one, so the column can no longer be required at the schema level.
     */
    public function up(): void
    {
        Schema::table('readers', function (Blueprint $table) {
            $table->bigInteger('chat_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('readers', function (Blueprint $table) {
            $table->bigInteger('chat_id')->nullable(false)->change();
        });
    }
};
