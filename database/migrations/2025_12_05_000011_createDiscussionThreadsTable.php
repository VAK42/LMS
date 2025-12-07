<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('discussionThreads', function (Blueprint $table) {
      $table->id('threadId');
      $table->foreignId('courseId')->constrained('courses', 'courseId')->onDelete('cascade');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->string('threadTitle');
      $table->text('threadContent');
      $table->boolean('isPinned')->default(false);
      $table->boolean('isClosed')->default(false);
      $table->integer('viewCount')->default(0);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['courseId', 'isPinned']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('discussionThreads');
  }
};