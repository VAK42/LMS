<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('coupons', function (Blueprint $table) {
      $table->id('couponId');
      $table->string('couponCode')->unique();
      $table->enum('discountType', ['percentage', 'fixed'])->default('percentage');
      $table->decimal('discountValue', 10, 2);
      $table->decimal('minPurchase', 10, 2)->default(0);
      $table->integer('usageLimit')->nullable();
      $table->integer('usageCount')->default(0);
      $table->timestamp('validFrom')->nullable();
      $table->timestamp('validUntil')->nullable();
      $table->boolean('isActive')->default(true);
      $table->unsignedBigInteger('courseId')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('courseId')->references('courseId')->on('courses')->onDelete('cascade');
      $table->index(['isActive', 'validUntil']);
    });
    Schema::create('couponUsages', function (Blueprint $table) {
      $table->id('usageId');
      $table->unsignedBigInteger('couponId');
      $table->unsignedBigInteger('userId');
      $table->unsignedBigInteger('enrollmentId');
      $table->decimal('discountAmount', 10, 2);
      $table->timestamp('usedAt')->useCurrent();
      $table->foreign('couponId')->references('couponId')->on('coupons')->onDelete('cascade');
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->index(['couponId', 'userId']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('couponUsages');
    Schema::dropIfExists('coupons');
  }
};