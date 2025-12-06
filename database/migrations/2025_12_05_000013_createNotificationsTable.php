<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('notifications', function (Blueprint $table) {
      $table->id('notificationId');
      $table->foreignId('userId')->constrained('users', 'userId')->onDelete('cascade');
      $table->string('notificationType');
      $table->string('notificationTitle');
      $table->text('notificationContent');
      $table->jsonb('notificationData')->nullable();
      $table->boolean('isRead')->default(false);
      $table->timestamp('readAt')->nullable();
      $table->timestamp('createdAt')->nullable();
      $table->timestamp('updatedAt')->nullable();
      $table->index(['userId', 'isRead']);
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('notifications');
  }
};