<?php
return [
  'github' => [
    'client_id' => env('githubClientId'),
    'client_secret' => env('githubClientSecret'),
    'redirect' => env('githubRedirectUri', 'http://localhost:8000/auth/github/callback'),
  ],
  'google' => [
    'client_id' => env('googleClientId'),
    'client_secret' => env('googleClientSecret'),
    'redirect' => env('googleRedirectUri', 'http://localhost:8000/auth/google/callback'),
  ],
];