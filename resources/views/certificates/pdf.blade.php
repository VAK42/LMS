<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate Of Completion</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      margin: 0;
      padding: 40px;
    }
    .certificate {
      border: 12px solid #000000;
      padding: 30px;
      position: relative;
    }
    .innerBorder {
      border: 2px solid #666666;
      padding: 50px 40px;
      text-align: center;
    }
    .title {
      font-size: 56px;
      font-weight: bold;
      margin: 20px 0 10px 0;
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 32px;
      margin: 0 0 40px 0;
      color: #333333;
      font-style: italic;
    }
    .divider {
      border-top: 1px solid #cccccc;
      margin: 30px auto;
      width: 80%;
    }
    .label {
      font-size: 20px;
      color: #666666;
      font-style: italic;
      margin: 30px 0 10px 0;
    }
    .recipient {
      font-size: 44px;
      font-weight: bold;
      margin: 20px 0;
      border-bottom: 3px solid #000000;
      display: inline-block;
      padding: 0 40px 10px 40px;
    }
    .achievementText {
      font-size: 20px;
      color: #444444;
      margin: 25px 0;
      line-height: 1.6;
    }
    .courseName {
      font-size: 38px;
      font-weight: bold;
      margin: 30px 0;
      color: #000000;
    }
    .signatures {
      margin-top: 60px;
      width: 100%;
    }
    .signatureRow {
      width: 100%;
      margin-top: 40px;
    }
    .signatureCell {
      display: inline-block;
      width: 45%;
      text-align: center;
      vertical-align: bottom;
    }
    .signatureLine {
      border-top: 2px solid #000000;
      width: 250px;
      margin: 0 auto 10px auto;
    }
    .signatureLabel {
      font-size: 14px;
      color: #666666;
      margin-bottom: 5px;
    }
    .signatureValue {
      font-size: 18px;
      font-weight: bold;
    }
    .certificateId {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #cccccc;
    }
    .idLabel {
      font-size: 11px;
      color: #999999;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .idValue {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      font-weight: bold;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="innerBorder">
      <div class="title">Certificate</div>
      <div class="subtitle">Of Completion</div>
      <div class="divider"></div>
      <div class="label">This Is To Certify That</div>
      <div class="recipient">{{ $userName }}</div>
      <div class="achievementText">
        Has Successfully Completed The Course
      </div>
      <div class="courseName">{{ $courseTitle }}</div>
      <div class="achievementText">
        & Has Demonstrated Excellent Understanding & Mastery Of The Subject Matter
      </div>
      <div class="divider"></div>
      <div class="signatures">
        <div class="signatureRow">
          <div class="signatureCell">
            <div class="signatureLine"></div>
            <div class="signatureLabel">Date</div>
            <div class="signatureValue">{{ $issuedDate }}</div>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div class="signatureCell">
            <div class="signatureLine"></div>
            <div class="signatureLabel">Instructor</div>
            <div class="signatureValue">{{ $instructorName }}</div>
          </div>
        </div>
      </div>
      <div class="certificateId">
        <div class="idLabel">Certificate ID</div>
        <div class="idValue">{{ $certificateCode }}</div>
      </div>
    </div>
  </div>
</body>
</html>