<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('oauthProviders', function (Blueprint $table) {
      $table->id('oauthId');
      $table->unsignedBigInteger('userId');
      $table->string('provider');
      $table->string('providerId');
      $table->text('accessToken')->nullable();
      $table->text('refreshToken')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
      $table->unique(['provider', 'providerId']);
      $table->index('userId');
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('oauthProviders');
  }
};