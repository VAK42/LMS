<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
class DatabaseSeeder extends Seeder
{
  public function run(): void
  {
    $now = now();
    DB::table('users')->insert([
      ['userName' => 'Admin', 'userEmail' => 'admin@lms.com', 'password' => Hash::make('password'), 'role' => 'admin', 'createdAt' => $now, 'updatedAt' => $now],
    ]);
    for ($i = 1; $i <= 5; $i++) {
      DB::table('users')->insert([
        'userName' => "Instructor $i",
        'userEmail' => "instructor$i@lms.com",
        'password' => Hash::make('password'),
        'role' => 'instructor',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    for ($i = 1; $i <= 10; $i++) {
      DB::table('users')->insert([
        'userName' => "Learner $i",
        'userEmail' => "learner$i@lms.com",
        'password' => Hash::make('password'),
        'role' => 'learner',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    $users = DB::table('users')->get();
    $admin = $users->where('role', 'admin')->first();
    $instructors = $users->where('role', 'instructor');
    $learners = $users->where('role', 'learner');
    $categoryData = [
      ['categoryName' => 'Web Development', 'slug' => 'webDevelopment', 'icon' => 'code', 'description' => 'Learn Modern Web Development', 'createdAt' => $now, 'updatedAt' => $now],
      ['categoryName' => 'Data Science', 'slug' => 'dataScience', 'icon' => 'chart', 'description' => 'Master Data Analysis & ML', 'createdAt' => $now, 'updatedAt' => $now],
      ['categoryName' => 'Mobile Apps', 'slug' => 'mobileApps', 'icon' => 'smartphone', 'description' => 'Build Native Mobile Applications', 'createdAt' => $now, 'updatedAt' => $now],
    ];
    foreach ($categoryData as $data) {
      DB::table('categories')->insert($data);
    }
    $categories = DB::table('categories')->get();
    foreach ($instructors as $instructor) {
      for ($i = 1; $i <= 2; $i++) {
        $category = $categories->random();
        DB::table('courses')->insert([
          'courseTitle' => "Course By {$instructor->userName} Part $i",
          'courseDescription' => "Complete Guide To Mastering Advanced Topics",
          'simulatedPrice' => rand(0, 1) == 0 ? 0 : rand(29, 99),
          'instructorId' => $instructor->userId,
          'categoryId' => $category->categoryId,
          'courseMeta' => json_encode([
            'level' => 'Intermediate',
            'language' => 'English',
            'whatYouLearn' => [
              'Master Core Concepts And Fundamentals',
              'Build Real-World Projects From Scratch',
              'Learn Industry Best Practices',
              'Get Hands-On Practical Experience'
            ]
          ]),
          'isPublished' => true,
          'totalEnrollments' => rand(50, 500),
          'createdAt' => $now,
          'updatedAt' => $now,
        ]);
      }
    }
    $courses = DB::table('courses')->get();
    foreach ($courses as $course) {
      for ($m = 1; $m <= 3; $m++) {
        DB::table('modules')->insert([
          'courseId' => $course->courseId,
          'moduleTitle' => "Module $m",
          'moduleDescription' => "Learn Core Concepts",
          'orderIndex' => $m,
          'durationMinutes' => rand(30, 60),
          'createdAt' => $now,
          'updatedAt' => $now,
        ]);
        $module = DB::table('modules')->where('courseId', $course->courseId)->where('orderIndex', $m)->first();
        for ($l = 1; $l <= 5; $l++) {
          DB::table('lessons')->insert([
            'moduleId' => $module->moduleId,
            'lessonTitle' => "Lesson $l",
            'contentType' => ['text', 'video', 'pdf'][rand(0, 2)],
            'contentData' => json_encode(['content' => "Lesson Content $l"]),
            'orderIndex' => $l,
            'durationMinutes' => rand(5, 20),
            'isMandatory' => true,
            'createdAt' => $now,
            'updatedAt' => $now,
          ]);
        }
      }
    }
    foreach ($learners as $learner) {
      $enrollCourses = $courses->random(min(3, $courses->count()));
      foreach ($enrollCourses as $course) {
        DB::table('enrollments')->insert([
          'userId' => $learner->userId,
          'courseId' => $course->courseId,
          'enrollmentDate' => now()->subDays(rand(1, 30)),
          'isPaid' => $course->simulatedPrice > 0,
          'completionPercent' => rand(0, 100),
          'completedAt' => rand(0, 1) ? now()->subDays(rand(1, 10)) : null,
          'createdAt' => $now,
          'updatedAt' => $now,
        ]);
        if ($course->simulatedPrice > 0) {
          DB::table('paymentTransactions')->insert([
            'userId' => $learner->userId,
            'courseId' => $course->courseId,
            'amount' => $course->simulatedPrice,
            'transactionStatus' => 'completed',
            'paymentMethod' => 'vietqr',
            'transactionMeta' => json_encode(['ref' => 'TXN' . rand(100000, 999999)]),
            'createdAt' => $now,
            'updatedAt' => $now,
          ]);
        }
      }
    }
    $lessons = DB::table('lessons')->inRandomOrder()->limit(10)->get();
    foreach ($lessons as $lesson) {
      DB::table('assessments')->insert([
        'lessonId' => $lesson->lessonId,
        'assessmentTitle' => "Quiz For {$lesson->lessonTitle}",
        'assessmentType' => 'quiz',
        'questionData' => json_encode([['question' => 'Sample Question?', 'options' => ['A', 'B', 'C', 'D'], 'correct' => 'A']]),
        'passingScore' => 70,
        'timeLimit' => 30,
        'maxAttempts' => 3,
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($courses->random(5) as $course) {
      $learner = $learners->random();
      DB::table('discussionThreads')->insert([
        'courseId' => $course->courseId,
        'userId' => $learner->userId,
        'threadTitle' => "Question About Course",
        'threadContent' => "Need Help Understanding This Concept",
        'isPinned' => false,
        'viewCount' => rand(10, 100),
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
      $thread = DB::table('discussionThreads')->orderBy('threadId', 'desc')->first();
      for ($p = 1; $p <= 3; $p++) {
        DB::table('discussionPosts')->insert([
          'threadId' => $thread->threadId,
          'userId' => $learners->random()->userId,
          'postContent' => "This Is A Reply To The Question",
          'isAcceptedAnswer' => $p == 1,
          'likeCount' => rand(0, 10),
          'createdAt' => $now,
          'updatedAt' => $now,
        ]);
      }
    }
    foreach ($learners as $learner) {
      for ($n = 1; $n <= 3; $n++) {
        DB::table('notifications')->insert([
          'userId' => $learner->userId,
          'notificationType' => 'courseUpdate',
          'notificationTitle' => "Notification $n",
          'notificationContent' => "You Have A New Notification",
          'isRead' => rand(0, 1),
          'createdAt' => $now,
          'updatedAt' => $now,
        ]);
      }
    }
    foreach ($learners->random(3) as $learner) {
      $course = $courses->random();
      DB::table('certificates')->insert([
        'userId' => $learner->userId,
        'courseId' => $course->courseId,
        'uniqueCode' => 'CERT-' . strtoupper(substr(md5(rand()), 0, 12)),
        'pdfPath' => "/certificates/{$learner->userId}-{$course->courseId}.pdf",
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($users->random(5) as $user) {
      DB::table('activityLogs')->insert([
        'userId' => $user->userId,
        'actionType' => 'login',
        'resourceType' => 'course',
        'resourceId' => 1,
        'ipAddress' => '127.0.0.1',
        'userAgent' => 'Mozilla/5.0',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($learners->random(3) as $learner) {
      $lesson = $lessons->random();
      DB::table('bookmarks')->insert([
        'userId' => $learner->userId,
        'lessonId' => $lesson->lessonId,
        'note' => "Important Section",
        'videoTimestamp' => rand(100, 300),
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($learners->random(3) as $learner) {
      $course = $courses->random();
      DB::table('wishlists')->insert([
        'userId' => $learner->userId,
        'courseId' => $course->courseId,
        'createdAt' => $now,
      ]);
    }
    foreach ($courses as $course) {
      $reviewCount = rand(2, 5);
      $reviewers = $learners->shuffle()->take($reviewCount);
      $totalRating = 0;
      foreach ($reviewers as $reviewer) {
        $rating = rand(3, 5);
        $totalRating += $rating;
        DB::table('courseReviews')->insert([
          'courseId' => $course->courseId,
          'userId' => $reviewer->userId,
          'rating' => $rating,
          'reviewText' => "Excellent Course!",
          'createdAt' => $now,
          'updatedAt' => $now,
        ]);
      }
      $averageRating = round($totalRating / $reviewCount);
      DB::table('courses')->where('courseId', $course->courseId)->update([
        'averageRating' => $averageRating
      ]);
    }
    for ($b = 1; $b <= 5; $b++) {
      DB::table('badges')->insert([
        'badgeName' => "Badge $b",
        'badgeDescription' => "Earned For Achievement",
        'badgeIcon' => "trophy-$b",
        'requiredPoints' => $b * 100,
        'createdAt' => $now,
      ]);
    }
    $badges = DB::table('badges')->get();
    foreach ($learners as $learner) {
      DB::table('userPoints')->insert([
        'userId' => $learner->userId,
        'totalPoints' => rand(100, 1000),
        'currentStreak' => rand(0, 10),
        'longestStreak' => rand(0, 20),
        'updatedAt' => $now,
      ]);
      foreach ($badges->random(2) as $badge) {
        DB::table('userBadges')->insert([
          'userId' => $learner->userId,
          'badgeId' => $badge->badgeId,
          'earnedAt' => now()->subDays(rand(1, 30)),
        ]);
      }
    }
    for ($c = 1; $c <= 3; $c++) {
      DB::table('coupons')->insert([
        'couponCode' => 'SAVE' . rand(10, 99),
        'discountType' => 'percentage',
        'discountValue' => rand(10, 30),
        'isActive' => true,
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($learners->random(3) as $learner) {
      $lesson = $lessons->random();
      DB::table('lessonNotes')->insert([
        'userId' => $learner->userId,
        'lessonId' => $lesson->lessonId,
        'noteContent' => "Important Note About This Lesson",
        'videoTimestamp' => rand(100, 500),
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    for ($b = 1; $b <= 2; $b++) {
      DB::table('courseBundles')->insert([
        'bundleTitle' => "Course Bundle $b",
        'bundleDescription' => "Complete Package Of Courses",
        'bundlePrice' => rand(99, 199),
        'originalPrice' => rand(200, 400),
        'isActive' => true,
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($learners->random(2) as $learner) {
      DB::table('supportTickets')->insert([
        'userId' => $learner->userId,
        'subject' => 'Need Help With Course',
        'message' => 'I Have A Question About The Content',
        'status' => 'open',
        'priority' => 'medium',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
      $ticket = DB::table('supportTickets')->orderBy('ticketId', 'desc')->first();
      DB::table('ticketReplies')->insert([
        'ticketId' => $ticket->ticketId,
        'userId' => $admin->userId,
        'message' => 'Thank You For Reaching Out We Will Help You',
        'isStaffReply' => true,
        'createdAt' => $now,
      ]);
    }
    foreach ($learners->random(2) as $learner) {
      DB::table('oauthProviders')->insert([
        'userId' => $learner->userId,
        'provider' => 'google',
        'providerId' => 'oauth_' . $learner->userId . '_' . rand(1000, 9999),
        'accessToken' => bin2hex(random_bytes(32)),
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    foreach ($instructors->random(2) as $instructor) {
      DB::table('affiliates')->insert([
        'userId' => $instructor->userId,
        'affiliateCode' => strtoupper(substr(md5(rand()), 0, 8)),
        'commissionRate' => 10.00,
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
  }
}