<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::table('assessments', function (Blueprint $table) {
      $table->timestamp('dueDate')->nullable()->after('maxAttempts');
      $table->boolean('allowLateSubmission')->default(false)->after('dueDate');
    });
    Schema::create('courseEvents', function (Blueprint $table) {
      $table->id('eventId');
      $table->unsignedBigInteger('courseId');
      $table->string('eventTitle');
      $table->text('eventDescription')->nullable();
      $table->enum('eventType', ['deadline', 'live_session', 'milestone', 'reminder'])->default('reminder');
      $table->timestamp('eventDate');
      $table->integer('durationMinutes')->nullable();
      $table->string('meetingLink')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('courseId')->references('courseId')->on('courses')->onDelete('cascade');
      $table->index(['courseId', 'eventDate']);
    });
  }
  public function down(): void
  {
    Schema::table('assessments', function (Blueprint $table) {
      $table->dropColumn(['dueDate', 'allowLateSubmission']);
    });
    Schema::dropIfExists('courseEvents');
  }
};