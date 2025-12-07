<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('discussionPosts', function (Blueprint $table) {
      $table->id('postId');
      $table->foreignId('threadId')->constrained('discussionThreads', 'threadId')->onDelete('cascade');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('parentPostId')->nullable()->constrained('discussionPosts', 'postId')->onDelete('cascade');
      $table->text('postContent');
      $table->boolean('isAcceptedAnswer')->default(false);
      $table->integer('likeCount')->default(0);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['threadId', 'createdAt']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('discussionPosts');
  }
};