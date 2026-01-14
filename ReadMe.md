```bash
composer install
npm install
php artisan migrate:fresh --seed
php artisan key:generate
New-Item -ItemType Directory -Force -Path "storage\framework\cache\data", "storage\framework\sessions", "storage\framework\views", "storage\framework\testing", "storage\app\public", "storage\debugbar"
php artisan storage:link
composer run dev

php artisan config:clear
```