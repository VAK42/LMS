<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('lessons', function (Blueprint $table) {
      $table->id('lessonId');
      $table->foreignId('moduleId')->constrained('modules', 'moduleId')->onDelete('cascade');
      $table->string('lessonTitle');
      $table->enum('contentType', ['text', 'video', 'pdf', 'quiz'])->default('text');
      $table->jsonb('contentData');
      $table->integer('orderIndex')->default(0);
      $table->integer('durationMinutes')->default(0);
      $table->boolean('isMandatory')->default(true);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['moduleId', 'orderIndex']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('lessons');
  }
};