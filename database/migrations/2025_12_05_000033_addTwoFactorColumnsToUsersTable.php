<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->text('twoFactorSecret')->after('password')->nullable();
      $table->text('twoFactorRecoveryCodes')->after('twoFactorSecret')->nullable();
      $table->timestamp('twoFactorConfirmedAt')->after('twoFactorRecoveryCodes')->nullable();
    });
  }
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['twoFactorSecret', 'twoFactorRecoveryCodes', 'twoFactorConfirmedAt']);
    });
  }
};