# HealthAPIx Install - Apigee and FHIR Store Provisioning

The full deployment and configuration of Apigee and Google healthcare components are detailed in the 4 steps below.

## Install Process

[Step 1: Setup](#step1)
[Step 2: Install Identity Proxies, Shared Flows and Other Config](#step2)
[Step 3: Create FHIR Store, Import Sample Data and Upload FHIR Proxies](#step3)
[Step 4: Test Installation](#step4)

[Addtional Reference](#reference)

---

### Step 1: Setup

#### A) Create a GPC Project and enable Healthcare API

Create a GCP project.  Under APIs, enable the Healthcare API.

#### B) Create a VM and ssh into it
This is just a linux workstation that will be used for the install and can be removed afterwards.  A 2 cpu, 8gb RAM, 20GB storage, Debian OS is sufficient.  

ssh into the VM

#### C) Install pre-requisite tools

Install the following tools.  These will be needed for the HealthAPIx setup.

Sudo into the VM

sudo -i

- Install Curl 
```sh
  sudo apt update
  sudo apt install curl
```
- Install NodeJs and npm (Node v10 is needed for Gulp)
```sh
  cd
  curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
  sudo bash nodesource_setup.sh
  sudo apt install nodejs
  node -v
  npm -v
```

- Install Gulp
```sh
  npm install --global gulp-cli
```

- Install apigetool
```sh
  npm install -g apigeetool
```
- Install maven
```sh
  sudo apt-get install maven
```
- Install uuidgen
```sh
sudo apt-get install uuid-runtime
```
- Install yq
```sh
  curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
  python get-pip.py
```  
- Note down the pip installation dir which will be displayed after pip is installed
- This installation dir needs to be added to your .bashrc file which resides in your home directory
- For example - lets say pip installation dir is /home/loggeduser/.local/bin
- The add following line at the end of your .bashrc file
```sh
export PATH="$PATH:/home/loggeduser/.local/bin"
```
- Save your .bashrc file
- Source this .bashrc file again in your current shell to make changes take effect
```sh
. ./.bashrc
```
- Verify pip installation and install yq
```sh
echo $PATH
pip --version
pip install yq
```
- Install jq
```sh  
  sudo apt-get install jq
```  
- Install Git
```sh  
  sudo apt-get install git
```  
- Install unzip
```sh
sudo apt-get install unzip
```
- Install terraform
```sh
TER_VER=`curl -s https://api.github.com/repos/hashicorp/terraform/releases/latest | grep tag_name | cut -d: -f2 | tr -d \"\,\v | awk '{$1=$1};1'`
```
```sh
wget https://releases.hashicorp.com/terraform/${TER_VER}/terraform_${TER_VER}_linux_amd64.zip
```
```sh
unzip terraform_${TER_VER}_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```
- Verify terraform installation
```sh
which terraform
terraform -v
```
- Install gcloud 
```sh  
  gcloud is pre-installed on all default GCP VMs
```  
  
 #### D) Check out code from repository

-- repo info removed, unzip from zip file provided --

You might need to clone the repo to your desktop, zip contents and scp to the VM.  If so, you can use this scp command: 
scp ./{file-name.zip} username@{ip-address}:/home/username



### Step 2: Install Identity Proxies, Shared Flows and Other Config

#### A) Create private key for JWT signing and update config.yml.orig

SSH into the newly created VM and cd into the source directory.  Create a private key using this command.  This key will be used to sign the JWT by the identity proxy.
 
```sh  
cd <source-folder> apigee
openssl genrsa -des3 -out private-encrypted-rsa-des3.pem 2048
```  
Enter "apigee" for passphrase when prompted

Open the .pem file and remove the new lines in the file using an [online editor](https://www.textfixer.com/tools/remove-line-breaks.php) (or use a command line tool)

In config.yml.orig, search for the string "jhbdvhbevuhbjvhevjhjvev".  Replace the "value" of the entry with the contents of the .pem file with the new lines removed.  When you replace the value, be sure that the all the new lines have been removed, so that the value is all on one line.

payload: '{ "name" : "HPX_Secrets", "entry" : [ { "name" : "**jhbdvhbevuhbjvhevjhjvev**", "**value**" : "*-----BEGIN PRIVATE KEY-----content_of_pem_here-----END PRIVATE KEY-----*" }  ] , "encrypted": "true"}' 

It should look something like this:

payload: '{ "name" : "HPX_Secrets", "entry" : [ { "name" : "**jhbdvhbevuhbjvhevjhjvev**", "**value**" : "*-----BEGIN RSA PRIVATE KEY----- Proc-Type: 4,ENCRYPTED DEK-Info: DES-EDE3-CBC,A20.......DkP -----END RSA PRIVATE KEY-----*" }  ] , "encrypted": "true"}' 

#### B)  Create Consent Screens in GCP IAM and get Client Id

Create OAuth ClientId for OAuth Login. This is used for the identity provider application for the OIDC OAuth B2C example. You’ll need a client_id and redirect URL. Follow the instructions here: [https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred)

The redirect url can be https://{org-name}-{env-name}.apigee.net

Go to this link to create credentials:  (choose OAuth client ID)
[https://pantheon.corp.google.com/apis/credentials](https://pantheon.corp.google.com/apis/credentials)

  

![](https://lh5.googleusercontent.com/z72FmLTYMea2mlvRzXaZco2czEidO8p6GjGA8AAFAaep3po6BPkXoeRN_BB1tUtDmv3T5yq0ppbqyNlQ8BEuDH_n_T1uBX67BImP7VtUwk31j40j6X8_BRwzlUVdwxIDc-7YfJ84Hg)

Enable OAuth Consent Screen (If you haven’t done this already, follow these steps to create an application)

*Googlers: Choose “Internal” for the B2C signin with Google account only. Choose “External” for all Google and GMail accounts.*

![](https://lh6.googleusercontent.com/Ip4hrA9zv7Wv0VganlWCs16NLhIf9n2a5tW39UnLrNSHy6tZ2Mxp7EQroBCuQ44X1cdsc-14PaQ-TLkNL7F_YUD5RvcWxAmeSXYrEvA7zwGRtB29JIOfiRKLjENkS_H75PQb4YxObQ)

On the “OAuth consent screen”, fill in:

-   Application Name (HealthAPIx Dev Portal)
    
-   Authorized domains
    
-   Add “apigee.net”
    
Click Save.

Go back to the Credentials page

[https://pantheon.corp.google.com/apis/credentials](https://pantheon.corp.google.com/apis/credentials)

![](https://lh5.googleusercontent.com/z72FmLTYMea2mlvRzXaZco2czEidO8p6GjGA8AAFAaep3po6BPkXoeRN_BB1tUtDmv3T5yq0ppbqyNlQ8BEuDH_n_T1uBX67BImP7VtUwk31j40j6X8_BRwzlUVdwxIDc-7YfJ84Hg)

  

Choose “Web Application”, enter:

-   “Name”: HealthAPIx Developer Portal Web App
    
-   Authorized Javascript Origins: “https://{org-name}-{env-name}.apigee.net”
    
-   Authorized redirect urls: (are all these needed?)
    

-   https://{org-name}-{env-name}.apigee.net
    
-   https://{org-name}-{env-name}.apigee.net/openid/callback
    
-   https://{org-name}-{env-name}.apigee.net/openid/index
    
-   https://{org-name}-{env-name}.apigee.net/openid/implicit
    
-   https://{org-name}-{env-name}.apigee.net/oauth/callback
    
-   https://{org-name}-{env-name}.apigee.net/oauth2/callback
    
-   https://{org-name}-{env-name}.apigee.net/identity_app/callback
    
-   https://{org-name}-{env-name}.apigee.net/identity_app/google/callback
    
-   Click “Create”

![](https://lh6.googleusercontent.com/uldfws-VvAU2fSWiRjUrP0EbPAnikk0BYCxwNpg2HXH66AuKtY2OaSc9Cebly60NKlSwnmA4NyaDd9OgRFMfuFteWgKFgd4VqwtdBTUR3jS2n_xH8mWWoCk-H1-XaSDjnw_uY19vag)

Copy “client Id” for use in the install script.

![](https://lh4.googleusercontent.com/7WLPOZTGakYHmg9Y-NtdOda5mlt3QlQs_k_woKZqJCMKyJdU6FcWzFTfDVS1441Hcb2btDZ34m6BVGjJ7i3EHbnp2zD4e2UTjL1AG1_9-C-axLwGCxBQRVF2mjGa12MjrsnxW71eMA)


#### C) Run Install Script
Running this script will install the identity proxies, shared flows, Caches, KVMs, Target Server and other configuration.   *(Note: if you are using an environment not named dev, test or prod, add your environment name to the list in config.yml.orig around line 28.  Otherwise it won't deploy correctly.)*

```sh  
cd apigee
npm install
gulp start --env {apigee-edge-environment-where-you-want-to-deploy}
```  
When prompted, enter the following values:

* Enter the Client Id to use Google Sign-in: (use the clientId from previous step B)
* Enter the redirect url registered with Google Sign-in: (use the redirect url from Oauth client configuration details - https://{org-name}-{env-name}.apigee.net/openid/callback)
* Edge Org name:
* Edge Username: 
* Edge Password:  
* Target server host URL for CHC Fhir Store: healthcare.googleapis.com
* Target server port for CHC Fhir Store: 443
* Target server basepath for CHC Fhir Store: /

If you are getting a 401 error, then you likely entered the wrong credentials or org name.  If this is the first time you are running this script, you will see delete errors in the beginning, since there is nothing to delete.  You might seem some errors related to deployment.  This is common, see next step.

#### D) Verify Installation

Login to Apigee and confirm that the following items were deployed to the chosen environment. In some cases, the shared flows or proxies may not have been deployed due to a cache or KVM not created yet.  If this is the case, deploy the proxy or shared flows.  All proxies and shared flows listed below should be deployed

Proxies
* identity-oauthv2-api (will be deployed as part of this step)
* identity-consent-app (will be deployed as part of this step)
* identity-usermgmt-api (will be deployed as part of this step)
* identity-consentmgmt-api (will be deployed as part of this step)

Shared Flows
* authorization
* google-token 
* proxy-faults 
* target-faults 
* response-headers 
* rewrite-links 
* smart-launch-security 
* spike-arrest 
* supported-resources 
* threat-protection 
* unsupported-operation
 
KVMs
* HPX_Config 
* HPX_Secrets
* HPX_FHIRServerServiceAccountCredentials 

Caches
* consent-session-cache - used by identity-consentmgmt-api
* nonce-cache - used by identity-oauthv2-api
* fhir-resources-cache - used by supported-resources shared flow
* session-cookie-cache - used by identity-consent-app
* backend-service-jwks-cache used by backend services access token flow in identity-oauthv2-api

Target Server
* ghcapiserver - points to healthcare.googleapis.com

API Products
* identityproduct - used by identity-consent-app api proxy

Developers
* identity user - user@identity.com - used to create apps for Identity, User and consent management proxies
* test user - testuser@apigee.com

Developer Apps
* identityApp - client app used by identity-consent-app api proxy

Check into this: *Api key configuration among proxies* - *(What does this mean?)*
1. Google API key configuration
2. Hosted Target API key configuration


### Step 3: Create FHIR Store, Import Sample Data and Upload FHIR Proxies

Creation and configuration of FHIR servers happens along with creation of a API Proxy which acts as a Facade for that FHIR store. This Proxy also acts as an Authorization server for the FHIR Store and provides SMART on FHIR framework. 

#### A) Pre-requisites

1. Create a service account in the GCP project and give the following IAM roles/permissions:

-   Healthcare Dataset Administrator
-   Healthcare FHIR Store Administrator
-   Healthcare FHIR Resource Editor
-   Pub/Sub Admin

2. Create a JSON key for the service account and download the JSON file.  
3. Upload (or copy and paste) the file to the VM that we are using to do the install.  Rename the key file to 'service_account_key.json' and save it in the apigee/scripts folder.  (You will reference this in the input.yaml file in a future step)
4. Create a GCP Cloud Storage bucket.  This is used to keep a backup of various files.  Assign read/write privileges to the bucket for the service account created in step 1.
5. Create a pub/sub topic

#### B) Copy and update input.yaml file

Choose which FHIR version you are going to use.  Copy the matching yaml file in the scripts/sample folder.  For R4, use this command
```sh 
cp sample/r4_input.yaml input.yaml
```
Update input.yaml file to match your environment


* GHC:
  * fhir_version: R4  // This should match the FHIR version for the FHIR Store
  *   proxyurl: https://healthapix-demo-test.apigee.net/   //Apigee instance url where your fhir proxy will be deployed
  *   pubsub-topic: projects/{projectname}/topics/ghcfhirtest //pubsub topic for Fhir store
    *  ***You must first create a pub/sub topic, copy the topic name here
  *   enable_update_create: false  //Fhir store update-create flag
  *   disable_referential_integrity: true //Fhir store referential integrity flag
  *   disable_resource_versioning: false //Fhir store resource versioning flag
  *   enable_history_import: false //Fhir store history import support flag
  * gcp_project:
    * name: projectid  //Update this with the name of your GCP Project
    * number: 8779787878  //Update with project-number (found in the project dashboard)
  * location:
    * name: us-central1  //location where you want to create dataset/fhirstore
  * dataset:
    * name: r4_dataset1  //this will be the name of the dataset
  * fhir_store_name:
    * name: fhirstore_r4   //this will be the name of the fhir store
  * custom_proxy:
    * option: false  //Change to 'true' if you want to name the apigee proxy
    * proxy: custom_apigee_proxy_name_34  //Specify the name of the proxy 
    * product: custom_product_name_34  //Specify the name of the product
  * backupBucketName: provisionscriptdata (name of storage bucket from previous step)
  * use_fhirstore_as_proxy_name: no   //Change to 'true' if name of the proxy same as fhirstore
  * import_data:
    * option: true    //Change to 'true' if you want to import data into fhirstore
    * bucket_name: fhirstore_data     //bucket name to fetch the data from (should be a public bucket)
    * file_names:
      * name: fhir_r4_json_bundle_pretty_resources/**.json    //Location of file to imported within bucket
      * type: bundle_pretty   //type of resource, import fails if this is not correct
    * file_names:
      * name: fhir_r4_ndjson_regular_resources/**.ndjson
      * type: resource
  * service_account: service_account_key.json  //name of the service account file to be used 

#### C) Run the Provisioning Script

Running this script will create the FHIR dataset and store and import the FHIR data.  

Check the version of 'yq' is being used and execute 'creator.sh' or 'creatorv2.sh' appropriately.  If the script does not have execute privileges, use chmod 755 on the file.

```sh
    yq --version
```  
```sh
   # if yq version is 2.10.7 or lower
   # If not executable, run: chmod 775 ./creator.sh
  ./creator.sh
```  
```sh
   # if yq version is 3.1.0 or greater
  ./creatorv2.sh
```  
This script should have two outputs, a fhir_R4_379....38.json and fhir_R4_379....38_serviceaccount.json.  Verify that the files have been created.  Also verify there were no errors and that the FHIR dataset and datastore was created.

*fhir_R4_379....38.json*

*  Created by creator.sh to be used by CreateFHIRProxy.sh
* Contains details about FHIR store and Service Account to be used when creating the Apigee FHIR Proxy
* Should be specified as command line option to  CreateFHIRProxy.sh

*fhir_R4_379....38_serviceaccount.json*

1.  Generated by creator.sh
2.  To be used to create an entry in KVM against the FHIR server name


**Test: Login to GCP and verify that the FHIR dataset and datastore were created.  On the datastore, click the 'operations' tab and check if the data import operation was successful.**

#### D) Run Proxy Creation Script

This script will create and upload the FHIR proxies.  These proxies will match a naming convention containing the UUID of the FHIR store.  

Run Proxy creation script. All Arguments required
```sh
  ./CreateFHIRProxy.sh output_file apigee-org apigee-env apigee-username apigee-password app-developer-email
```

For example:
```sh
./CreateFHIRProxy.sh fhir_R4_3791afcc-771a-4e12-b8cd-cb5d87676e38.json org env user pass testuser@apigee.com
```
This will result in the following:

* Creation of the "fhirApis" proxy - this is used by the Dev Portal docs page.  It's used as a friendlier basepath than the basepath of the fhir proxy (see next bullet)
* Creation of a proxy with the name similar to R4_3791afcc-771a-4e12-b8cd-cb5d87676e38 in your specified organization and deployed to the environment you have chosen. 

* A product with name similar to R4_3791afcc-771a-4e12-b8cd-cb5d87676e38_product will be created and a default app with name similar to R4_3791afcc-771a-4e12-b8cd-cb5d87676e38_app will also be created. 

* The base path of the proxy will be similar to: /v1/r4/R4_3791afcc-771a-4e12-b8cd-cb5d87676e38.

**Test: Login to Apigee and verify that the proxy, product and app were created as mentioned above**

#### E) Update the client_id in the fhir_r4* proxy

Login to the Apigee UI.  Open the fhir_r4* proxy.  Click on the "TMP_SetClientId" policy.  Replace the client_id with the client_id of the "fhir_..._app" app that was created earlier.  You can get this value from the UI.  

*UPDATE:*
This should not be hardcoded in the policy.  The policy should be pulling this value from the KVM.  The step here should be to add the value to the KVM

#### E2) Add the client_id to the 'HPX_Config' KVM

*This step will replace E2 once the code change is made.*  Login to the Apigee UI, open the HPX_Config KVM.  Add the client_id of the default fhir app that was created in the previous step, using the key 'default.fhir.app.client_id'
key name: default.fhir.app.key
value: {client_id_of_fhir_app}

### Step 4: Test Installation 

By this step, the API runtime and sample patient data for the HealthAPIx solution should be deployed and available.  Use the following tests to verify that the Patient API is running successfully

#### A) Get OAuth Token using Client Credentials

Login to the Apigee UI and open the user app that was newly created.  It should have a naming convention similar to R4_db03af8...345_app.  Retrieve the client_id and client_secret.  For OAuth client credentials, you'll need to get the [base64](https://www.base64encode.org/) string of client_id:client_secret.

```sh
curl -X POST https://{apigeeorg}-{env}.apigee.net/oauth/v2/accesstoken?grant_type=client_credentials -H "Authorization: Basic base64{client_id:client_secret}" -d 'scope=patient%2FPatient.read+patient%2FPatient.write'  
```

Example:
```sh
curl -X POST https://orgname-env.apigee.net/oauth/v2/accesstoken?grant_type=client_credentials -H "Authorization: Basic SXk1N0dGV1RLNFdKaHSJKBFZBb877Nlc1ZTJJZUE6TG9YcnNzVlNOV2FlVzlvZw==" -d 'scope=patient%2FPatient.read+patient%2FPatient.write'
```

#### B) Make GET /Patient call

*Replace R4_path with the path of the FHIR proxy.*

curl -X GET "https://orgname-env.apigee.net/v1/r4/{R4_path}/Patient" -H "Accept: application/fhir+json;charset=utf-8" -H "Authorization: Bearer {accesstoken}"

*You can also use this URL:*

curl -X GET "https://orgname-env.apigee.net/v1/ghc/r4/Patient" -H "Accept: application/fhir+json;charset=utf-8" -H "Authorization: Bearer {accesstoken}"

---
***At this point, all the components in Apigee and FHIR store have been created.  Proceed to the Developer Portal install instructions.***

------

## Additional Reference
This section describes the components of the HealthAPIx solution and what they are used for
  

### Apigee Edge Components

**API Proxies**

Apigee FHIR Gateway consists of the following components

**FHIR Proxy templates** - Templates for API Proxies which are compatible with FHIR (Fast Healthcare Interoperability Resources) DSTU2, STU3 and R4 standards. These proxies connect to Google FHIR store implementation for DSTU2, STU3 and R4 FHIR standards. However, these templates are first converted into a deployable proxy based on the provisioning input and then deployed to the Apigee instance.  

**Identity Proxies** - This proxy provides Oauth 2.0 based authorization and authentication services including Backend Services access token flow.
 
**User and Consent management Proxies** - These proxies provide user and consent management apis and integrate with Identity proxies. These proxies use FHIR Store to check for the User based on the identifier provided. Consent is also being stored in the FHIR store and validation is being done against FHIR store.

**Short description of proxies**

* fhirApis - This proxies acts as a catch-all proxy for the Api calls from API docs only. Internally, it routes the call to the appropriate FHIR proxy based on the client-id in the incoming API call.

* fhir_R4_proxy - R4 Fhir proxy based on fhir_r4_template connecting to a R4 Fhir store.

* fhir_STU3_proxy - STU3 Fhir proxy based on fhir_stu3_template connecting to a STU3 Fhir store.

* fhir_DSTU2_proxy - DSTU2 Fhir proxy based on fhir_dstu2_template connecting to a DSTU2 Fhir store.

* identity-oauthv2-api - OAuth2 Authorization proxy using Apigee out of the box features.  

* identity-consent-app - Proxy for Login redirection and consent interaction. Consent window is           displayed in case of a Patient user. Practitioner and RelatedPerson users are not displayed consent window.

* identity-usermgmt-api - Proxy which takes a gmail/google email as input and finds out if the email belongs to a Patient, Practitioner or a RelatedPerson in the FHIR Store.

* identity-consentmgmt-api - Proxy to validate, create and updated Consent resource when a Patient logs in.

**Short description of shared-flows**

* authorization - shared-flow for quota management, scope and access-token validation

* google-token - shared-flow for creating and embedding a google access token. Takes client_id as input and queries product to look at attributes to find out fhirstore details

* proxy-faults - Proxy fault management to be used in Fhir proxies in Proxy endpoints.

* target-faults - Target fault management to be used in Fhir proxies in Target endpoints.

* response-headers - Shared-flow to add CORS response headers on top of response returned from Google fhir store.

* rewrite-links - Shared-flow that re-writes links in Fhir store response and replaces the FQDN with that of the Fhir proxy. 

* smart-launch-security - This shared flow add 'security' block to the capability statement from the Fhir store response and adds 'authorize' and 'token' urls in the security element. This is done to support SMART launch framwork requirements.

* spike-arrest - Shared flow for throttling the requests. 

* supported-resources - Shared flow to validate whether the requested resource is a valid FHIR resource. Capability statement of the Fhir store is accessed and cached to arrive at the list of supported resource by a particular Fhir store.

* threat-protection - Shared flow to apply Threat protection policies to the flow within a FHIR Proxy.

* unsupported-operation - When incoming request to a FHIR proxy matches with none of the flows in the Proxy endpoint then this shared flow is invoked to return error response.
 
  
**KVM**

Key value maps are used by Apigee Edge proxies to get configuration information for some policies to work. Following KVMs will be created and used as part of this installation

* HPX_Config - Required by identity-oauthv2-api

* HPX_Secrets - Required by identity-oauthv2-api - Stores the private key for the JWT 

* HPX_FHIRServerServiceAccountCredentials - Required by multiple proxies


**Caches**

Caches are being used by some Proxies to store information for cross proxy communication as well as session storage. Following caches are being used in this installation

* consent-session-cache - used by identity-consentmgmt-api

* nonce-cache - used by identity-oauthv2-api

* fhir-resources-cache - used by supported-resources shared flow

* session-cookie-cache - used by identity-consent-app

* backend-service-jwks-cache used by backend services access token flow in identity-oauthv2-api

**Target Server**

Target servers are being used to parameterize the backend url that are being used by FHIR proxies. Following target servers will be created and used in the FHIR proxies

* ghcapiserver - points to healthcare.googleapis.com

**API Products**

Initial deployment creates following products which can be used to kick-start exploration and serve as templates to create more customized products. API products related to FHIR proxies are created by provisioning scripts when the FHIR Stores and FHIR proxies are being created. For more information see Provisioning script documentation. 

* identityproduct - used by identity-consent-app api proxy


**Developers**
Default developers are created to support App creation. Following is the list of developers which are created as part of initial deployment

* iuser - user@identity.com - used to create apps for Identity, User and consent management proxies

App for FHIR proxies are created using the user credentials which is provided at the time of running provisioning scripts.


**Developer Apps**

Default apps are created to support quickly test and explore HealthCare FHIR APIs. 

* identityApp - client app used by identity-consent-app api proxy

Apps for a particular FHIR proxy are created at the time of Provisioning exercise. For example - When a DSTU2 FHIR store is being created using the provisioning script, at that time, correspoding DSTU2 FHIR proxy, a DSTU2 Product and a related App is also created.


**GCP Cloud resources**

Apigee Edge proxies require Google Cloud FHIR Store for the FHIR proxies and identity-usermgmt-api and identity-consentmgmt-api proxies to work. 

**OAuth 2.0 Client ID and redirect Url** - This is required to connect to Google Sign-in experience. Register an Oauth Client for web application as mentioned here in your GCP Project -> https://developers.google.com/identity/protocols/oauth2/web-server
This is done by creating a OAuth 2.0 Client IDs under APIs and credentials section in GCP Project. This also requires configuring Consent screen with the domain details of Apigee Instance and Developer portal domain.


  
### Provisioning Scripts
1. **creator.sh** - Creates Dataset and specified FHIR store, loads data in the FHIR store.  **input** -> input.yaml  **output** -> output.yaml, service account key file

2. **CreateFHIRProxy.sh** - Creates FHIR proxies and configures KVM, Caches, target Server, FHIR store configurations to make the FHIR proxy work.                 **input** -> output.yaml, service account key file

#### input.yaml
1. Should be present in the same directory as creator.sh and CreateFHIRProxy.sh
2. Contains details about Service Account key file to be used, Project details, FHIR store details, Customization details for the Apigee Proxy, import data options to load data into FHIR store, Service account options for creation, naming and roles to be assigned.

#### output.yaml
1. Created by creator.sh to be used by CreateFHIRProxy.sh
2. Contains details about FHIR store and Service Account to be used when creating Apigee FHIR Proxy
3. Should be specified as command line option to CreateFHIRProxy.sh

#### sample
1. Contains sample input file for R4, STU3 and DSTU2 fhir versions.
2. Replace input.yaml file with any one of these files for quick reference.

#### service_account_key.json
1. Generated by creator.sh
2. To be used to create an entry in KVM against the FHIR server name

### Additional Instructions for Creating a Consent Screen for User Login

![](src/images/create_consent_screen_1.png)
![](src/images/create_consent_screen_2.png)
![](src/images/create_consent_screen_3.png)

As highlighted above, the domain of the Apigee instance and Developer portal needs to be mentioned here.

###Create an OAuth Client
![](src/images/create_oauth_client_1.png)
![](src/images/create_oauth_client_2.png)

###Use the Oauth Client Id
The clientId highlighted in yellow in previous picture is to be used when the Apigee Deployment script asks for “ Enter the Client Id to use Google Sign-in:” as mentioned in this document - Google Healthcare FHIR Store provisioning scripts.md under point 1 -  1. Deploy Identity Proxies and catch-all fhirApis Proxy
Urls in red and blue are required for the Google Sign in experience to work fine. 
The one in red are corresponding to Apigee instance where Apigee proxies will be deployed and correspond to each Org-Env combination in your apigee instance. This is done once to make sure that same Client Id can be used across all the environments. 
![](src/images/configure_oauth_client_1.png)

###Use the Redirect uri
The first Url in the Green highlighted box with endpoint as “/openid/callback” is the Url where Google sign-in calls back to return the JWT token. This Url is to be used when the Apigee Deployment script asks for “Enter the redirect url registered with Google Sign-in:” as mentioned in this document - Google Healthcare FHIR Store provisioning scripts.md under point 1 -  1. Deploy Identity Proxies and catch-all fhirApis Proxy.


### Manually create and configure a FHIR Proxy server

If you want to manually override the FHIR proxies and FHIR server that is installed as part of the script, or manually install it, see these steps as a reference.

1. Login to the Apigee instance where you want to create the FHIR server manually.
2. On the Edge UI, go to Proxy listing page

![](src/images/img-1.png)

![](src/images/img-2.png) 

3. Decide the FHIR version for which you want to create new FHIR Proxy.

4. Click on the one of the Active and working FHIR Proxy for this FHIR version.

![](src/images/img-3.png)

5. An overview page is displayed for the selected FHIR Proxy.

6. On top left side, click on 'Project', a drop down will be displayed select 'Save as New API Proxy'

![](src/images/img-4.png)

7. In the dialog box that appears, assign and note the name of the new Proxy, 'fhir_R4_mynewR4proxy' 

is the name which we use this time.

![](src/images/img-5.png)

8. A new proxy with name 'fhir_R4_mynewR4proxy' is created and the overview page of this new proxy is 

displayed. Click on the 'Deployment' drop down. Note that this proxy is not deployed to any 

environment.

![](src/images/img-6.png)

9. Click on the 'Develop' tab on the top right corner. This will take you to 'Develop' window. In 

this new window, in left pane, click on 'default' under 'Proxy Endpoints'. This displays a central 

pane with xml based code visible in it.

![](src/images/img-7.png)

10. In this central code pane which shows 'Code default' as below image. Scroll to the bottom of the 

pane as shown in below image. You should be able to see <BasePath> tag at the bottom of this code 

pane as shown in below image.

![](src/images/img-8.png)

11.Change the base path to - '/v1/r4/R4_mynewR4proxy' as shown in below image. As soon as you change 

the basepath, a blue coloured 'Save' button gets enabled in the top menu. Click on the 'Save' button 

to save your changes.

![](src/images/img-9.png)

12. A message is displayed when the changes are successfully save as shown in below image.

![](src/images/img-11.png)

13.Now, click on the 'Deployment' button. From the dropdown menu, select the environment where you 

want to deploy this proxy. This is shown in image below.

![](src/images/img-12.png)

14. When you select an environment, a confirmation box is displayed as shown in below image. Click 

'Deploy'.

![](src/images/img-13.png)

15. This deploys the proxy in the selected environment and a confirmation message is displaye as 

shown in image below.

![](src/images/img-14.png)

16. To confirm, click on 'Trace' tab towards top right. This takes you to the trace window. Verify 

that the environment and revision are displayed on the left top corner as shown in the image below.

![](src/images/img-15.png)

17. Now, on the left pane, from the menu, choose 'Admin' -> 'Environments' -> 'Key Value Maps' as 

shown in image below.

![](src/images/img-19.png)

18. This takes you to a list of Key value Maps, choose the environment where you have deployed your 

newly created proxy. In this case, since we deployed the proxy to the 'dev' environment, 'dev' 

environment is selected. All the KVMs in the 'dev' are listed in this window as shown in image below.

We are goint to creat an entry in the 'HPX_FHIRServerServiceAccountCredentials' KVM. Click on 

'HPX_FHIRServerServiceAccountCredentials' KVM from the list.

![](src/images/img-20.png)

19. In the next window, a list of entries are shown in 'HPX_FHIRServerServiceAccountCredentials' KVM. 

Click on '+' icon on top right corner to create an entry as shown in the image below.

![](src/images/img-21.png)

20. This opens up a KVM Entry form. In the 'Name' field, add Fhir server proxy name - 

'R4_mynewR4proxy' as shown in the image below. In the 'Value' field, copy and paste the service-

account-key.json file content as shown in the image below. Then click on 'Add'.

![](src/images/img-22.png)

21. This saves the KVM entry and you will be able to see a new entry in the KVM as shown in the image below.

![](src/images/img-23.png)

22. Now, we will create a new Product. Click on 'Publish' -> 'API Products' from the left pane menu 

as shown in the image below.

![](src/images/img-24.png)

23. This will take you to the Product list page. Click on '+ API Product' button on top right corner 

as shown in the image below.

![](src/images/img-26.png)

24. New Product creation form is displayed. Fill in all the information in this form as mentioned 

below and also shown in the image below.
  * Name - fhir_R4_mynewR4proxy_product
  * Description - Put a description of your choice
  * Display Name - fhir_R4_mynewR4proxy_product
  * Environment - Choose env where you have deployed your Proxy
  * Access - Public 
  * Quota - Choose appropriate quota - In this case, you can enter, 10000 requests every 1 month
  * Scope - Copy the scopes from the other product for the FHIR server you chose earlier to this    one. You can strip down the scopes if you want to.

![](src/images/img-29.png)

25. API Resources - Click on ‘Add a proxy’ to proxies. From Modal window, choose following 4 proxies from the list as shown in the image below 
  * fhirApis
  * Identity-oauthv2-api
  * Identity-consentmgmt-api
  * fhir_R4_mynewR4proxy
Then click on ‘Add’

![](src/images/img-27.png)

26. Next, click on ‘Add a path’. From next Modal window, make sure ‘Path’ option is selected.

Add /** in the text box. Click on 'Add’

![](src/images/img-28.png)

27. Now, the 'API proxies' and 'Path' section under API resources will look like as shown in image 

below.

![](src/images/img-29.png)

28. Scroll down to 'Custom Attributes' section of the form and click on 'Add a custom attribute' 

link. This will display a Modal window. Add a custom attribute with Name - is_fhir_server and Value - 

true as shown in image below.  

![](src/images/img-31.png)

29. Similarly, add more custom attributes as mentioned below. Once done, you should be able to see 

all the custom attributes as shown in image below. NOTE: The fhir_server_url, project, location, 

dataset, fhirstore will be different than what is shown in image. These attributes will be specific 

to your FHIR proxy and FHIR store details. Following attributes should be created overall, 

is_fhir_server, fhir_server_url, fhir_version, fhir_server_name, project, location, dataset, 

fhirstore.

![](src/images/img-32.png)

30. Click on 'Save' button on top right corner to save all the information entered so far in the 

Product registration form as shown in the image below.

![](src/images/img-33.png)

31. New Product is created and details are shown in the next window as shown in the image below.

![](src/images/img-34.png)
