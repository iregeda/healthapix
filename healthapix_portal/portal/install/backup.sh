# Please provide the absolute path for the backup.config file
source /Applications/MAMP/htdocs/health-apix2.2/portal/scripts/install/backup.config
DATE=`date +'%m-%d-%Y'`

rm /tmp/*.sql
mkdir /tmp/$DATE

mysqldump --defaults-extra-file=$LOGIN_CNF_PATH -u $DB_USERNAME $DB_NAME > /tmp/ghc.sql

cd $FILES_BACKUP_DIR_PATH && tar -zcf /tmp/$DATE/files.tar.gz *

cd /tmp && tar -zcf /tmp/$DATE/db.tar.gz ghc.sql
gsutil rm -r $BUCKET$DATE
gsutil cp -r /tmp/$DATE $BUCKET

rm -rf /tmp/$DATE
