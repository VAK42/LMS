<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('locales', function (Blueprint $table) {
      $table->id('localeId');
      $table->string('code', 5)->unique();
      $table->string('name');
      $table->boolean('isActive')->default(true);
      $table->timestamp('createdAt')->useCurrent();
    });
    Schema::table('users', function (Blueprint $table) {
      $table->string('preferredLocale', 5)->default('en')->after('role');
    });
    \DB::table('locales')->insert([
      ['code' => 'en', 'name' => 'English', 'isActive' => true],
      ['code' => 'es', 'name' => 'Español', 'isActive' => true],
      ['code' => 'fr', 'name' => 'Français', 'isActive' => true],
      ['code' => 'vi', 'name' => 'Tiếng Việt', 'isActive' => true],
      ['code' => 'de', 'name' => 'Deutsch', 'isActive' => true],
      ['code' => 'zh', 'name' => '中文', 'isActive' => true],
      ['code' => 'ko', 'name' => '한국어', 'isActive' => true],
      ['code' => 'ja', 'name' => '日本語', 'isActive' => true],
    ]);
  }
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn('preferredLocale');
    });
    Schema::dropIfExists('locales');
  }
};