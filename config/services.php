<?php
return [
  'github' => [
    'client_id' => env('githubClientId'),
    'client_secret' => env('githubClientSecret'),
    'redirect' => env('githubRedirectUri'),
  ],
  'google' => [
    'client_id' => env('googleClientId'),
    'client_secret' => env('googleClientSecret'),
    'redirect' => env('googleRedirectUri'),
  ],
];