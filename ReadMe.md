```bash
composer install
npm install
php artisan key:generate
php artisan migrate
php artisan db:seed
New-Item -ItemType Directory -Force -Path "storage\framework\cache\data", "storage\framework\sessions", "storage\framework\views", "storage\framework\testing", "storage\app\public", "storage\debugbar"
php artisan storage:link
composer run runDev

php artisan config:clear
php artisan migrate:fresh --seed
```