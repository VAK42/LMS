<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('wishlists', function (Blueprint $table) {
      $table->id('wishlistId');
      $table->unsignedBigInteger('userId');
      $table->unsignedBigInteger('courseId');
      $table->timestamp('createdAt')->useCurrent();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->foreign('courseId')->references('courseId')->on('courses')->onDelete('cascade');
      $table->unique(['userId', 'courseId']);
      $table->index('userId');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('wishlists');
  }
};