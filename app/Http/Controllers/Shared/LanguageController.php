<?php
namespace App\Http\Controllers\Shared;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
class LanguageController extends Controller
{
  public function update(Request $request)
  {
    $request->validate(['locale' => 'required|string|in:en,es,fr,de,vn,kr,jp,zh,ru,it']);
    Session::put('locale', $request->locale);
    App::setLocale($request->locale);
    return back();
  }
}