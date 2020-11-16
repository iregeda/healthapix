#! /bin/bash

source ./ghc.config

# Drupal directory: 1 level up.
DRUPAL_ROOT_PATH=${PWD%/*}

# File
## install/source
#CWD=$(pwd)

# gsutil cp gs://ghc-test-backup/09-15-2020/files.tar.gz
# fetch todays date in mm-dd-YYYY format
# Check if the files.tar and db.tar exists in the gcp bucket
# if the file exists then copy the files into the folder
# if the file does not exist then get the previous day date and then fetch the file
# copy the files into the folder and follow the following steps


#I had added the cron job to start at 8:00 AM UTC (4: 00 AM EST) on the dev instance. The following backups should be pulled from GS for the startup scripts using the following command:
#
#gsutil cp gs://ghc-test-backup/09-15-2020/files.tar.gz <DESTINATION_DIRECTORY>
#gsutil cp gs://ghc-test-backup/09-15-2020/db.tar.gz <DESTINATION_DIRECTORY>
#
#Please add logic to pull a backup from the current date folder. If the backup is not present on the current date, we have to get the backup from the previous date.

tar -xvzf $DRUPAL_ROOT_PATH/install/source/files.tar.gz -C $DRUPAL_ROOT_PATH/web/sites/default/
chmod -R 777 $DRUPAL_ROOT_PATH/web/sites/default/files


# Database
#ochorne
#tar -xvzf $DRUPAL_ROOT_PATH/install/source/db.tar.gz -C $DRUPAL_ROOT_PATH/install/source/
gunzip healthapix-demo1_dev_2020-11-10T16-36-48_UTC_database.sql.gz -d $DRUPAL_ROOT_PATH/install/source/

echo "-----Importing into ${DB_NAME_AUTO} database-------"
mysql -u "$DB_USER_NAME" -p"$DB_PASSWORD" -e "create database $DB_NAME_AUTO"
mysql -u "$DB_USER_NAME" -p"$DB_PASSWORD" $DB_NAME_AUTO < $DRUPAL_ROOT_PATH/install/source/db.sql
echo "----- Import done. DB Name: ${DB_NAME_AUTO} -------"
rm $DRUPAL_ROOT_PATH/install/source/db.sql

# Settings.php
DRUPAL_SETTINGS_PHP_FILE_NAME=settings.php

cp $DRUPAL_ROOT_PATH/web/sites/default/default.settings.php $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
chmod 777 $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME

# use shell script functions to generate this
#SETTINGS_SAL_HASH="$(php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php php-eval 'echo \Drupal\Component\Utility\Crypt::randomBytesBase64(55)')"
SETTINGS_SAL_HASH="$(echo $(for((i=1;i<=74;i++)); do printf '%s' "${RANDOM:0:1}"; done) | tr '[0-1000]' '[A-Z]')"

#Update Databasebase Connectivity
echo ' $databases = [ ' >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "   'default' =>" >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "     [" >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "       'default' =>" >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "         [ " >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "           'database' => '$DB_NAME_AUTO'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "            'username' => '$DB_USER_NAME'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "            'password' => '$DB_PASSWORD'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "            'host' => '$DB_HOST'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "            'port' => '$DB_PORT'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "            'driver' => 'mysql'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
#echo "            'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
#echo "            'unix_socket' => '/Applications/MAMP/tmp/mysql/mysql.sock'," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "            'prefix' => ''," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "          ]," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "        ]," >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "  ];" >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME

#$settings['hash_salt'] = 'xa6vg7LBvyt3aLdPi9iHyHKkvYQH_B0plg73t6OipyAiLfHnQ-dlQ7EgaE-mNvwSqbb-ew_OzQ';
echo "\$settings['hash_salt'] = \"${SETTINGS_SAL_HASH}\";" >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME
echo "\$config_directories = [ CONFIG_SYNC_DIRECTORY => dirname(DRUPAL_ROOT) . '/config'];" >> $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME

chmod 644 $DRUPAL_ROOT_PATH/web/sites/default/$DRUPAL_SETTINGS_PHP_FILE_NAME

# email change for admin
mysql -u "$DB_USER_NAME" -p"$DB_PASSWORD" -e "use $DB_NAME_AUTO; UPDATE \`users_field_data\` SET \`mail\` = '$ADMIN_EMAIL_ADDRESS' WHERE \`users_field_data\`.\`uid\` = 1"

# Drush cache clear & Set admin password
php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php cr
php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php user-password admin $ADMIN_PASSWORD
php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set system.site name "$SITE_NAME" -y
php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set system.site mail "$SITE_EMAIL" -y

if $UPDATE_SMTP_SETTINGS
then
  php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set smtp.settings smtp_host "$smtp_host" -y
  php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set smtp.settings smtp_port "$smtp_port" -y
  php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set smtp.settings smtp_protocol "$smtp_protocol" -y
  php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set smtp.settings smtp_username "$smtp_username" -y
  php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set smtp.settings smtp_password "$smtp_password" -y
  php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set smtp.settings smtp_from "$smtp_from" -y
fi

php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php config-set system.file path.temporary "$DRUPAL_TMP_PATH" -y
php $DRUPAL_ROOT_PATH/vendor/drush/drush/drush.php cr
