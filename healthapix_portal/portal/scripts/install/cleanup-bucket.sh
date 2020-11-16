# Please provide the absolute path for the backup.config file
source /Applications/MAMP/htdocs/health-apix2.2/portal/scripts/install/backup.config

DATE=`date --date="6 day ago" +'%m-%d-%Y'`

echo "Deleting $BUCKET$DATE"

gsutil rm -r $BUCKET$DATE
