<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('enrollments', function (Blueprint $table) {
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('courseId')->constrained('courses', 'courseId')->onDelete('cascade');
      $table->timestamp('enrollmentDate')->useCurrent();
      $table->boolean('isPaid')->default(false);
      $table->decimal('completionPercent', 5, 2)->default(0);
      $table->timestamp('completedAt')->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->primary(['userId', 'courseId']);
      $table->index('enrollmentDate');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('enrollments');
  }
};