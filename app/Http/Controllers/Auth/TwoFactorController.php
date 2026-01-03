<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
class TwoFactorController extends Controller
{
  public function showChallenge()
  {
    return Inertia::render('Auth/TwoFactorChallenge');
  }
  public function enable(Request $request)
  {
    $user = $request->user();
    if ($user->twoFactorSecret && $user->twoFactorConfirmedAt) {
      return response()->json(['error' => '2FA Already Enabled!'], 400);
    }
    $google2fa = new Google2FA();
    $secret = $google2fa->generateSecretKey();
    $qrCodeUrl = $google2fa->getQRCodeUrl(
      config('app.name'),
      $user->userEmail,
      $secret
    );
    $renderer = new ImageRenderer(
      new RendererStyle(200),
      new SvgImageBackEnd()
    );
    $writer = new Writer($renderer);
    $qrCodeSvg = $writer->writeString($qrCodeUrl);
    $recoveryCodes = [];
    for ($i = 0; $i < 8; $i++) {
      $recoveryCodes[] = bin2hex(random_bytes(5));
    }
    $user->update([
      'twoFactorSecret' => encrypt($secret),
      'twoFactorRecoveryCodes' => encrypt(json_encode($recoveryCodes)),
    ]);
    return response()->json([
      'qrCode' => base64_encode($qrCodeSvg),
      'secret' => $secret,
      'recoveryCodes' => $recoveryCodes,
    ]);
  }
  public function confirm(Request $request)
  {
    $validated = $request->validate([
      'code' => 'required|string|size:6',
    ]);
    $user = $request->user();
    if (!$user->twoFactorSecret) {
      return response()->json(['error' => '2FA Not Enabled!'], 400);
    }
    $google2fa = new Google2FA();
    $secret = decrypt($user->twoFactorSecret);
    $valid = $google2fa->verifyKey($secret, $validated['code']);
    if (!$valid) {
      return response()->json(['error' => 'Invalid Code!'], 400);
    }
    $user->update([
      'twoFactorConfirmedAt' => now(),
    ]);
    return response()->json(['message' => '2FA Confirmed Successfully!']);
  }
  public function disable(Request $request)
  {
    $validated = $request->validate([
      'password' => 'required|string',
    ]);
    $user = $request->user();
    if (!Hash::check($validated['password'], $user->password)) {
      return response()->json(['error' => 'Invalid Password!'], 400);
    }
    $user->update([
      'twoFactorSecret' => null,
      'twoFactorRecoveryCodes' => null,
      'twoFactorConfirmedAt' => null,
    ]);
    return response()->json(['message' => '2FA Disabled Successfully!']);
  }
}