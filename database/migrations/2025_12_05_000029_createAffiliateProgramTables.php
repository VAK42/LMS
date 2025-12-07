<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('affiliates', function (Blueprint $table) {
      $table->id('affiliateId');
      $table->unsignedBigInteger('userId');
      $table->string('affiliateCode')->unique();
      $table->decimal('commissionRate', 5, 2)->default(10.00);
      $table->decimal('totalEarnings', 10, 2)->default(0);
      $table->decimal('pendingEarnings', 10, 2)->default(0);
      $table->integer('totalReferrals')->default(0);
      $table->boolean('isActive')->default(true);
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
    });
    Schema::create('affiliateReferrals', function (Blueprint $table) {
      $table->id('referralId');
      $table->unsignedBigInteger('affiliateId');
      $table->unsignedBigInteger('referredUserId');
      $table->unsignedBigInteger('enrollmentId')->nullable();
      $table->decimal('commissionAmount', 10, 2)->default(0);
      $table->enum('commissionStatus', ['pending', 'approved', 'paid'])->default('pending');
      $table->timestamp('convertedAt')->nullable();
      $table->timestamp('paidAt')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->foreign('affiliateId')->references('affiliateId')->on('affiliates')->onDelete('cascade');
      $table->foreign('referredUserId')->references('userId')->on('users')->onDelete('cascade');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('affiliateReferrals');
    Schema::dropIfExists('affiliates');
  }
};