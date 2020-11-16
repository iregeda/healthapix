(function ($, Drupal) {
  window.onload = function() {
    var default_server_value = $('#edit-fhir-server .mdc-list-item.mdc-list-item--selected').text().trim();
    var version = default_server_value.split("_");
    // var version_name = version[0].toUpperCase();
    var version_name = $('#fhir-smart-app .mdc-list li.mdc-list-item.mdc-list-item--selected').attr('data-version-name');
    if(version_name.length == 0) {
      version_name = $('#fhir-app-edit .mdc-list li.mdc-list-item.mdc-list-item--selected').attr('data-version-name');
    }

    $("#edit-user-scopes .fieldset-wrapper, #edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');

    $( "#edit-user-scopes .fieldset-wrapper div.mdc-data-table__row.user-field-op, #edit-patient-scopes .fieldset-wrapper div.mdc-data-table__row.user-field-op" ).each(function( index ) {
      var version_attr = $( this ).attr('data-vname').split("$#");
      var row_hide = true;
      for ( var i = 0, l = version_attr.length; i < l; i++ ) {
        var version_name_attr = version_attr[i];
        if(version_name_attr === version_name) {
          row_hide = false;
        }
      }
      if(row_hide) {
        $( this ).addClass('hide');
      }

    });

    // $("#edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');
    // $( "#edit-patient-scopes .fieldset-wrapper div.mdc-data-table__row.user-field-op" ).each(function( index ) {
    //   var version_attr = $( this ).attr('data-vname').split("$#");
    //   var row_hide = true;
    //   for ( var i = 0, l = version_attr.length; i < l; i++ ) {
    //     var version_name_attr = version_attr[i];
    //     if(version_name_attr === version_name) {
    //       row_hide = false;
    //     }
    //   }
    //   if(row_hide) {
    //     $( this ).addClass('hide');
    //   }
    //
    // });
    // $("#edit-user-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op[data-vname !='" + version_name + "']").addClass('hide');


    // $("#edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');
    // $("#edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op[data-vname !='" + version_name + "']").addClass('hide');

  };
  Drupal.behaviors.fhir_apps = {
    attach: function (context, settings) {
      $('.form-item-fhir-server #mdc-select-ul li', context).bind('click', function(j) {

        var selected_server = $(this).text().trim();
        var res = selected_server.split("_");
        //var version_name = res[0].toUpperCase();
        var version_name = $(this).attr('data-version-name');

        $("#edit-user-scopes .fieldset-wrapper, #edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');

        $( "#edit-user-scopes .fieldset-wrapper div.mdc-data-table__row.user-field-op, #edit-patient-scopes .fieldset-wrapper div.mdc-data-table__row.user-field-op" ).each(function( index ) {
          var version_attr = $( this ).attr('data-vname').split("$#");
          var row_hide = true;
          for ( var i = 0, l = version_attr.length; i < l; i++ ) {
            var version_name_attr = version_attr[i];
            if(version_name_attr === version_name) {
              row_hide = false;
            }
          }
          if(row_hide) {
            $( this ).addClass('hide');
          }

        });

        // $("#edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');
        // $( "#edit-patient-scopes .fieldset-wrapper div.mdc-data-table__row.user-field-op" ).each(function( index ) {
        //   var version_attr = $( this ).attr('data-vname').split("$#");
        //   var row_hide = true;
        //   for ( var i = 0, l = version_attr.length; i < l; i++ ) {
        //     var version_name_attr = version_attr[i];
        //     if(version_name_attr === version_name) {
        //       row_hide = false;
        //     }
        //   }
        //   if(row_hide) {
        //     $( this ).addClass('hide');
        //   }
        //
        // });


        // $("#edit-user-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');
        // $("#edit-user-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op[data-vname !='" + version_name + "']").addClass('hide');
        //
        //
        // $("#edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op").removeClass('hide');
        // $("#edit-patient-scopes .fieldset-wrapper").find("div.mdc-data-table__row.user-field-op[data-vname !='" + version_name + "']").addClass('hide');

      });
    }
  };
})(jQuery, Drupal);
