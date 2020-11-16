<?php

namespace Drupal\fhir_smart;

use Drupal\user\Entity\User;
use Apigee\Edge\Api\Management\Controller\DeveloperAppCredentialController;


/**
 * Class MyAppService.
 */
class MyAppService {

  /**
   * Constructs a new MyAppService object.
   */
  public function __construct() {

  }

  /**
   *  delete myapp.
   */
  public function deleteMyApp($app_id) {
    $entity = \Drupal::entityTypeManager()
      ->getStorage("developer_app")
      ->load($app_id);
    $entity->delete();
  }

  /**
   *  create myapp.
   */
  public function createMyApp($email_id, $app_name, $display_name, $selected_products, $smart_app_url, $redirect_url, $app_type, $fhir_app_type, $fhir_version, $fhir_server_id, $checked_standard_scopes, $checked_user_scopes, $checked_patient_scopes,$fhir_server_name, $jwks_uri) {

    $developer_app = \Drupal::entityTypeManager()
      ->getStorage('developer_app')
      ->create(
        [
          'name' => $app_name,
          'displayName' => $display_name,
          'field_smart_launch_url' => $smart_app_url,
          'field_redirect_url' => $redirect_url,
          'field_fhir_version' => $fhir_version,
          'field_app_type' => $app_type,
          'field_fhir_app_type' => $fhir_app_type,
          'field_fhir_server_id' => $fhir_server_id,
          'field_standard_scopes' => $checked_standard_scopes,
          'field_user_scopes' => $checked_user_scopes,
          'field_patient_scopes' => $checked_patient_scopes,
          'field_fhir_server' => $fhir_server_name,
          'field_dataset' => ' ',
          'field_fhirstore' => ' ',
          'field_location' => ' ',
          'field_project' => ' ',
          'field_jwks_uri' => $jwks_uri,
        ]
      );
    $developer_app->setAppOwner($email_id);
    $developer_app->save();
    // Associate the product to the app.
    $service = new DeveloperAppCredentialController(\Drupal::service('apigee_edge.sdk_connector')
      ->getOrganization(), $developer_app->getDeveloperId(), $developer_app->getName(), \Drupal::service('apigee_edge.sdk_connector')
      ->getClient());
    /** @var \Apigee\Edge\Api\Management\Entity\AppCredential[] $credentials */
    $credentials = $developer_app->getCredentials();
    /** @var \Apigee\Edge\Api\Management\Entity\AppCredential $credential */
    $credential = reset($credentials);
    $credential_lifetime = \Drupal::configFactory()
      ->get('apigee_edge.developer_app_settings')
      ->get('credential_lifetime');
    if ($credential_lifetime === 0) {
      $service->addProducts($credential->id(), $selected_products);
    }
    else {
      $service->delete($credential->id());
      // The value of -1 indicates no set expiry. But the value of 0 is not
      // acceptable by the server (InvalidValueForExpiresIn).
      $service->generate($selected_products, $developer_app->getAttributes(), $developer_app->getCallbackUrl(), [], $credential_lifetime * 86400000);
    }
  }

  /**
   *  Update myapp.
   */
  public function updateMyApp($app_id, $app_ttributes, $selectedproducts, $email_id, $checked_standard_scopes, $checked_user_scopes, $checked_patient_scopes, $jwks_uri) {
    $entity = \Drupal::entityTypeManager()
      ->getStorage("developer_app")
      ->load($app_id);
    $entity->set('displayName', $app_ttributes['app_name']);
    $entity->set('field_app_type', $app_ttributes['app_type']);
    $entity->set('field_redirect_url', $app_ttributes['redirect_url']);
    $entity->set('field_fhir_version', $app_ttributes['fhir_version']);
    //    $entity->set('field_fhir_app_type', $app_ttributes['fhir_app_type']);
    $entity->set('field_fhir_server_id', $app_ttributes['fhir_server_id']);


    // scopes to update for apigee end.
    $entity->set('field_standard_scopes', $checked_standard_scopes);
    $entity->set('field_user_scopes', $checked_user_scopes);
    $entity->set('field_patient_scopes', $checked_patient_scopes);

      $entity->set('field_fhir_server', $app_ttributes['fhir_server_name']);



    $entity->set('field_dataset', '');
    $entity->set('field_fhirstore', '');
    $entity->set('field_location', '');
    $entity->set('field_project', '');
    $entity->set('field_jwks_uri', $jwks_uri);
    if ($app_ttributes['smart_app_url']) {
      $entity->set('field_smart_launch_url', $app_ttributes['smart_app_url']);
    }
    $entity->setAppOwner($email_id);
    $entity->save();


    // unset the existing the product for the app.
    _unset_products($app_id);

    // Associate the product to the app.
    $service = new DeveloperAppCredentialController(\Drupal::service('apigee_edge.sdk_connector')
      ->getOrganization(), $entity->getDeveloperId(), $entity->getName(), \Drupal::service('apigee_edge.sdk_connector')
      ->getClient());
    /** @var \Apigee\Edge\Api\Management\Entity\AppCredential[] $credentials */
    $credentials = $entity->getCredentials();
    /** @var \Apigee\Edge\Api\Management\Entity\AppCredential $credential */
    $credential = reset($credentials);
    $credential_lifetime = \Drupal::configFactory()
      ->get('apigee_edge.developer_app_settings')
      ->get('credential_lifetime');
    if ($credential_lifetime === 0) {
      $service->addProducts($credential->id(), $selectedproducts);
    }
    else {
      $service->delete($credential->id());
      // The value of -1 indicates no set expiry. But the value of 0 is not
      // acceptable by the server (InvalidValueForExpiresIn).
      $service->generate($selectedproducts, $entity->getAttributes(), $entity->getCallbackUrl(), [], $credential_lifetime * 86400000);
    }
  }


