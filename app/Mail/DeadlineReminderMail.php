<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
class DeadlineReminderMail extends Mailable
{
  use Queueable, SerializesModels;
  public $assessment;
  public function __construct($assessment)
  {
    $this->assessment = $assessment;
  }
  public function build()
  {
    return $this->subject('Assessment Deadline Reminder')
      ->view('emails.deadline-reminder');
  }
}