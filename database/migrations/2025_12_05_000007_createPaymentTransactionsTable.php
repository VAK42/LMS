<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('paymentTransactions', function (Blueprint $table) {
      $table->id('transactionId');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->foreignId('courseId')->constrained('courses', 'courseId')->onDelete('cascade');
      $table->decimal('amount', 10, 2);
      $table->string('qrCodePath')->nullable();
      $table->enum('transactionStatus', ['pending', 'completed', 'failed', 'cancelled', 'refunded'])->default('pending');
      $table->string('paymentMethod')->default('vietqr');
      $table->jsonb('transactionMeta')->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['userId', 'transactionStatus']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('paymentTransactions');
  }
};