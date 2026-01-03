<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class SettingsController extends Controller
{
  public function uploadQr(Request $request)
  {
    $request->validate(['qr' => 'required|image|max:2048']);
    if ($request->hasFile('qr')) {
      $disk = Storage::disk('public');
      if ($disk->exists('adminQr.png')) {
        $disk->delete('adminQr.png');
      }
      $request->file('qr')->storeAs('', 'adminQr.png', 'public');
      return back()->with('success', 'QR Code Uploaded Successfully!');
    }
    return back()->with('error', 'Upload Failed!');
  }
}