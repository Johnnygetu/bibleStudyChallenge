<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Group leader flag on the membership row. Guarded: the column may
     * already exist on databases that were updated out of band.
     */
    public function up(): void
    {
        if (Schema::hasColumn('members', 'is_leader')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            $table->boolean('is_leader')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('members', 'is_leader')) {
            Schema::table('members', function (Blueprint $table) {
                $table->dropColumn('is_leader');
            });
        }
    }
};
