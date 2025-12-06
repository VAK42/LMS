<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('activityLogs', function (Blueprint $table) {
      $table->id('logId');
      $table->foreignId('userId')->nullable()->constrained('users', 'userId')->onDelete('set null');
      $table->string('actionType');
      $table->string('resourceType')->nullable();
      $table->unsignedBigInteger('resourceId')->nullable();
      $table->jsonb('actionMetadata')->nullable();
      $table->string('ipAddress', 45)->nullable();
      $table->string('userAgent')->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['userId', 'createdAt']);
      $table->index('actionType');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('activityLogs');
  }
};