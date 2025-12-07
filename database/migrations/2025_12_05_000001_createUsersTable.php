<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('users', function (Blueprint $table) {
      $table->id('userId');
      $table->string('userName');
      $table->string('userEmail')->unique();
      $table->string('password');
      $table->enum('role', ['admin', 'instructor', 'learner'])->default('learner');
      $table->string('avatarPath')->nullable();
      $table->timestamp('emailVerifiedAt')->nullable();
      $table->string('rememberToken', 100)->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index('userEmail');
      $table->index('role');
    });
    Schema::create('passwordResetTokens', function (Blueprint $table) {
      $table->id('tokenId');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->string('token');
      $table->timestamp('expiresAt');
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index('token');
    });
    Schema::create('sessions', function (Blueprint $table) {
      $table->string('id')->primary();
      $table->foreignId('userId')->nullable()->index();
      $table->string('ipAddress', 45)->nullable();
      $table->string('userAgent')->nullable();
      $table->longText('payload');
      $table->integer('lastActivity')->index();
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('users');
    Schema::dropIfExists('passwordResetTokens');
    Schema::dropIfExists('sessions');
  }
};