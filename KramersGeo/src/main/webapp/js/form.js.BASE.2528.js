'use strict';

/* Scope - forms */
(function($)
{
  var user = "admin";
  var password = "district";
  var dhis_url = "http://apps.dhis2.org/dev"
  var latitude = "";
  var longitude = "";
  var selectedProg = "";
  var selectedOrg = "";

  var orgList = [];
  var orgProgram = [];
  var progList = [];
  var progOrgArray = [];
  var progStageArray = [];
  var optionSets = {};
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
        history.pushState(state, null, this.href);
      }
      //add_comment();
      sendEvent();
    });
    
    if (!Modernizr.inputtypes.date) {
      $('.datepicker').datepicker();
    }
  }

  var org_init = function()
  {
    apiGET("/api/organisationUnits", function (data) {
      for (var i = 0; i <= data.pager.pageCount; i++) {
        $.ajax({
          type: "GET",
          url: dhis_url + "/api/organisationUnits?page="+i,
          dataType: 'json',
          headers: {
            Authorization: "Basic " + btoa(user + ":" + password)
          },
          success: function(data) {
            $.each(data.organisationUnits, function(key, val) {
              var opt = { label: val.name, value: val.id };
              orgList.push(opt);
            });
          },
          error: function(jqXhr, textStatus, error) {
            console.log("Error GET " + path + ": " + textStatus + ", " + error);
          },
        })
      };
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
        source: function(request, response) {
          var results = $.ui.autocomplete.filter(orgList, request.term);
          response(results.slice(0, 10));
        },
        select: function(ev, ui) {
          ev.preventDefault()
          $('#orgName').val(ui.item.label)
          $('#orgId').val(ui.item.value)
          org_selected(ui.item.label, ui.item.value)
        }
      });
      
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
   * Don't need data in at the moment,
   */

  var sendEvent = function (data) {
    var jsonData = {}; //Create's a empty variable, to be filled.
    jsonData["program"] = selectedProg; //Må sette selectedProg når vi henter prog's
    jsonData["orgUnit"] = selectedOrg; //Må sette selectedOrg når vi henter org's
    jsonData["eventDate"] = "2013-05-17"; //eksemempel
    jsonData["status"] = "COMPLETED";
    jsonData["storedBy"] = user;
    //have to store the location, when it gets set
    jsonData["coordinate"] = {"latitude": latitude, "longitude": longitude};
    jsonData["dataValues"] = [];

    //alert(JSON.stringify(jsonData));
    var formElement = new Array();
    $("form :input").each(function(){
        formElement.push($(this));
        console.log($(this).attr("id") + ": " + $(this).val())
    })
    console.log("Form length : " + formElement.length);
    alert("yolo");
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
    
    alert("sendEvent: "+jsonData);
    $.ajax({
      type: "POST",
      url: dhis_url + "api/events",
      dataType: 'json',
      //need contenttype?
      headers: {
        Authorization : "Basic " + btoa(user+":"+password)
      },
      data: JSON.stringify(jsonData),
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
    
    var dataelement_complete = function (dataElement, optionSet)
    {
      console.log('complete dataelement')
      console.log(dataElement)
      console.log(optionSet)
    }
    
    $(stages).each(function(i, stage) {
      apiGET("/api/programStages/" + stage, function (data) {
        
        /* Got stages for this program */
        $.each(data.programStageDataElements, function() {
          var dId = this.dataElement.id;
          
          /* Fetch each dataElement in the programStage */
          apiGET("/api/dataElements/" + dId, function (dataElement) {
            if (dataElement.optionSet == null) {
              dataelement_complete(dataElement, [])
            } else {
							var optId = dataElement.optionSet.id;
              
              if (!optionSets[optId]) {
                apiGET("/api/optionSets/" + optId, function (data) {
                  var optionSet = [];
                  
									$.each(data.options, function(i, option) {
                    optionSet.push(option)
									})

                  /* Save for reuse */
                  optionSets[optId] = optionSet;
                  
                  dataelement_complete(dataElement, optionSet)
								})                
              } else {
                var optionSet = optionSets[optId];
                
                dataelement_complete(dataElement, optionSet)
              }
            }
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
    $('#progName').change(program_stage_select)
  });

})($)