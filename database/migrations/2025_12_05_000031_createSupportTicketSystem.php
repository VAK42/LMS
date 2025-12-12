<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('supportTickets', function (Blueprint $table) {
      $table->id('ticketId');
      $table->unsignedBigInteger('userId');
      $table->string('subject');
      $table->text('message');
      $table->enum('status', ['open', 'inProgress', 'resolved', 'closed'])->default('open');
      $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
      $table->unsignedBigInteger('assignedTo')->nullable();
      $table->timestamp('resolvedAt')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->foreign('assignedTo')->references('userId')->on('users')->onDelete('set null');
      $table->index(['userId', 'status']);
    });
    Schema::create('ticketReplies', function (Blueprint $table) {
      $table->id('replyId');
      $table->unsignedBigInteger('ticketId');
      $table->unsignedBigInteger('userId');
      $table->text('message');
      $table->boolean('isStaffReply')->default(false);
      $table->timestamp('createdAt')->useCurrent();
      $table->foreign('ticketId')->references('ticketId')->on('supportTickets')->onDelete('cascade');
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('ticketReplies');
    Schema::dropIfExists('supportTickets');
  }
};