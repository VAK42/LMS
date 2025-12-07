<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('courseReviews', function (Blueprint $table) {
      $table->id('reviewId');
      $table->unsignedBigInteger('courseId');
      $table->unsignedBigInteger('userId');
      $table->integer('rating')->unsigned()->default(5);
      $table->text('reviewText')->nullable();
      $table->text('instructorResponse')->nullable();
      $table->timestamp('respondedAt')->nullable();
      $table->integer('helpfulCount')->default(0);
      $table->integer('notHelpfulCount')->default(0);
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('courseId')->references('courseId')->on('courses')->onDelete('cascade');
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->unique(['courseId', 'userId']);
      $table->index(['courseId', 'rating']);
    });
    Schema::create('reviewHelpfulness', function (Blueprint $table) {
      $table->id('helpfulnessId');
      $table->unsignedBigInteger('reviewId');
      $table->unsignedBigInteger('userId');
      $table->boolean('isHelpful');
      $table->timestamp('createdAt')->useCurrent();
      $table->foreign('reviewId')->references('reviewId')->on('courseReviews')->onDelete('cascade');
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->unique(['reviewId', 'userId']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('reviewHelpfulness');
    Schema::dropIfExists('courseReviews');
  }
};