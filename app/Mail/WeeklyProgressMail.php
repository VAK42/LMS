<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
class WeeklyProgressMail extends Mailable
{
  use Queueable, SerializesModels;
  public $user;
  public $progressData;
  public function __construct($user, $progressData)
  {
    $this->user = $user;
    $this->progressData = $progressData;
  }
  public function build()
  {
    return $this->subject('Your Weekly Learning Progress')
      ->view('emails.weeklyProgress');
  }
}