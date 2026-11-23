FROM php:8.2-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN a2enmod rewrite headers

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html \
    && mkdir -p /var/www/html/sessions \
    && chown -R www-data:www-data /var/www/html/sessions

RUN sed -i 's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#' /etc/apache2/sites-available/000-default.conf
