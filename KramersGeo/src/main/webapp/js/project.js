//'use strict';

$(function() {
    $( "#orgName" ).autocomplete({
        source: orgList,
        autoFocus: true,
        select: function( event, ui ) {
            event.preventDefault();
            selectedOrg = ui.item.label;
            $( "#orgName" ).val( ui.item.label );
            // $( "#orgId" ).val( ui.item.value );
        }
    }).click(function( event, ui ) {
        $(this).autocomplete('search', " ");
    });
});

$(function() {
    $( "#progName" ).autocomplete({
        source: progList,
        autoFocus: true,
        select: function( event, ui ) {
            event.preventDefault();
            selectedProg = ui.item.label;
            $( "#progName" ).val( ui.item.label );
            // $( "#progId" ).val( ui.item.value );
        }
    }).click(function( event, ui ) {
        $(this).autocomplete('search', " ");
    });
});

$("#icd").autocomplete({
    source: function(request, response) {
        var results = $.ui.autocomplete.filter(ICD, request.term);
        response(results.slice(0, 10));
    }
});

/* Siden fungerer bare dersom du bruker Chrome/Chromium med --disable-web-security*/

var orgList = [];
var progList = [];
var progOrgArray = [];
var progStageArray = [];
var ICD = [];
var selectedOrg;
var selectedProg;

var user = "admin";
var password = "district";
var url = "";
var dhis_url = "http://apps.dhis2.org/dev/"


//if user just want to get location from browser
function geolocate_toggle(enabled) {
	if (!Modernizr.geolocation) {
		alert('Geolocation is not supportet by your byrowse, you can mark your position by choosing the pin tool')
    return;
  }

	var option = {frequency: 500, maximumAge: 0, timeout: 10000, enableHighAccuracy:true};

  var geo_found = function (pos) {
    /* Location found */
    $('#lat').val(pos.coords.latitude)
    $('#lng').val(pos.coords.longitude)
    $('#location').val('Current position')
  }

  var geo_error = function (err) {
    if (err == 1) {
  	  alert("you have not allowed access to your location");
	  } else if (err == 2) {
	  	alert("the network is down or the positioning satellites can’t be contacted, you can mark your position by choosing the pin tool");
	  } else { // err == 3rt("stud
	  	alert("network is up but it takes too long to calculate the user’s position, you can mark your position by choosing the pin tool");
	  }
  }

  $('#location')
    .toggleClass('current-location', enabled)
    .attr('readonly', enabled)
  
  $('#geolocate')
    .toggleClass('active', enabled)

  if (enabled) {
    navigator.geolocation.getCurrentPosition(geo_found, geo_error, option)
  } else {
    if ($('#location').val() == 'Current position') {
      $('#location').val('')
    }
  }
}

$(function() {
    $( "#orgName" ).autocomplete({
        source: orgList,
        autoFocus: true,
        select: function( event, ui ) {
            event.preventDefault();
            selectedOrg = ui.item.label;
            $( "#orgName" ).val( ui.item.label );
            searchForPrograms();	//fills in available programs for selected org
   		}
    }).click(function( event, ui ) {ICD
        $(this).autocomplete('search', " ");
    });
});


function getSelectedProg() {
	selectedProg = document.getElementById('progName').value;
	getProgramStage();
}
/* TODO: show the label
$(function() {
	$( "#orgName" ).autocomplete({r
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(orgList, request.term);
			var res = results.slice(0.10);
			response(results.slice(0, 10), function(item) {
				return {
					label: item.label,
					value: item.value
				}
			});
		}
	}).click(function( event, ui ) {
		$(this).autocomplete('search', " ");
	});
});*/

$(function() {
  /* Parse all script-tags with template-class, expect ID of script-tag
   * to start with 'template-' (for semantics), which will be stripped away
   * in the compiled template stored in templates[].
   */
  var dynamic = $('#dynamic')
  var templates = [];
  $('.template').each(function(i, tmp) {
    tmp = $(tmp)
    templates[tmp.attr('id').substring(9)] = _.template(tmp.html())
  })
  
  dynamic.append(templates['age_gender']({}))
  
  dynamic.append(templates['location']({
    name: 'location'
  }))
  
  dynamic.append(templates['text']({
    name: 'icd',
    label: 'ICD'
  }))
  
	$("#icd").autocomplete({
	  source: function(request, response) {
	    var results = $.ui.autocomplete.filter(ICD, request.term);
	    response(results.slice(0, 10));
	  }
	});
  
  dynamic.append(templates['date']({
    name: 'admissiondate',
    label: 'Admission'
  }))
  
  dynamic.append(templates['date']({
    name: 'admissiondate',
    label: 'Discharge'
  }))
  
  dynamic.append(templates['dischargemode']({
    label: 'Discharge mode'
  }))
  
  dynamic.append(templates['longText']({
    label: 'Comment',
    name: 'comment'
  }))

  loadPrograms();
  loadOrganisations();
  //loadICD()
  //disableDialog()
});

