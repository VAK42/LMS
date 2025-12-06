<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\PaymentTransaction;
use App\Models\Progress;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\DiscussionThread;
use App\Models\DiscussionPost;
use App\Models\Notification;
use App\Models\Certificate;
use App\Models\ActivityLog;
use App\Models\Bookmark;
use App\Models\Wishlist;
use App\Models\CourseReview;
use App\Models\Badge;
use App\Models\UserPoint;
use App\Models\Leaderboard;
use App\Models\Coupon;
use App\Models\LessonNote;
use App\Models\CourseBundle;
use App\Models\CourseEvent;
use App\Models\GiftCode;
use App\Models\PeerReview;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
  public function run(): void
  {
    $admin = User::create(['userName' => 'Admin', 'userEmail' => 'admin@lms.com', 'password' => Hash::make('password'), 'role' => 'Admin']);
    $instructors = [];
    for ($i = 1; $i <= 10; $i++) {
      $instructors[] = User::create(['userName' => "Instructor $i", 'userEmail' => "instructor$i@lms.com", 'password' => Hash::make('password'), 'role' => 'Instructor']);
    }
    $learners = [];
    for ($i = 1; $i <= 20; $i++) {
      $learners[] = User::create(['userName' => "Learner $i", 'userEmail' => "learner$i@lms.com", 'password' => Hash::make('password'), 'role' => 'Learner']);
    }
    $categories = [];
    $categoryData = [
      ['categoryName' => 'Web Development', 'slug' => 'webDevelopment', 'icon' => 'code', 'description' => 'Learn Modern Web Development'],
      ['categoryName' => 'Data Science', 'slug' => 'dataScience', 'icon' => 'chart', 'description' => 'Master Data Analysis & ML'],
      ['categoryName' => 'Mobile Apps', 'slug' => 'mobileApps', 'icon' => 'smartphone', 'description' => 'Build Native Mobile Applications'],
      ['categoryName' => 'Cloud Computing', 'slug' => 'cloudComputing', 'icon' => 'cloud', 'description' => 'AWS, Azure, GCP Mastery'],
      ['categoryName' => 'Cybersecurity', 'slug' => 'cybersecurity', 'icon' => 'shield', 'description' => 'Protect Systems & Data'],
      ['categoryName' => 'DevOps', 'slug' => 'devOps', 'icon' => 'server', 'description' => 'CI/CD & Infrastructure'],
      ['categoryName' => 'UI/UX Design', 'slug' => 'uiUxDesign', 'icon' => 'palette', 'description' => 'Design Beautiful Interfaces'],
      ['categoryName' => 'Blockchain', 'slug' => 'blockchain', 'icon' => 'link', 'description' => 'Decentralized Applications'],
      ['categoryName' => 'Game Development', 'slug' => 'gameDevelopment', 'icon' => 'gamepad', 'description' => 'Create Engaging Games'],
      ['categoryName' => 'AI & ML', 'slug' => 'aiMl', 'icon' => 'brain', 'description' => 'Artificial Intelligence'],
    ];
    foreach ($categoryData as $data) {
      $categories[] = Category::create($data);
    }
    $courses = [];
    for ($i = 1; $i <= 15; $i++) {
      $instructor = $instructors[array_rand($instructors)];
      $category = $categories[array_rand($categories)];
      $courses[] = Course::create([
        'courseTitle' => "Advanced Course $i",
        'courseDescription' => "Complete Guide To Mastering Topic $i With Hands-On Projects",
        'simulatedPrice' => rand(0, 1) == 0 ? 0 : rand(29, 199),
        'instructorId' => $instructor->userId,
        'categoryId' => $category->categoryId,
        'courseMeta' => json_encode(['level' => ['Beginner', 'Intermediate', 'Advanced'][rand(0, 2)], 'language' => 'English']),
        'isPublished' => true,
        'averageRating' => rand(40, 50) / 10,
        'totalEnrollments' => rand(100, 5000),
      ]);
    }
    foreach ($courses as $course) {
      for ($m = 1; $m <= 5; $m++) {
        $module = Module::create([
          'courseId' => $course->courseId,
          'moduleTitle' => "Module $m: Fundamentals",
          'moduleDescription' => "Learn Core Concepts In Module $m",
          'orderIndex' => $m,
          'durationMinutes' => rand(30, 120),
        ]);
        for ($l = 1; $l <= 10; $l++) {
          Lesson::create([
            'moduleId' => $module->moduleId,
            'lessonTitle' => "Lesson $l: Introduction",
            'contentType' => ['Text', 'Video', 'PDF'][rand(0, 2)],
            'contentData' => json_encode(['content' => "Lesson Content For Lesson $l", 'url' => "https://example.com/lesson$l"]),
            'orderIndex' => $l,
            'durationMinutes' => rand(5, 30),
            'isMandatory' => rand(0, 1) == 1,
          ]);
        }
      }
    }
    foreach ($learners as $index => $learner) {
      $coursesToEnroll = array_rand(array_flip(range(0, count($courses) - 1)), min(rand(1, 5), count($courses)));
      foreach ((array)$coursesToEnroll as $courseIndex) {
        $course = $courses[$courseIndex];
        Enrollment::create([
          'userId' => $learner->userId,
          'courseId' => $course->courseId,
          'enrollmentDate' => now()->subDays(rand(1, 30)),
          'isPaid' => $course->simulatedPrice > 0,
          'completionPercent' => rand(0, 100),
          'completedAt' => rand(0, 1) == 1 ? now()->subDays(rand(1, 10)) : null,
        ]);
        if ($course->simulatedPrice > 0) {
          PaymentTransaction::create([
            'userId' => $learner->userId,
            'courseId' => $course->courseId,
            'amount' => $course->simulatedPrice,
            'transactionStatus' => ['Pending', 'Completed'][rand(0, 1)],
            'paymentMethod' => 'VietQR',
            'transactionMeta' => json_encode(['bank' => 'VietQR', 'ref' => 'TXN' . rand(100000, 999999)]),
          ]);
        }
      }
    }
    foreach ($courses as $course) {
      $modules = Module::where('courseId', $course->courseId)->get();
      foreach ($modules as $module) {
        $lessons = Lesson::where('moduleId', $module->moduleId)->get();
        foreach ($lessons as $lesson) {
          if (rand(0, 2) == 0) {
            $assessment = Assessment::create([
              'lessonId' => $lesson->lessonId,
              'assessmentTitle' => "Quiz For {$lesson->lessonTitle}",
              'assessmentType' => ['Quiz', 'Assignment'][rand(0, 1)],
              'questionData' => json_encode([['question' => 'Sample Question?', 'options' => ['A', 'B', 'C', 'D'], 'correct' => 'A']]),
              'passingScore' => 70,
              'timeLimit' => rand(10, 60),
              'maxAttempts' => 3,
            ]);
            foreach (array_slice($learners, 0, rand(5, 10)) as $learner) {
              AssessmentSubmission::create([
                'assessmentId' => $assessment->assessmentId,
                'userId' => $learner->userId,
                'answerData' => json_encode([['answer' => ['A', 'B', 'C', 'D'][rand(0, 3)]]]),
                'score' => rand(0, 100),
                'attemptNumber' => 1,
                'isPassed' => rand(0, 1) == 1,
                'submittedAt' => now()->subDays(rand(1, 15)),
              ]);
            }
          }
        }
      }
    }
    foreach ($courses as $course) {
      for ($t = 1; $t <= 10; $t++) {
        $learner = $learners[array_rand($learners)];
        $thread = DiscussionThread::create([
          'courseId' => $course->courseId,
          'userId' => $learner->userId,
          'threadTitle' => "Discussion Topic $t",
          'threadContent' => "I Have A Question About This Course Topic $t",
          'isPinned' => rand(0, 5) == 0,
          'viewCount' => rand(10, 500),
        ]);
        for ($p = 1; $p <= rand(5, 15); $p++) {
          DiscussionPost::create([
            'threadId' => $thread->threadId,
            'userId' => $learners[array_rand($learners)]->userId,
            'postContent' => "This Is A Reply To The Discussion Post $p",
            'isAcceptedAnswer' => $p == 1 && rand(0, 1) == 1,
            'likeCount' => rand(0, 50),
          ]);
        }
      }
    }
    foreach ($learners as $learner) {
      for ($n = 1; $n <= 10; $n++) {
        Notification::create([
          'userId' => $learner->userId,
          'notificationType' => ['CourseUpdate', 'NewMessage', 'Deadline', 'Achievement'][rand(0, 3)],
          'notificationTitle' => "Notification $n",
          'notificationContent' => "You Have A New Notification About Your Course Progress",
          'notificationData' => json_encode(['action' => 'viewCourse', 'courseId' => $courses[array_rand($courses)]->courseId]),
          'isRead' => rand(0, 1) == 1,
          'readAt' => rand(0, 1) == 1 ? now()->subDays(rand(1, 5)) : null,
        ]);
      }
    }
    foreach ($learners as $index => $learner) {
      if ($index < 10) {
        $course = $courses[array_rand($courses)];
        Certificate::create([
          'userId' => $learner->userId,
          'courseId' => $course->courseId,
          'uniqueCode' => 'CERT-' . strtoupper(substr(md5(rand()), 0, 12)),
          'pdfPath' => "/certificates/{$learner->userId}{$course->courseId}.pdf",
          'issuedAt' => now()->subDays(rand(1, 30)),
        ]);
      }
    }
    foreach (array_merge([$admin], $instructors, $learners) as $user) {
      for ($a = 1; $a <= 15; $a++) {
        ActivityLog::create([
          'userId' => $user->userId,
          'actionType' => ['Login', 'CourseView', 'LessonComplete', 'QuizSubmit'][rand(0, 3)],
          'resourceType' => ['Course', 'Lesson', 'Assessment'][rand(0, 2)],
          'resourceId' => rand(1, 100),
          'actionMetadata' => json_encode(['timestamp' => now(), 'details' => 'Action Performed']),
          'ipAddress' => '127.0.0.1',
          'userAgent' => 'Mozilla/5.0',
        ]);
      }
    }
    foreach ($learners as $learner) {
      $lessons = Lesson::inRandomOrder()->limit(10)->get();
      foreach ($lessons as $lesson) {
        Bookmark::create([
          'userId' => $learner->userId,
          'lessonId' => $lesson->lessonId,
          'note' => (rand(0, 1) == 1) ? "Bookmarked At Minute " . rand(1, 60) : null,
          'videoTimestamp' => (rand(0, 1) == 1) ? rand(0, 3600) : null,
        ]);
      }
    }
    foreach ($learners as $learner) {
      $wishlistCourses = Course::inRandomOrder()->limit(10)->get();
      foreach ($wishlistCourses as $course) {
        Wishlist::create([
          'userId' => $learner->userId,
          'courseId' => $course->courseId,
        ]);
      }
    }
    foreach ($courses as $course) {
      for ($r = 1; $r <= 10; $r++) {
        CourseReview::create([
          'courseId' => $course->courseId,
          'userId' => $learners[array_rand($learners)]->userId,
          'rating' => rand(3, 5),
          'reviewText' => "This Course Was Excellent! I Learned So Much About The Topic!",
          'isVerifiedPurchase' => rand(0, 1) == 1,
        ]);
      }
    }
    $badges = [];
    for ($b = 1; $b <= 10; $b++) {
      $badges[] = Badge::create([
        'badgeName' => "Achievement Badge $b",
        'badgeDescription' => "Earned For Completing $b Courses",
        'badgeIcon' => "trophy-$b",
        'requiredPoints' => $b * 100,
      ]);
    }
    foreach ($learners as $learner) {
      UserPoint::create([
        'userId' => $learner->userId,
        'totalPoints' => rand(100, 5000),
        'currentStreak' => rand(0, 30),
        'longestStreak' => rand(0, 60),
      ]);
      foreach (array_slice($badges, 0, rand(1, 5)) as $badge) {
        \DB::table('userBadges')->insert([
          'userId' => $learner->userId,
          'badgeId' => $badge->badgeId,
          'earnedAt' => now()->subDays(rand(1, 30)),
        ]);
      }
    }
    for ($l = 1; $l <= 10; $l++) {
      Leaderboard::create([
        'userId' => $learners[array_rand($learners)]->userId,
        'totalPoints' => rand(1000, 10000),
        'rank' => $l,
        'achievements' => json_encode(['completedCourses' => rand(5, 50)]),
      ]);
    }
    for ($c = 1; $c <= 10; $c++) {
      Coupon::create([
        'couponCode' => 'SAVE' . rand(10, 99),
        'discountType' => ['Percentage', 'Fixed'][rand(0, 1)],
        'discountValue' => rand(10, 50),
        'maxUses' => rand(50, 500),
        'currentUses' => rand(0, 50),
        'expiresAt' => now()->addDays(rand(30, 90)),
      ]);
    }
    foreach ($learners as $learner) {
      $lessons = Lesson::inRandomOrder()->limit(10)->get();
      foreach ($lessons as $lesson) {
        LessonNote::create([
          'userId' => $learner->userId,
          'lessonId' => $lesson->lessonId,
          'noteContent' => "Important Note About This Lesson Topic",
          'videoTimestamp' => rand(100, 3600),
        ]);
      }
    }
    for ($b = 1; $b <= 10; $b++) {
      CourseBundle::create([
        'bundleTitle' => "Course Bundle $b",
        'bundleDescription' => "Complete Package Of Related Courses",
        'bundlePrice' => rand(99, 499),
        'originalPrice' => rand(600, 900),
        'isActive' => true,
      ]);
    }
    foreach (array_slice($learners, 0, 5) as $learner) {
      $ticket = \App\Models\SupportTicket::create([
        'userId' => $learner->userId,
        'subject' => 'Need Help With Course Content',
        'message' => 'I Have A Question About Module 3 In My Course',
        'status' => ['Open', 'InProgress', 'Resolved'][rand(0, 2)],
        'priority' => ['Low', 'Medium', 'High'][rand(0, 2)],
      ]);
      \App\Models\TicketReply::create([
        'ticketId' => $ticket->ticketId,
        'userId' => $admin->userId,
        'message' => 'Thank You For Reaching Out. Our Team Is Looking Into This.',
        'isStaffReply' => true,
      ]);
    }
    foreach (array_slice($instructors, 0, 3) as $instructor) {
      \App\Models\Affiliate::create([
        'userId' => $instructor->userId,
        'affiliateCode' => strtoupper(substr(md5(rand()), 0, 8)),
        'commissionRate' => 10.00,
      ]);
    }
    foreach (array_slice($learners, 0, 3) as $index => $learner) {
      \App\Models\OauthProvider::create([
        'userId' => $learner->userId,
        'provider' => ['Google', 'Github'][rand(0, 1)],
        'providerId' => 'oauth_' . $learner->userId . '_' . rand(1000, 9999),
        'accessToken' => bin2hex(random_bytes(32)),
      ]);
    }
  }
}