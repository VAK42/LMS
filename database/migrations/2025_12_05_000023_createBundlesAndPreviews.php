<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('courseBundles', function (Blueprint $table) {
      $table->id('bundleId');
      $table->string('bundleTitle');
      $table->text('bundleDescription');
      $table->decimal('bundlePrice', 10, 2);
      $table->decimal('originalPrice', 10, 2);
      $table->string('bundleImage')->nullable();
      $table->boolean('isActive')->default(true);
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
    });
    Schema::create('bundleCourses', function (Blueprint $table) {
      $table->id('bundleCourseId');
      $table->unsignedBigInteger('bundleId');
      $table->unsignedBigInteger('courseId');
      $table->foreign('bundleId')->references('bundleId')->on('courseBundles')->onDelete('cascade');
      $table->foreign('courseId')->references('courseId')->on('courses')->onDelete('cascade');
      $table->unique(['bundleId', 'courseId']);
    });
    Schema::table('lessons', function (Blueprint $table) {
      $table->boolean('isFreePreview')->default(false)->after('isMandatory');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('bundleCourses');
    Schema::dropIfExists('courseBundles');
    Schema::table('lessons', function (Blueprint $table) {
      $table->dropColumn('isFreePreview');
    });
  }
};