$(function() {
	$('#submit').click(function(ev) {
		if (Modernizr.history) {
	 		var state = {};
			history.pushState(state, null, link.href);
		}
		add_comment();
		//addComment();
	});
}

<<<<<<< HEAD
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

  maps_init()
=======
$("#radio").buttonset();
$( "#status" ).buttonset();
$('.datepicker').datepicker();

if (!Modernizr.inputtypes.date) {
	$('.datepicker').datepicker();
}

$('#comment').popover({
	html: true,
	title: 'Comment'
});

$('#submit').click(function(ev) {
	if (Modernizr.history) {
 		var state = {};
		history.pushState(state, null, link.href);
	}
});

$('#map').click(function(ev) {
	$('body').toggleClass('map', $(this).val());
	});
	add_map();
>>>>>>> b5a7584a9d90a885bf257900ac18084f19ff4e55
});

//Should save the comment. 
function add_comment() {
	var comment = $("#leaveComment").val();
	//here we should save the comment, and merge it with the other json data.
	//May put it in dataValues ??
	if (comment.length > 0) {
		alert($("#leaveComment").val());	
	}
	submit_form;
}

//Skal lage json-data for innsending til dhis2
function submit_form() {
	var jsonData = {}; //Create's a empty variable, to be filled.
	jsonData["program"] = selectedProg;
	jsonData["orgUnit"] = selectedOrg;
	jsonData["eventDate"] = "2013-05-17"; //eksemempel
	jsonData["status"] = "COMPLETED";
	jsonData["storedBy"] = user;
	//have to store the location, when it gets set
	jsonData["coordinate"] = {"latitude": latitude, "longitude": longitude};
	jsonData["dataValues"] = [];
	//Loop through forms and fill in dataValues
	var formCol = document.forms;
	for (var i = 0; i < document.forms.length; i++) {
		//do's this work?
		alert(formCol[i].name);
	}

	alert(JSON.strigify(jsonData));
	/* Eksempel på data
	var data = { 	
		"program": selectedOrg, 
		"orgUnit": selectedProg, 
		"eventDate": "2013-05r-17",
	 	"status": "COMPLETED", 
	 	"storedBy": user, 
	 	"coordinate": {"latitude": "59.8", "longitude": "10.9"}, 
	 	"dataValues": [] 
	};


	*/
	sendEvent(jsonData);
}

