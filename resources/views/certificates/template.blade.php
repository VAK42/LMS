<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate Of Completion</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      text-align: center;
      padding: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .certificate {
      background: white;
      padding: 80px;
      border: 20px solid #667eea;
      border-radius: 20px;
    }
    .title {
      font-size: 48px;
      color: #667eea;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .subtitle {
      font-size: 24px;
      color: #666;
      margin-bottom: 40px;
    }
    .recipient {
      font-size: 36px;
      color: #333;
      margin: 40px 0;
      font-style: italic;
    }
    .course {
      font-size: 28px;
      color: #667eea;
      margin: 30px 0;
      font-weight: bold;
    }
    .date {
      font-size: 18px;
      color: #666;
      margin-top: 60px;
    }
    .code {
      font-size: 14px;
      color: #999;
      margin-top: 40px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="title">Certificate Of Completion</div>
    <div class="subtitle">This Certifies That</div>
    <div class="recipient">{{ $user->userName }}</div>
    <div class="subtitle">Has Successfully Completed</div>
    <div class="course">{{ $course->courseTitle }}</div>
    <div class="date">Issued On {{ $certificate->issuedAt->format('F j, Y') }}</div>
    <div class="code">Verification Code: {{ $certificate->uniqueCode }}</div>
  </div>
</body>
</html>