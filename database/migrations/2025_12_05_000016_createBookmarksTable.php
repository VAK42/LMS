<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('bookmarks', function (Blueprint $table) {
      $table->id('bookmarkId');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('lessonId')->constrained('lessons', 'lessonId')->onDelete('cascade');
      $table->text('note')->nullable();
      $table->integer('videoTimestamp')->nullable();
      $table->timestamps();
      $table->unique(['userId', 'lessonId']);
      $table->index(['userId', 'createdAt']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('bookmarks');
  }
};