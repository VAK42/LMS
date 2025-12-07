<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->json('notificationPreferences')->nullable()->after('preferredLocale');
      $table->json('privacySettings')->nullable()->after('notificationPreferences');
      $table->boolean('showProfile')->default(true)->after('privacySettings');
      $table->boolean('showProgress')->default(true)->after('showProfile');
    });
  }
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['notificationPreferences', 'privacySettings', 'showProfile', 'showProgress']);
    });
  }
};