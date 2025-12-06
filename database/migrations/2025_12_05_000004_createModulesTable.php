<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('modules', function (Blueprint $table) {
      $table->id('moduleId');
      $table->foreignId('courseId')->constrained('courses', 'courseId')->onDelete('cascade');
      $table->string('moduleTitle');
      $table->text('moduleDescription')->nullable();
      $table->integer('orderIndex')->default(0);
      $table->integer('durationMinutes')->default(0);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['courseId', 'orderIndex']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('modules');
  }
};