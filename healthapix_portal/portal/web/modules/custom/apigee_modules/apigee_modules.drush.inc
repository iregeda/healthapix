<?php

use Drupal\context\Entity\Context;
use Drupal\Core\Database\Database;
use Drupal\migrate_custom\Controller\MigrationSummary;
use Drupal\migrate\MigrateExecutable;
use Drupal\user\Entity\User;
use Symfony\Component\Process\Process;

/**
 * @file Contains the code to generate the custom drush commands.
 */
/**
 * Implements hook_drush_command().
 */
function apigee_modules_drush_command() {
  $items = [];
  $items['enable_modules'] = [
    'description' => 'Enables the required modules for Apigee Migration',
    'drupal dependencies' => ['apigee_modules'],
    'aliases' => ['enable:modules'],
  ];
  $items['enable_context'] = [
    'description' => 'CLone all context from D7',
    'drupal dependencies' => ['apigee_modules'],
    'aliases' => ['enable:context'],
  ];
  $items['first_last_name'] = [
    'description' => 'Save first and last name of isers',
    'drupal dependencies' => ['apigee_modules'],
    'aliases' => ['names:users'],
  ];
  return $items;
}


/**
 * Call back function drush_apigee_modules_count_entities()
 * The call back function name in the following format
 *   drush_{module_name}_{item_id_for_command}()
 */
function drush_apigee_modules_first_last_name() {
  Database::setActiveConnection('migrate');
  // Get a connection going to get DS id.
  $db = Database::getConnection();
  $query = $db->select('field_data_field_first_name', 'fn');
  $query->leftJoin('field_data_field_last_name', 'ln', 'fn.entity_id = ln.entity_id');
  $query->fields('fn', ['field_first_name_value', 'entity_id']);
  $query->fields('ln', ['field_last_name_value']);
  $users = $query->execute()->fetchAll(\PDO::FETCH_ASSOC);
  // Set back D8 database active.
  Database::setActiveConnection();
  drush_print_r($users);
  foreach ($users as $user) {
    $uid = $user['entity_id'];
    $user_load = User::load($uid);
    if ($user_load) {
      if (isset($user['field_first_name_value'])) {
        $user_load->set('first_name', $user['field_first_name_value']);
      }
      if (isset($user['field_last_name_value'])) {
        $user_load->set('last_name', $user['field_last_name_value']);
      }
      $user_load->save();
    }
  }

}

/**
 * Call back function drush_apigee_modules_enable_modules()
 * The call back function name in the following format
 *   drush_{module_name}_{item_id_for_command}()
 */
