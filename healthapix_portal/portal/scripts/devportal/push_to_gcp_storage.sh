#! /bin/bash

#source ./gcp_storage.config

#tar -cvzf portalCode.tar.gz portal --exclude=portal/vendor --exclude=portal/web/core --exclude=portal/web/sites/default/files --exclude=portal/web/sites/default/settings.php
tar -cvzf portalCode.tar.gz portal portal/scripts

gsutil cp portalCode.tar.gz gs://install-healthapix/portalCode.tar.gz
gsutil acl ch -u AllUsers:R gs://install-healthapix/portalCode.tar.gz

#gsutil cp gs://ghcdevportaldemo/portalCode.tar.gz /destination-path

# Use this command to delete the file after portal is up.
#gsutil rm gs://ghcdevportaldemo/portalCode.tar.gz
