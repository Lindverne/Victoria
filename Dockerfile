FROM php:8.2-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN a2enmod rewrite headers

COPY . /var/www/html/

RUN sed -i 's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#' \
    /etc/apache2/sites-available/000-default.conf


RUN printf '%s\n' \
    'Alias /api /var/www/html/api' \
    '<Directory /var/www/html/api>' \
    '    Options -Indexes +FollowSymLinks' \
    '    AllowOverride None' \
    '    Require all granted' \
    '</Directory>' \
    > /etc/apache2/conf-available/victoria-api.conf \
    && a2enconf victoria-api

RUN mkdir -p /var/www/html/sessions \
    && chown -R www-data:www-data /var/www/html/sessions \
    && chown -R www-data:www-data /var/www/html/api


RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

ENV PORT=10000

EXPOSE 10000
CMD ["bash", "-c", "sed -i \"s/^Listen 80$/Listen ${PORT:-10000}/\" /etc/apache2/ports.conf && sed -i \"s/<VirtualHost \\*:80>/<VirtualHost *:${PORT:-10000}>/\" /etc/apache2/sites-available/000-default.conf && exec apache2-foreground"]