// should send data in json format
function sendEvent(data) {
	/**
	 * oppsett for å sende data til serveren
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
		data: data, //JSON.stringify?
		success: function() {
			console.log("Sent event");
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error sendEvent: " + textStatus + ", " + error);
		},
	});
}

//For testing. Skal benytte noe lignende til å kun vise riktig forms
function display(e) {	
	if (e.checked) {
		document.getElementById('test').style.display = 'block';
	} else {
		document.getElementById('test').style.display = 'none';
	}
}

//TODO: caching
function loadPrograms() {
	$.ajax({
		type: "GET",
		url: dhis_url + "api/programs/",
		dataType: 'json',
		headers: {
			Authorization : "Basic " + btoa(user+":"+password)
		},
		success: function(data) {
			$.each(data.programs, function(key, val) {
				var opt = { label: val.name, value: val.id };
				progList.push(opt);
			});
			//console.log("Programs loaded");
			loadProgOrgs();
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error loading programs: " + textStatus + ", " + error);
		},
	});
}

// TODO: caching
function loadOrganisations() {
	$.ajax({
		type: "GET",
		url: dhis_url + "api/organisationUnits/",
		dataType: 'json',
		headers: {
			Authorization : "Basic " + btoa(user+":"+password)
		},
		success: function(data) {
			$.each(data.organisationUnits, function(key, val) {
				var opt = { label: val.name, value: val.id };
				orgList.push(opt);
			});
			//console.log("OrganisationUnits loaded");
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error loading organisationUnits: " + textStatus + ", " + error);
		},
	});
}

//loads information about what organisations is connected to each program
//necesarry because the dhis2 api is stupid
function loadProgOrgs() {
	progOrgArray = new Array(progList.length);
	for (var i = 0; i < progList.length; i++) {
		getOrgProg(i);
	}
}

function getOrgProg (i) {
	progOrgArray[i] = [];
	progStageArray[i] = [];
	$.ajax({
		type: "GET",
		url: dhis_url + "api/programs/" + progList[i].value,
		dataType: 'json',
		headers: {
			Authorization : "Basic " + btoa(user+":"+password)
		},
		success: function(data) {
			$.each(data.organisationUnits, function(key, val) {
				progOrgArray[i].push(val);
			});
			$.each(data.programStages, function(key, val) {
				progStageArray[i].push(val.id);
			});
			//console.log("Prog/org connections loaded");
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error loading program/org connections: " + textStatus + ", " + error);
		},
	});
}


//TODO: caching
//url +  api/optionSets/eUZ79clX7y1.json
/*function loadICD() {
	$.ajax({
		type: "GET",
		url: dhis_url + "api/optionSets/eUZ79clX7y1",
		dataType: 'json',
		//async: false,
		headers: {
			Authorization: "Basic " + btoa(user+":"+password)
		},
		success: function(data) {
			for ( var idx=0, len = data.options.length; idx < len; idx++ ) {
   				var icd_elem = data.options[idx];
				ICD[idx] = {
					"id" : icd_elem,
					"label" : icd_elem
				};
			}
			console.log("ICD loaded");
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error loading ICD codes: " + textStatus + ", " + error);
		}
	});
}*/

var forms = [];
var types = {"string" : "text", "int" : "number", "date": "date"};

function getProgramStage() {
	var arr = progStageArray[selectedProg];

	for(var i = 0; i < arr.length; i++) {
		$.ajax({
			type: "GET",
			url: dhis_url + "api/programStages/" + arr[i],
			dataType: 'json',
			headers: {
				Authorization: "Basic " + btoa(user+":"+password)
			},
			success: function(data) {
				$.each(data.programStageDataElements, function() {;
					var dId = this.dataElement.id;

					/*fetch each dataElement in the programStage*/
					$.ajax({
						type: "GET",
						url: dhis_url + "api/dataElements/" + dId,
						dataType: 'json',
						headers: {
							Authorization: "Basic " + btoa(user+":"+password)
						},
						success: function(dataElement) {

							/*
								GOT DATAELEMENT
								CREATE FORMS DYNAMICALLY
							*/

							/*
							 * Got dataElement, check if it has optionset, if so; get it 
							 */
							if(dataElement.optionSet != null) {
								var optId = dataElement.optionSet.id;
								$.ajax({
									type: "GET",
									url: dhis_url + "api/optionSets/" + optId,
									dataType: 'json',
									headers: {
										Authorization: "Basic " + btoa(user+":"+password)
									},
									success: function(optionSet) {
										//got optionset, create options for the form:
										var options = [];
										$.each(optionSet.options, function(key, value) {
											if(value != null) {
												var opt = document.createElement('option');
												opt.innerHTML = value.name; //?
												opt.value = value;
												options.push(opt);		
											}
										});
									},
									error: function(jqXhr, textStatus, error) {
										console.log("Error loading optionSet: " + textStatus + ", " + error);
									}
								});
							}	
							else {
								//No optionset, regular form
							}
						},
						error: function(jqXhr, textStatus, error) {
							console.log("Error loading dataElement: " + textStatus + ", " + error);
						}
					})

				});
			},
			error: function(jqXhr, textStatus, error) {
				console.log("Error loading ProgramStage: " + textStatus + ", " + error);
			}
		});
	}
}


//searches for programs for currently selected organisation, fills them into currentProgs
function searchForPrograms() {
	var sel = ClearOptionsFast('progName');
	for (var i = 0; i < progList.length; i++) {
		for (var j = 0; j < progOrgArray[i].length; j++)  {
			if(progOrgArray[i][j].name == selectedOrg) {
				var opt = document.createElement('option');
				opt.innerHTML = progList[i].label;
				opt.value = i; //perhaps label
				sel.appendChild(opt);
			}
		}
	}
}


function ClearOptionsFast(id) {
	var selectObj = document.getElementById(id);
	var selectParentNode = selectObj.parentNode;
	var newSelectObj = selectObj.cloneNode(false); // Make a shallow copy
	selectParentNode.replaceChild(newSelectObj, selectObj);
	return newSelectObj;
}