function drush_apigee_modules_enable_modules() {
  $modules = [
    'admin_toolbar',
    'admin_toolbar_tools',
    'apigee_edge',
    'autologout',
    'block_class',
    'captcha',
    'commerce',
    'commerce_price',
    'commerce_product',
    'content_access',
    'context',
    'ctools',
    'devel',
    'devel_php',
    'eck',
    'entity_reference_revisions',
    'environment_indicator',
    'faq',
    'google_analytics',
    'ldap',
    'libraries',
    'mailsystem',
    'markdown',
    'mediaelement',
    'metatag',
    'migrate_plus',
    'migrate_tools',
    'mimemail',
    'pathauto',
    'profile',
    'readonlymode',
    'recaptcha',
    'redirect',
    'redis',
    'remote_stream_wrapper',
    'rules',
    'services',
    'smtp',
    'state_machine',
    'swagger_ui_formatter',
    'token',
    'views_accordion',
    'views_bulk_operations',
    'views_slideshow',
    'webform',
    // Finish install required modules after downloading dependencies.
    'commerce_cart',
    'commerce_order',
    'commerce_product',
  ];
  foreach ($modules as $module) {
    $process = new Process('composer require drupal/' . $module . ' --no-update');
    $process->mustRun();
    if ($process->getOutput()) {
      drush_print(t($process->getOutput()));
      drush_print(t('Successfully installed @module', ['@module' => $module]));
    }
    drush_print_r($process->getErrorOutput());
//    $module_process = new Process('drush dl ' . $module . ' -y');
//    $module_process->Run();
//    if ($module_process->getOutput()) {
//      drush_print(t($module_process->getOutput()));
//      drush_print(t('Successfully Downloaded @module', ['@module' => $module]));
//    }
  }
  $config = \Drupal::configFactory()->getEditable('system.performance');
  $config->set('js.preprocess', 0);
  $config->set('css.preprocess', 0);
  $config->save();
  $config = \Drupal::configFactory()->getEditable('system.file');
  $config->set('path.temporary', '/tmp');
  $config->save();
  // Download required libraries
  $libraries = [
    'swagger_ui' => "https://api.github.com/repos/swagger-api/swagger-ui/releases/latest",
    'php-markdown' => "https://github.com/michelf/php-markdown/archive/1.8.0.tar.gz",
  ];
  foreach ($libraries as $library_name => $url) {
    $releases = file_get_contents($url, FALSE);
    $releases = json_decode($releases);
    if ($releases) {
      $download_url = $releases->tarball_url;
    }
    else {
      $download_url = $url;
    }
    $temp_dir = drush_tempdir();
    drush_print_r("Downloading Swagger library");
    $temp_filepath = $temp_dir . '/' . basename(current(explode('?', $download_url, 2)));
    drush_download_file($download_url, $temp_filepath);
    // Extract ZIP archive.
    $download_location = DRUPAL_ROOT . "/libraries/$library_name";
    drush_print_r("Extracting to $download_location");
    // Extract to temp location.
    $temp_location = drush_tempdir();
    if (!drush_tarball_extract($temp_filepath, $temp_location)) {
      drush_set_error("Unable to extract $library_name");
    }
    $files = scandir($temp_location);
    unset($files[0], $files[1]);
    if ((count($files) == 1) && is_dir($temp_location . '/' . current($files))) {
      $temp_location .= '/' . current($files);
    }
    drush_move_dir($temp_location, $download_location);
    if (file_exists($temp_filepath)) {
      drush_delete_dir($temp_filepath, TRUE);
    }
  }
}


/**
 * Call back function drush_apigee_modules_count_entities()
 * The call back function name in the following format
 *   drush_{module_name}_{item_id_for_command}()
 */
function drush_apigee_modules_enable_context() {
  Database::setActiveConnection('migrate');
  // Get a connection going to get DS id.
  $db = Database::getConnection();
  $query = $db->select('context', 'c')
    ->fields('c');
  $context = $query->execute()->fetchAll(\PDO::FETCH_ASSOC);
  // Set back D8 database active.
  Database::setActiveConnection();
  $node_conditions = [];
  $path_conditions = [];
  $user_conditions = [];
  drush_print_r($context);
  foreach ($context as $data) {
    $context_load = Context::load($data['name']);
    $conditions = unserialize($data['conditions']);
    $reactions = unserialize($data['reactions']);
    if ($conditions) {
      if (isset($conditions['node'])) {
        $node_conditions['id'] = 'node_type';
        $node_conditions['bundles'] = $conditions['node']['values'];
        $context_load->addCondition($node_conditions);
      }
      $paths = [];
      if (isset($conditions['path'])) {
        $path_conditions['id'] = 'request_path';
        foreach ($conditions['path']['values'] as $path) {
          if ($path != "<front>") {
            $path = '/' . $path;
          }
          $paths[$path] = $path;
        }
        $default_include = implode("\r\n", $paths);
        //        drush_print_r($default_include);
        $path_conditions['pages'] = $default_include;
        $context_load->addCondition($path_conditions);
      }
      if (isset($conditions['user'])) {
        $user_conditions['id'] = 'user_role';
        if (isset($conditions['user']['values']['anonymous user'])) {
          $conditions['user']['values']['anonymous'] = 'anonymous';
          unset($conditions['user']['values']['anonymous user']);
        }
        if (isset($conditions['user']['values']['authenticated user'])) {
          $conditions['user']['values']['authenticated'] = 'authenticated';
          unset($conditions['user']['values']['authenticated user']);
        }
        $user_conditions['roles'] = $conditions['user']['values'];
        $context_load->addCondition($user_conditions);
      }
    }
    if ($reactions) {
      //        drush_print_r($reactions);
    }
    $context_load->save();

  }
}
