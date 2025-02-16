FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    apache2 \
    php \
    libapache2-mod-php \
    php-cli \
    php-mbstring \
    php-xml \
    php-mysql \
    unzip \
    git \
    curl \
    openssl

ENV LANG=pl_PL.UTF-8
ENV LANGUAGE=pl_PL:pl
ENV LC_ALL=pl_PL.UTF-8
ENV TZ=Europe/Warsaw

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN a2enmod rewrite ssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt -subj "/CN=localhost"
COPY ./docker/backend/apache2.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html
EXPOSE 80 443

CMD ["apache2ctl", "-D", "FOREGROUND"]