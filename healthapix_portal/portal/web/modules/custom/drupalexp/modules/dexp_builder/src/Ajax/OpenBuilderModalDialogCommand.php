<?php

namespace Drupal\dexp_builder\Ajax;

use Drupal\Core\Ajax\OpenDialogCommand;

class OpenBuilderModalDialogCommand extends OpenDialogCommand {

  /**
   * Constructs an OpenModalDialog object.
   *
   * The modal dialog differs from the normal modal provided by
   * OpenDialogCommand in that a modal prevents other interactions on the page
   * until the modal has been completed. Drupal provides a built-in modal for
   * this purpose, so no selector needs to be provided.
   *
   * @param string $title
   *   The title of the dialog.
   * @param string|array $content
   *   The content that will be placed in the dialog, either a render array
   *   or an HTML string.
   * @param array $dialog_options
   *   (optional) Settings to be passed to the dialog implementation. Any
   *   jQuery UI option can be used. See http://api.jqueryui.com/dialog.
   * @param array|null $settings
   *   (optional) Custom settings that will be passed to the Drupal behaviors
   *   on the content of the dialog. If left empty, the settings will be
   *   populated automatically from the current request.
   */
  public function __construct($title, $content, array $dialog_options = array(), $settings = NULL) {
    $dialog_options['modal'] = TRUE;
    parent::__construct('#dexp-builder-modal', $title, $content, $dialog_options, $settings);
  }

}
