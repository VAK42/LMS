<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('verificationTokens', function (Blueprint $table) {
      $table->unsignedBigInteger('userId')->primary();
      $table->string('token');
      $table->timestamp('expiresAt');
      $table->timestamp('createdAt');
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->index('token');
    });
    Schema::table('users', function (Blueprint $table) {
      $table->text('bio')->nullable()->after('avatarPath');
      $table->string('website')->nullable()->after('bio');
      $table->string('twitter')->nullable()->after('website');
      $table->string('linkedin')->nullable()->after('twitter');
      $table->string('github')->nullable()->after('linkedin');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('verificationTokens');
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['bio', 'website', 'twitter', 'linkedin', 'github']);
    });
  }
};