## Before executing Step:1

- Repository URL: https://source.cloud.google.com/dacfhir/health-apix2.2/+/master:

>Note: If the v2.2 site needs to be setup, then clone from v2.2 repository or else
if the v2.1 site needs to be setup, then clone from v2.1 repository.

- The GCP repository only has the option to clone by ssh.
Please create the ssh or use the existing ssh key in the server and
add that existing/generated public key into the GCP Repo using the
"Manage SSH Keys" link under the three dots in the right top corner.

- Once you add the ssh key into the GCP repository, the user will be able to clone from the repository.

- Clone the repository into the server where the site needs to be setup.
Checkout the **master_portal** branch for the drupal code.
APIGee code is maintained in the **master** branch.

- Please find the link for the setup guide:
  https://docs.google.com/document/d/1n6oJQt203RKefbrU7kDY7sjqnrVq98M3zm2-BLC5vQY/edit?ts=5ec62fac#heading=h.qy8j54yex5vx (Link needs to be updated)


## Step:1 : Copy required code to google cloud bucket.
Before running the below command, edit push_to_gcp_storage.sh file to update bucket name(if changed) from "ghcdrupalcode" to respective new bucket name (in gsutil commands)

And Run

> bash portal/scripts/devportal/push_to_gcp_storage.sh

## Step 2 : Configure VM settings at scripts/config.yml
- In this file update the bucket name from "ghcdrupalcode" to respective new bucket name, if it is changed in **Step-1**. This exists in the "startup-script" key

- Edit scripts/deploy_portal.sh & update ""--projects=ghcdrupalproject" to respective project in the bazel command line.

## Step 3 : Run deploy_portal.sh script from scripts/ folder
After editing required files in **step-2**
Run

> cd portal/scripts/devportal/

> bash deploy_portal.sh

## Step 4: Delete the gcp bucket object file
Delete the gcp bucket object file after verifying the site in the new VM instance. Before running this command, edit this command with updated bucket name from "ghcdrupalcode" to respective new bucket name which is changed in **step-1**

Run
> gsutil rm gs://ghcdrupalcode/portalCode.tar.gz

> rm portalCode.tar.gz
>
Note: Please note that it will take around 15 mins for the site to be up after the step 2 is run.


#ochorne
#startup-script: 
cd /opt 
mkdir /opt/portalCode 
gsutil cp gs://install-healthapix/portalCode.tar.gz /opt/portalCode
cd /opt/portalCode  
tar -xvzf portalCode.tar.gz  
sh -xv /opt/portalCode/portal/scripts/devportal/installnginxmariadbdrupalghc.sh
