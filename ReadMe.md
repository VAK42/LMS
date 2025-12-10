```bash
composer install
npm install
php artisan key:generate
php artisan migrate
php artisan db:seed
New-Item -ItemType Directory -Force -Path "storage\framework\cache\data", "storage\framework\sessions", "storage\framework\views", "storage\framework\testing", "storage\app\public", "storage\debugbar"
composer require laravel/sanctum
composer require bacon/bacon-qr-code
composer require pragmarx/google2fa-laravel
composer run runDev

php artisan config:clear
php artisan migrate:fresh --seed
```
