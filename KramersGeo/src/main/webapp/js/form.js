'use strict';

/* Scope - forms */
(function($)
{
  var dhis_username = "admin"
  var dhis_password = "district"
  //var dhis_url = "//admin:district@apps.dhis2.org/dev/api/"
  var dhis_url = "//folk.uio.no/kennetkl/KramersGeo/cache/index.php/"

  var orgList = [];
  var orgProgram = [];
  var progList = [];
  var progOrgArray = [];
  var progStageArray = [];
  var optionSets = {};
  var ICD = [];
  var apiGETqueue = {};
  var templates = [];
  
  /**
   * GET request to the DHIS API
   *
   * Uses JSONP. XSS compatible.
   */
  var apiGET = function(path, successCallback)
  {
    /* Caching-unique UUID */
    var uuid = 'cb_' + encodeURI(path.replace(/[\/?@&=+$#]/g, "_"))
    
    /* Callback queue exists? */
    if (apiGETqueue[uuid] != null) {
      apiGETqueue[uuid].push(successCallback)
      return
    }
    
    /* New queue initialized with given callback */
    apiGETqueue[uuid] = [successCallback]
    
    /**
     * JSONP does not support custom headers due to limitations of <script>-tag.
     * DHIS API does not support cross-site requests
     * DHIS API does not (properly) support HTTP authentication, but redirects
     * API requests to an HTML login screen.
     */
    $.ajax({
      type: "GET",
      url: [dhis_url, path, '.json'].join(''),
      //dataType: 'jsonp',
      dataType: 'json',
      jsonpCallback: uuid,
      cache: true,
      crossDomain: true,
      headers: {
        Authorization: "Basic "+ btoa([dhis_username,dhis_password].join(':'))
      },
      /*
      xhrFields: {
        withCredentials: true
      },
      username: dhis_username,
      password: dhis_password,
      */
      success: function (data) {
        var queue = apiGETqueue[uuid]
        delete apiGETqueue[uuid]
        
        $.each(queue, function (i, f) {
          f(data)
        })
      },
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
  }

  var org_init = function()
  {
    apiGET("organisationUnits", function (data) {
      for (var i = 0; i <= data.pager.pageCount; i++) {
        apiGET("organisationUnits?page=" + i, function (data) {
          $.each(data.organisationUnits, function(key, val) {
            var opt = { label: val.name, value: val.id };
            orgList.push(opt);
          })
        })
      }
    })
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
      
      $.each(programs, function(i, program) {
        var opt = document.createElement('option');
          
        opt.innerHTML = progList[i].label;
        opt.value = i;
        sel.append(opt);
      })
      
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

      apiGET("programs/" + progList[i].value, function (data) {
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
    
    apiGET("programs", function (data) {
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
  var templates_init = function ()
  {
    $('.template').each(function(i, tmp) {
      tmp = $(tmp)
      templates[tmp.attr('id').substring(9)] = _.template(tmp.html())
    })
  }
  
  var templates_test = function()
  {
    var oldForm = $('#dynamic')
    var form    = oldForm.clone(false)
    
    form.append(templates['age_gender']({
      compulsory: false
    }))
    
    form.append(templates['location']({
      name: 'location',
      compulsory: false      
    }))
    
    form.append(templates['text']({
      name: 'icd',
      label: 'ICD',
      compulsory: false
    }))
    
    $("#icd").autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(ICD, request.term);
        response(results.slice(0, 10));
      }
    });
    form.append(templates['date']({
      name: 'admissiondate',
      label: 'Admission',
      compulsory: false
    }))
    
    form.append(templates['date']({
      name: 'admissiondate',
      label: 'Discharge',
      compulsory: false
    }))
    
    form.append(templates['dischargemode']({
      label: 'Discharge mode',
      compulsory: false
    }))
    
    form.append(templates['longText']({
      label: 'Comment',
      name: 'comment',
      compulsory: false
    }))
    
    oldForm.replaceWith(form)
  }
  
  /**
   * Should send data in json format
   * Don't need data in at the moment,
   */

  var sendEvent = function (data) {
    var longitude = "";
    var latitude = "";
    var jsonData = {}; //Create's a empty variable, to be filled.
    jsonData["program"] = $("#progName").attr("value");
    jsonData["orgUnit"] = $("#orgName").attr("value"); 
    jsonData["eventDate"] = "2013-05-17"; //eksemempel
    jsonData["status"] = "COMPLETED";
    jsonData["storedBy"] = user;
    //have to store the location, when it gets set
    jsonData["coordinate"] = {"latitude": latitude, "longitude": longitude};
    jsonData["dataValues"] = [];

    $("form :input").each(function(){
      //må luke bort visse elementer- Blant annet looper vi nå over hver enkelt radio button ...
      //Use something like $(this).is(':checked')
        programData["dataValues"].push("dataElement" + ": " +  $(this).attr("name")+ ", " + "value" + ": " + $(this).val());
        console.log($(this).attr("id") + ": " + $(this).attr("name") + ": " + $(this).val());
    })
    alert(JSON.stringify(jsonData));

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
    var stages = progStageArray[selectedProg]
    /* Clone dynamic-div element, but not children */
    var newForm = $('<div id=dynamic />')
    var newFormElmRemaining = 0
    
    /* Initialize dataelement DOM context for consistent ordering */
    var dataelement_init = function (stageElement)
    {
      
      var element = $('<div />').attr('id', stageElement.dataElement.id)
      
      if (stageElement.compulsory) {
        element.addClass('compulsory')
      }
      
      newFormElmRemaining++
      newForm.append(element)
      return element
    }
    
    /* Draw complete dataelement; optionally render form */
    var dataelement_complete = function (dataElement, optionSet, newElement)
    {
//      console.log(dataElement)
      
      //console.log(optionSet)
      var template = templates['text'];
      
      if (dataElement.type == 'date') {
        template = templates['date']
      } else if (dataElement.type == 'int') {
        template = templates['number']        
      } else {
      }
      
      if (dataElement.name == 'Gender') {
        template = templates['age_gender']
      } else if (dataElement.name == 'Age') {
        template = templates['dummy']
      }
      
      if (dataElement.name == 'Mode of Discharge') {
        template = templates['dischargemode']
      }
      
      newElement.replaceWith(template({
        name: dataElement.id,
        label: dataElement.formName || dataElement.name,
        data: dataElement,
        options: optionSet,
        compulsory: newElement.hasClass('compulsory')
      }))
      
      newFormElmRemaining--
      
      /* Render form if complete */
      if (newFormElmRemaining == 0) {
        /* Replace document dynamic-div */
        $('#dynamic').replaceWith(newForm)
      }
    }
    
    $(stages).each(function(i, stage) {
      apiGET("programStages/" + stage, function (data) {
        
        
        /* Got stages for this program */
        $.each(data.programStageDataElements, function() {
          var dId = this.dataElement.id;
          
          var newElement = dataelement_init(this)
          
          /* Fetch each dataElement in the programStage */
          apiGET("dataElements/" + dId, function (dataElement) {
            /* Expection from loading ICD optionSet due to size/processing */
            if (dataElement.optionSet == null ||
                dataElement.optionSet.name == 'Diagnosis ICD10') {
              dataelement_complete(dataElement, [], newElement)
            } else {
							var optId = dataElement.optionSet.id;
              
              /* First request for this optionSet? */
              if (optionSets[optId] == null) {
                apiGET("optionSets/" + optId, function (data) {
                  var optionSet = [];
                  
                  $.each(data.options, function(i, option) {
                    optionSet.push(option)
                  })
                    
                  dataelement_complete(dataElement, optionSet, newElement)

                  /* Save for reuse */
                  optionSets[optId] = optionSet;
                })
              } else {
                var optionSet = optionSets[optId];
                
                dataelement_complete(dataElement, optionSet, newElement)
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
    templates_init()
    templates_test()
    
    $('#progName').change(program_stage_select)
  });

})($)