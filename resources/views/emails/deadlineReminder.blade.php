<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .button { display: inline-block; padding: 15px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Deadline Reminder</h1>
    </div>
    <div class="content">
      <p>Hello {{ $userName }},</p>
      <div class="alert">
        <strong>{{ $assessment->assessmentTitle }}</strong> Is Due In <strong>{{ $daysLeft }} Day(s)</strong>!
      </div>
      <p>Don't Forget To Complete Your Assignment Before The Deadline!</p>
      <p style="text-align: center;">
        <a href="{{ config('app.url') }}/assessments/{{ $assessment->assessmentId }}" class="button">
          Complete Assignment
        </a>
      </p>
    </div>
  </div>
</body>
</html>