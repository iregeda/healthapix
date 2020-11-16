#! /bin/bash
yum -y install epel-release.noarch
yum -y install https://repo.ius.io/ius-release-el7.rpm
yum -y install iptables-services
systemctl stop firewalld && sudo systemctl start iptables
firewall-cmd --state
systemctl disable firewalld
systemctl mask firewalld
systemctl enable iptables
iptables -L --line-numbers -nv
sed -i 's/enforcing/disabled/g' /etc/selinux/config
setenforce 0
yum -y update
iptables -F
chkconfig iptables off
yum -y install nginx
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | bash
yum -y install MariaDB-server MariaDB-client
yum -y install php72u-cli.x86_64 php72u-pdo.x86_64 php72u-mbstring.x86_64 php72u-common.x86_64 php72u-bcmath.x86_64 php72u-fpm-nginx.noarch php72u-gd.x86_64 php72u-xml.x86_64 php72u-json.x86_64 php72u-opcache.x86_64 php72u-mysqlnd.x86_64
yum -y install patch
yum -y install git.x86_64
yum -y install pwgen.x86_64
yum -y install unzip.x86_64
yum -y install wget.x86_64
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --version=1.10.17 --filename=composer
systemctl enable php-fpm.service nginx.service mariadb.service
sed -i 's/^\[mysqld\]/\[mysqld\]\nmax_allowed_packet=200M/' /etc/my.cnf.d/server.cnf
systemctl restart nginx.service
systemctl restart php-fpm.service
systemctl start mariadb.service
cd /opt
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
HASH="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
export COMPOSER_HOME="$HOME/.config/composer";
#php composer-setup.php --install-dir=/usr/bin --version=1.10.17 --filename=composer
pwgen -s 15 1 > /var/tmp/.mysql_password
db_drupaladmin_password=$(</var/tmp/.mysql_password)
mysql -u root -e "CREATE USER 'drupaladmin'@'localhost' IDENTIFIED BY '$db_drupaladmin_password';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'drupaladmin'@localhost IDENTIFIED BY '$db_drupaladmin_password';"
mysql -u root -e "flush privileges;"
#git clone https://ghcdeploy:7wFGAVLAVdYc676D@gitlab.digitalapicraft.com/krishnakanth/tmp_ghc_v2.1.git
mkdir -p /var/www/drupal/
cd /opt
cp -r /opt/portalCode /var/www/drupal/ghc-hosting
chown -Rc nginx.nginx /var/www/drupal/
cd /var/www/drupal/ghc-hosting/portal
sed -i 's/memory_limit\s*=.*/memory_limit=5024M/g' /etc/php.ini
/usr/bin/composer update
/usr/bin/composer install

cd /var/www/drupal/ghc-hosting/portal/install
sh install.sh

chown -Rc nginx.nginx /var/www/drupal/
cd /var/www/drupal/ghc-hosting/portal/
php vendor/drush/drush/drush.php cr
cp /opt/portalCode/portal/scripts/devportal/nginx.conf /etc/nginx/
cp /opt/portalCode/portal/scripts/devportal/php-fpm.conf /etc/nginx/conf.d/
cp /opt/portalCode/portal/scripts/devportal/www.conf /etc/php-fpm.d/
# tar zxvf /opt/nginxconfigs.tar.gz
#cp /opt/nginxconfigs/nginx.conf /etc/nginx/
#cp /opt/nginxconfigs/www.conf /etc/php-fpm.d
#cp /opt/nginxconfigs/php-fpm.conf /etc/nginx/conf.d/
systemctl restart nginx.service
systemctl restart php-fpm.service
#ochorne
cd /var/www/drupal/ghc-hosting/portal/
gunzip healthapix-demo1_dev_2020-11-10T16-36-48_UTC_database.sql.gz
mysql -u root healthapix < healthapix-demo1_dev_2020-11-10T16-36-48_UTC_database.sql
tar xvfz healthapix-demo1_dev_2020-10-23T18-17-02_UTC_files.tar.gz
mv /var/www/drupal/ghc-hosting/portal/files_dev  /var/www/drupal/ghc-hosting/portal/web/sites/default/files
cd /var/www/drupal/ghc-hosting/web/sites/default
chmod -R 777 files
vendor/bin/drush cr
