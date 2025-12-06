<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-value { font-size: 32px; font-weight: bold; color: #3b82f6; }
    .stat-label { color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Weekly Progress</h1>
    </div>
    <div class="content">
      <p>Hello {{ $userName }},</p>
      <p>Here's A Summary Of Your Learning Progress This Week:</p>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">{{ $stats['lessonsCompleted'] }}</div>
          <div class="stat-label">Lessons Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ $stats['timeSpent'] }}h</div>
          <div class="stat-label">Time Spent</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ $stats['pointsEarned'] }}</div>
          <div class="stat-label">Points Earned</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ $stats['streak'] }}</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>
      <p>Keep Up The Great Work!</p>
    </div>
  </div>
</body>
</html>