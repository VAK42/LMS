<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('userPoints', function (Blueprint $table) {
      $table->id('pointId');
      $table->unsignedBigInteger('userId');
      $table->integer('totalPoints')->default(0);
      $table->integer('currentStreak')->default(0);
      $table->integer('longestStreak')->default(0);
      $table->date('lastActivityDate')->nullable();
      $table->integer('level')->default(1);
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->unique('userId');
    });
    Schema::create('badges', function (Blueprint $table) {
      $table->id('badgeId');
      $table->string('badgeName');
      $table->text('badgeDescription');
      $table->string('badgeIcon');
      $table->integer('requiredPoints')->default(0);
      $table->timestamp('createdAt')->useCurrent();
    });
    Schema::create('userBadges', function (Blueprint $table) {
      $table->id('userBadgeId');
      $table->unsignedBigInteger('userId');
      $table->unsignedBigInteger('badgeId');
      $table->timestamp('earnedAt')->useCurrent();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->foreign('badgeId')->references('badgeId')->on('badges')->onDelete('cascade');
      $table->unique(['userId', 'badgeId']);
    });
    Schema::create('pointTransactions', function (Blueprint $table) {
      $table->id('transactionId');
      $table->unsignedBigInteger('userId');
      $table->integer('points');
      $table->string('reason');
      $table->unsignedBigInteger('relatedId')->nullable();
      $table->string('relatedType')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->index(['userId', 'createdAt']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('pointTransactions');
    Schema::dropIfExists('userBadges');
    Schema::dropIfExists('badges');
    Schema::dropIfExists('userPoints');
  }
};