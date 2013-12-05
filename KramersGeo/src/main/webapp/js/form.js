'use strict';

/* Scope - forms */
(function($)
{
  var user = "admin";
  var password = "district";
  var dhis_url = "http://apps.dhis2.org/dev"

  var orgList = [];
  var orgProgram = [];
  var progList = [];
  var progOrgArray = [];
  var progStageArray = [];
  var ICD = [];
  
  /**
   * GET request to the DHIS API
   *
   * Uses JSONP. XSS compatible.
   */
  var apiGET = function(path, successCallback)
  {
    $.ajax({
      type: "GET",
      url: [dhis_url, path, '.jsonp'].join(''),
      dataType: 'jsonp',
      headers: {
        Authorization: "Basic " + btoa(user + ":" + password)
      },
      success: successCallback,
      error: function(jqXhr, textStatus, error) {
        console.log("Error GET " + path + ": " + textStatus + ", " + error);
      },
    })
  }
  
  var form_init = function()
  {
    $('#submit').click(function(ev) {
      if (Modernizr.history) {
        var state = {};
        history.pushState(state, null, link.href);
      }
      add_comment();
      //addComment();
    });
    
    if (!Modernizr.inputtypes.date) {
      $('.datepicker').datepicker();
    }
    
    $('#dynamic').on('click', '#map', function(ev) {
      ev.stopImmediatePropagation()
      $(this).toggleClass('active')
      $('body').toggleClass('map', $(this).hasClass('active'));
      geolocate_toggle(false)
    });
    
    $('#dynamic').on('click', '#geolocate', function(ev) {
      ev.stopImmediatePropagation()
      $(this).toggleClass('active')
      geolocate_toggle($(this).hasClass('active'))
    });
  }

  var org_init = function()
  {
    apiGET("/api/organisationUnits", function (data) {
      $.each(data.organisationUnits, function(key, val) {
        var opt = { label: val.name, value: val.id };
        orgList.push(opt);
      });
      //console.log("OrganisationUnits loaded");
    });
  }
  
  var programs_init = function()
  {
    /**
     * searchForPrograms
     * searches for programs for currently selected organisation, fills them into currentProgs
     */
    var org_selected = function(orgName, orgId)
    {
      var programs = orgProgram[orgId]
      var sel = $('<optgroup />')
          
      sel.attr('label', orgName)
          
      for (var i = 0; i < programs.length; i++) {
        var opt = document.createElement('option');
          
        opt.innerHTML = progList[i].label;
        opt.value = i;
        sel.append(opt);
      }
      
      $('#progName').html(sel)
      sel.trigger('change')
    }
    
    var programs_loaded = function()
    {
      $('#orgName').autocomplete({
        source: orgList,
        autoFocus: true,
        select: function (ev, ui) {
          /* Inhibit jquery from writing id value in field */
          ev.preventDefault()

          /* Fill field with name of organization */
          $('#orgName').val(ui.item.label)
          $('#orgId').val(ui.item.value)

          /* name, id */
          org_selected(ui.item.label, ui.item.value)
        }
      })
      
      $('#orgName').click(function(event, ui) {
        $(this).autocomplete('search', " ");
      })
    }

    /**
     * 
     */
    var getOrgProg = function (i) {
      progOrgArray[i] = [];
      progStageArray[i] = [];
      
      if (!progList[i].value) {
        console.log("progList[i] invalid, i = " + i)
        return;
      }

      apiGET("/api/programs/" + progList[i].value, function (data) {
        $.each(data.organisationUnits, function(key, val) {
          if (!orgProgram[val.id]) {
             orgProgram[val.id] = [];
           }
            
          orgProgram[val.id][i] = i;
          progOrgArray[i].push(val)
        });
          
        $.each(data.programStages, function(key, val) {
          progStageArray[i].push(val.id);
        });
      });
    }

    /**
     * Loads information about what organisations is connected to each program
     */
    var loadProgOrgs = function () {
      progOrgArray = new Array(progList.length);
      for (var i = 0; i < progList.length; i++) {
        getOrgProg(i);
      }
    }
    
    apiGET("/api/programs", function (data) {
      $.each(data.programs, function(key, val) {
        var opt = { label: val.name, value: val.id };
        progList.push(opt);
      });
        
      loadProgOrgs();
      programs_loaded()
    });
  };
  
  /**
   * Parse all script-tags with template-class, expect ID of script-tag
   * to start with 'template-' (for semantics), which will be stripped away
   * in the compiled template stored in templates[].
   */
  var draw_form = function()
  {
    var oldForm =$('#dynamic')
    var form = oldForm.clone(true, false)
    var templates = [];
    $('.template').each(function(i, tmp) {
      tmp = $(tmp)
      templates[tmp.attr('id').substring(9)] = _.template(tmp.html())
    })
    
    form.append(templates['age_gender']({}))
    
    form.append(templates['location']({
      name: 'location'
    }))
    
    form.append(templates['text']({
      name: 'icd',
      label: 'ICD'
    }))
    
    $("#icd").autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(ICD, request.term);
        response(results.slice(0, 10));
      }
    });
    form.append(templates['date']({
      name: 'admissiondate',
      label: 'Admission'
    }))
    
    form.append(templates['date']({
      name: 'admissiondate',
      label: 'Discharge'
    }))
    
    form.append(templates['dischargemode']({
      label: 'Discharge mode'
    }))
    
    form.append(templates['longText']({
      label: 'Comment',
      name: 'comment'
    }))
    
    oldForm.replaceWith(form)
  }
  
  /**
   * Should send data in json format
   */
  var sendEvent = function (data) {
    /*
     var data = {
     "program": selectedOrg,
     "orgUnit": selectedProg,
     "eventDate": "2013-05-17",
     "status": "COMPLETED",
     "storedBy": user,
     "coordinate": {"latitude": "59.8", "longitude": "10.9"},
     "dataValues": []
     };
     */
    
    alert("sendEvent: "+data);
    $.ajax({
      type: "POST",
      url: dhis_url + "api/events",
      dataType: 'json',
      //need contenttype?
      headers: {
        Authorization : "Basic " + btoa(user+":"+password)
      },
      data: data,
      success: function() {
        console.log("Sent event");
      },
      error: function(jqXhr, textStatus, error) {
        console.log("Error sendEvent: " + textStatus + ", " + error);
      },
    });
  }
  
  var program_stage_load = function()
  {
    
  }
  
  var program_stage_select = function(ev)
  {
    var selectedProg = $(this).val()
    var stages = progStageArray[selectedProg];
    
    $(stages).each(function(i, stage) {
      apiGET("/api/programStages/" + stage, function (data) {
        
        /* Got stages for this program */
        $.each(data.programStageDataElements, function() {
          var dId = this.dataElement.id;
          
          /* Fetch each dataElement in the programStage */
          apiGET("/api/dataElements/" + dId, function (dataElement) {
            console.log(dataElement)
          })
        })
      })
    })
  }
  
  /**
   * DOM loaded
   */
  $(function ()
  {
    form_init()
    org_init()
    programs_init()
    draw_form()
    maps_init()
    
    $('#progName').change(program_stage_select)
  });

})($)