<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('categories', function (Blueprint $table) {
      $table->id('categoryId');
      $table->string('categoryName');
      $table->string('slug')->unique();
      $table->string('icon')->nullable();
      $table->text('description')->nullable();
      $table->integer('courseCount')->default(0);
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index('slug');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('categories');
  }
};