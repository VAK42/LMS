<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('assessmentSubmissions', function (Blueprint $table) {
      $table->id('submissionId');
      $table->foreignId('assessmentId')->constrained('assessments', 'assessmentId')->onDelete('cascade');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->jsonb('answerData');
      $table->decimal('score', 5, 2)->nullable();
      $table->integer('attemptNumber')->default(1);
      $table->boolean('isPassed')->default(false);
      $table->text('instructorFeedback')->nullable();
      $table->timestamp('submittedAt')->useCurrent();
      $table->timestamp('gradedAt')->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['userId', 'assessmentId']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('assessmentSubmissions');
  }
};