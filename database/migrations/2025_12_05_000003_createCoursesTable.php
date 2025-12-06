<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('courses', function (Blueprint $table) {
      $table->id('courseId');
      $table->string('courseTitle');
      $table->text('courseDescription');
      $table->decimal('simulatedPrice', 10, 2)->default(0);
      $table->string('courseImage')->nullable();
      $table->foreignId('instructorId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('categoryId')->constrained('categories', 'categoryId')->onDelete('cascade');
      $table->jsonb('courseMeta')->nullable();
      $table->boolean('isPublished')->default(false);
      $table->decimal('averageRating', 3, 2)->default(0);
      $table->integer('totalEnrollments')->default(0);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index('instructorId');
      $table->index('categoryId');
      $table->index('isPublished');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('courses');
  }
};