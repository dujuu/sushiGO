FROM php:8.3-cli

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev libonig-dev libxml2-dev default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

EXPOSE 10000

CMD sh -c "php artisan config:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"