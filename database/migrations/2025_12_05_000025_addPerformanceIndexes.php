<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::table('courses', function (Blueprint $table) {
      $table->index('isPublished');
      $table->index(['isPublished', 'categoryId']);
    });
    Schema::table('enrollments', function (Blueprint $table) {
      $table->index('isPaid');
      $table->index(['userId', 'isPaid']);
    });
    Schema::table('progress', function (Blueprint $table) {
      $table->index('isCompleted');
      $table->index(['userId', 'isCompleted']);
    });
    Schema::table('notifications', function (Blueprint $table) {
      $table->index('isRead');
      $table->index(['userId', 'isRead']);
    });
    Schema::table('paymentTransactions', function (Blueprint $table) {
      $table->index('transactionStatus');
    });
    Schema::table('courseReviews', function (Blueprint $table) {
      $table->index(['courseId', 'rating']);
    });
    Schema::table('userPoints', function (Blueprint $table) {
      $table->index('totalPoints');
      $table->index('level');
    });
  }
  public function down(): void
  {
    Schema::table('courses', function (Blueprint $table) {
      $table->dropIndex(['isPublished']);
      $table->dropIndex(['isPublished', 'categoryId']);
    });
    Schema::table('enrollments', function (Blueprint $table) {
      $table->dropIndex(['isPaid']);
      $table->dropIndex(['userId', 'isPaid']);
    });
    Schema::table('progress', function (Blueprint $table) {
      $table->dropIndex(['isCompleted']);
      $table->dropIndex(['userId', 'isCompleted']);
    });
    Schema::table('notifications', function (Blueprint $table) {
      $table->dropIndex(['isRead']);
      $table->dropIndex(['userId', 'isRead']);
    });
    Schema::table('paymentTransactions', function (Blueprint $table) {
      $table->dropIndex(['transactionStatus']);
    });
    Schema::table('courseReviews', function (Blueprint $table) {
      $table->dropIndex(['courseId', 'rating']);
    });
    Schema::table('userPoints', function (Blueprint $table) {
      $table->dropIndex(['totalPoints']);
      $table->dropIndex(['level']);
    });
  }
};