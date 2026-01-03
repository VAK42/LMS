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
    for ($i = 1; $i <= 4; $i++) {
      DB::table('users')->insert([
        'userName' => "Instructor $i",
        'userEmail' => "instructor$i@lms.com",
        'password' => Hash::make('password'),
        'role' => 'instructor',
        'createdAt' => $now,
        'updatedAt' => $now,
      ]);
    }
    for ($i = 1; $i <= 4; $i++) {
      DB::table('users')->insert([
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
      DB::table('categories')->insert($data);
    }
  }
}