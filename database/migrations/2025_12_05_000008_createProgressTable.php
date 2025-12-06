<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('progress', function (Blueprint $table) {
      $table->id('progressId');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('lessonId')->constrained('lessons', 'lessonId')->onDelete('cascade');
      $table->boolean('isCompleted')->default(false);
      $table->decimal('completionPercent', 5, 2)->default(0);
      $table->integer('timeSpentSeconds')->default(0);
      $table->decimal('score', 5, 2)->nullable();
      $table->timestamp('startedAt')->nullable();
      $table->timestamp('completedAt')->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->unique(['userId', 'lessonId']);
      $table->index(['userId', 'isCompleted']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('progress');
  }
};