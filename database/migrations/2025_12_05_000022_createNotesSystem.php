<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('lessonNotes', function (Blueprint $table) {
      $table->id('noteId');
      $table->unsignedBigInteger('userId');
      $table->unsignedBigInteger('lessonId');
      $table->text('noteContent');
      $table->integer('videoTimestamp')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->foreign('lessonId')->references('lessonId')->on('lessons')->onDelete('cascade');
      $table->index(['userId', 'lessonId']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('lessonNotes');
  }
};