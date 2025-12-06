<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('assessments', function (Blueprint $table) {
      $table->id('assessmentId');
      $table->foreignId('lessonId')->constrained('lessons', 'lessonId')->onDelete('cascade');
      $table->string('assessmentTitle');
      $table->enum('assessmentType', ['quiz', 'assignment', 'exam'])->default('quiz');
      $table->jsonb('questionData');
      $table->decimal('passingScore', 5, 2)->default(70.00);
      $table->integer('timeLimit')->nullable();
      $table->integer('maxAttempts')->default(3);
      $table->boolean('randomizeQuestions')->default(false);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index('lessonId');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('assessments');
  }
};