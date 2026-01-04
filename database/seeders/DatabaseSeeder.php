<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
class DatabaseSeeder extends Seeder
{
  public function run(): void
  {
    $now = now();
    User::create([
      'userName' => 'Admin', 'userEmail' => 'admin@lms.com', 'password' => Hash::make('password'), 'role' => 'admin', 'createdAt' => $now, 'updatedAt' => $now
    ]);
    for ($i = 1; $i <= 4; $i++) {
      User::create([
        'userName' => "Instructor $i",
        'userEmail' => "instructor$i@lms.com",
        'password' => Hash::make('password'),
        'role' => 'instructor',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    for ($i = 1; $i <= 4; $i++) {
      User::create([
        'userName' => "Learner $i",
        'userEmail' => "learner$i@lms.com",
        'password' => Hash::make('password'),
        'role' => 'learner',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    $categoryData = [
      ['categoryName' => 'Web Development', 'slug' => 'webDevelopment', 'icon' => 'code', 'description' => 'Learn Modern Web Development', 'createdAt' => $now, 'updatedAt' => $now],
      ['categoryName' => 'Data Science', 'slug' => 'dataScience', 'icon' => 'chart', 'description' => 'Master Data Analysis & ML', 'createdAt' => $now, 'updatedAt' => $now],
      ['categoryName' => 'Mobile Apps', 'slug' => 'mobileApps', 'icon' => 'smartphone', 'description' => 'Build Native Mobile Applications', 'createdAt' => $now, 'updatedAt' => $now],
    ];
    foreach ($categoryData as $data) {
      Category::create($data);
    }
    $coursesData = [
      ['title' => 'Docker Mastery: Zero To Hero', 'desc' => 'Master Docker Containers From Scratch To Production.', 'cat' => 'mobileApps'],
      ['title' => 'Kubernetes For Beginners', 'desc' => 'Orchestrate Containerized Applications With Kubernetes.', 'cat' => 'mobileApps'],
      ['title' => 'Jenkins CI/CD Pipelines', 'desc' => 'Automate Software Delivery With Jenkins Pipelines.', 'cat' => 'webDevelopment'],
      ['title' => 'DevOps With AWS', 'desc' => 'Implement DevOps Practices On Amazon Web Services.', 'cat' => 'webDevelopment'],
      ['title' => 'Terraform Infrastructure As Code', 'desc' => 'Provision And Manage Infrastructure With Terraform.', 'cat' => 'dataScience'],
      ['title' => 'Ansible Configuration Management', 'desc' => 'Automate IT Configuration With Ansible Playbooks.', 'cat' => 'dataScience'],
      ['title' => 'Git Version Control Mastery', 'desc' => 'Master Git Branching, Merging, And Collaboration.', 'cat' => 'webDevelopment'],
      ['title' => 'Python For Automations', 'desc' => 'Automate Boring Tasks With Python Scripting.', 'cat' => 'dataScience'],
      ['title' => 'Go Language Fundamentals', 'desc' => 'Build Efficient Software With Go Programming Language.', 'cat' => 'webDevelopment'],
      ['title' => 'React JS Modern Web Development', 'desc' => 'Build Dynamic User Interfaces With React JS.', 'cat' => 'webDevelopment'],
      ['title' => 'Vue JS Progressive Framework', 'desc' => 'Develop Modern Web Apps With Vue JS Framework.', 'cat' => 'webDevelopment'],
      ['title' => 'Linux Server Administration', 'desc' => 'Administer Linux Servers Like A Professional.', 'cat' => 'mobileApps'],
      ['title' => 'Nginx Web Server Deep Dive', 'desc' => 'Configure Nginx As A Web Server And Reverse Proxy.', 'cat' => 'webDevelopment'],
      ['title' => 'Prometheus Monitoring', 'desc' => 'Monitor Systems And Applications With Prometheus.', 'cat' => 'dataScience'],
      ['title' => 'Grafana Visualization', 'desc' => 'Visualize Metrics And Logs With Grafana Dashboards.', 'cat' => 'dataScience'],
      ['title' => 'Elasticsearch Log Analysis', 'desc' => 'Search And Analyze Data With Elasticsearch.', 'cat' => 'dataScience']
    ];
    $categories = Category::all()->pluck('categoryId', 'slug');
    $instructors = User::where('role', 'instructor')->pluck('userId');
    $courseIndex = 0;
    foreach ($instructors as $instructorId) {
      for ($i = 0; $i < 4; $i++) {
        if ($courseIndex >= count($coursesData)) break;
        $courseData = $coursesData[$courseIndex];
        $course = Course::create([
          'courseTitle' => $courseData['title'],
          'courseDescription' => $courseData['desc'],
          'simulatedPrice' => rand(19, 99) + 0.99,
          'instructorId' => $instructorId,
          'categoryId' => $categories[$courseData['cat']] ?? $categories->first(),
          'courseImage' => null,
          'courseMeta' => [
            'whatYouLearn' => [
              'Master Core Concepts & Practical Applications',
              'Build Real-World Projects From Scratch',
              'Develop Professional Skills For Career Growth',
              'Get Hands-On Experience With Industry Tools'
            ]
          ],
          'isPublished' => true,
          'averageRating' => 0,
          'totalEnrollments' => 0,
        ]);
        $modules = [
          ['title' => 'Core Fundamentals', 'desc' => 'The Essential Concepts For This Topic.'],
          ['title' => 'Advanced Implementation', 'desc' => 'Applying Concepts In Real World Scenarios.']
        ];
        $lessons = [
          ['title' => 'Getting Started', 'content' => 'Introduction To The Core Concepts.'],
          ['title' => 'Deep Dive Analysis', 'content' => 'Detailed Explanation Of The Features.']
        ];
        foreach ($modules as $mIndex => $mData) {
          $module = Module::create([
            'courseId' => $course->courseId,
            'moduleTitle' => $mData['title'],
            'moduleDescription' => $mData['desc'],
            'orderIndex' => $mIndex + 1,
            'durationMinutes' => 2,
          ]);
          foreach ($lessons as $lIndex => $lData) {
            Lesson::create([
              'moduleId' => $module->moduleId,
              'lessonTitle' => $lData['title'],
              'contentType' => 'text',
              'contentData' => ['html' => $lData['content']],
              'orderIndex' => $lIndex + 1,
              'durationMinutes' => 1,
              'isMandatory' => true,
            ]);
          }
        }
        $courseIndex++;
      }
    }
  }
}