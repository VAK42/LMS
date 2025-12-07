<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::table('paymentTransactions', function (Blueprint $table) {
      $table->boolean('isRefunded')->default(false)->after('transactionStatus');
      $table->decimal('refundAmount', 10, 2)->nullable()->after('isRefunded');
      $table->timestamp('refundedAt')->nullable()->after('refundAmount');
      $table->text('adminNotes')->nullable()->after('refundedAt');
    });
  }
  public function down(): void
  {
    Schema::table('paymentTransactions', function (Blueprint $table) {
      $table->dropColumn(['isRefunded', 'refundAmount', 'refundedAt', 'adminNotes']);
    });
  }
};