  public function listingMyApp($userId) {
    $userDetails = User::load($userId);
    $developerId = $userDetails->get('apigee_edge_developer_id')->value;
    $storageDeveloperApp = \Drupal::entityTypeManager()
      ->getStorage('developer_app');
    $query = $storageDeveloperApp->getQuery()
      ->condition('developerId', $developerId);
    $entityIds = $query->execute();
    $developerApps = $storageDeveloperApp->loadMultiple($entityIds);
    return $developerApps;
  }

  /**
   *  Fetch Normal/Smart App Details wrt app_id .
   */
  public function   fetchAppDetials($app_id) {

    $entity = \Drupal::entityTypeManager()
      ->getStorage("developer_app")
      ->load($app_id);
    $app_details['app_name'] = $entity->get('displayName')
      ->get(0)
      ->getValue()['value'];

    // Get app type public or confidentials.
    if ($entity->get('field_app_type')->get(0)) {
      $app_details['field_app_type'] = $entity->get('field_app_type')
        ->get(0)
        ->getValue()['value'];
    }

    // Get app type normal or smart.
    if ($entity->get('field_fhir_app_type')
        ->get(0)
        ->getValue()['value'] == 'smart') {
      $app_details['field_smart_launch_url'] = $entity->get('field_smart_launch_url')->get(0) ? $entity->get('field_smart_launch_url')->get(0)->getValue()['value'] : '';
    }

    // Get redirect url
    if ($entity->get('field_jwks_uri')->get(0)) {
      $app_details['field_jwks_uri'] = $entity->get('field_jwks_uri')
        ->get(0)
        ->getValue()['value'];
    }

    // Get redirect url
    if ($entity->get('field_redirect_url')->get(0)) {
      $app_details['field_redirect_url'] = $entity->get('field_redirect_url')
        ->get(0)
        ->getValue()['value'];
    }

    if ($entity->get('field_fhir_version')->get(0)) {
      $app_details['field_fhir_version'] = $entity->get('field_fhir_version')
        ->get(0)
        ->getValue()['value'];
    }

    if ($entity->get('field_fhir_app_type')->get(0)) {
      $app_details['field_fhir_app_type'] = $entity->get('field_fhir_app_type')
        ->get(0)
        ->getValue()['value'];
    }
    if ($entity->get('field_fhir_server_id')->get(0)) {
      $app_details['fhir_server_id'] = $entity->get('field_fhir_server_id')
        ->get(0)
        ->getValue()['value'];
    }

    // Scopes for normal and smart app
    if ($entity->get('field_standard_scopes')->get(0)) {
      $app_details['field_standard_scopes'] = $entity->get('field_standard_scopes')
        ->get(0)
        ->getValue()['value'];
    }
    if ($entity->get('field_patient_scopes')->get(0)) {
      $app_details['field_patient_scopes'] = $entity->get('field_patient_scopes')
        ->get(0)
        ->getValue()['value'];
    }
    if ($entity->get('field_user_scopes')->get(0)) {
      $app_details['field_user_scopes'] = $entity->get('field_user_scopes')
        ->get(0)
        ->getValue()['value'];
    }
    return $app_details;

  }

    /*
   * Funtion to get fhirservername.
   */

    public function getFhirServerName($nid)
    {
        $query = \Drupal::database()->select('node_field_data', 'n');
        $query->fields('n', ['title']);
        $query->condition('n.nid', $nid);
        $query->condition('n.status', '1');
        $query->condition('n.type', 'fhir_servers');
        $server_nodes = $query->execute()->fetchAll();
        foreach ($server_nodes as $titles) {
            $node_title[$titles->nid] = $titles->title;
        }
        return $titles->title;
    }

}
/**
 *  function to delete the product for the existing app.
 */
function _unset_products($app_id) {
  $entity = \Drupal::entityTypeManager()->getStorage("developer_app")->load($app_id);
  $credentials = $entity->getCredentials();
  $credential = reset($credentials);
  $products = $credential->getApiProducts();
  foreach($products as $product) {
    $service = new DeveloperAppCredentialController(\Drupal::service('apigee_edge.sdk_connector')
      ->getOrganization(), $entity->getDeveloperId(), $entity->getName(), \Drupal::service('apigee_edge.sdk_connector')
      ->getClient());
    $service->deleteApiProduct($credential->id(),$product->getApiproduct());
  }
}

