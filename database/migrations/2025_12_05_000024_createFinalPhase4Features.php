<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
  public function up(): void
  {
    Schema::create('giftCodes', function (Blueprint $table) {
      $table->id('giftCodeId');
      $table->string('giftCode')->unique();
      $table->unsignedBigInteger('courseId');
      $table->unsignedBigInteger('purchaserId');
      $table->string('recipientEmail')->nullable();
      $table->string('recipientName')->nullable();
      $table->text('giftMessage')->nullable();
      $table->boolean('isRedeemed')->default(false);
      $table->unsignedBigInteger('redeemedBy')->nullable();
      $table->timestamp('redeemedAt')->nullable();
      $table->timestamp('expiresAt')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->foreign('courseId')->references('courseId')->on('courses')->onDelete('cascade');
      $table->foreign('purchaserId')->references('userId')->on('users')->onDelete('cascade');
      $table->foreign('redeemedBy')->references('userId')->on('users')->onDelete('set null');
      $table->index(['giftCode', 'isRedeemed']);
    });
    Schema::create('peerReviews', function (Blueprint $table) {
      $table->id('peerReviewId');
      $table->unsignedBigInteger('submissionId');
      $table->unsignedBigInteger('reviewerId');
      $table->integer('score')->nullable();
      $table->text('feedback')->nullable();
      $table->jsonb('rubricScores')->nullable();
      $table->timestamp('completedAt')->nullable();
      $table->timestamp('createdAt')->useCurrent();
      $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
      $table->foreign('submissionId')->references('submissionId')->on('assessmentSubmissions')->onDelete('cascade');
      $table->foreign('reviewerId')->references('userId')->on('users')->onDelete('cascade');
      $table->unique(['submissionId', 'reviewerId']);
    });
    Schema::table('lessons', function (Blueprint $table) {
      $table->jsonb('resources')->nullable()->after('contentData');
      $table->jsonb('videoSettings')->nullable()->after('resources');
    });
  }
  public function down(): void
  {
    Schema::table('lessons', function (Blueprint $table) {
      $table->dropColumn(['resources', 'videoSettings']);
    });
    Schema::dropIfExists('peerReviews');
    Schema::dropIfExists('giftCodes');
  }
};