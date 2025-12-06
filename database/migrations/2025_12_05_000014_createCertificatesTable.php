<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('certificates', function (Blueprint $table) {
      $table->id('certificateId');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('courseId')->constrained('courses', 'courseId')->onDelete('cascade');
      $table->string('uniqueCode')->unique();
      $table->string('pdfPath')->nullable();
      $table->timestamp('issuedAt')->useCurrent();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->unique(['userId', 'courseId']);
      $table->index('uniqueCode');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('certificates');
  }
};