'use strict';

/* Siden fungerer bare dersom du bruker Chrome/Chromium med --disable-web-security */

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

  console.log('geolocation: ' + enabled)
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
	$( "#orgName" ).autocomplete({
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
  loadICD()
  //disableDialog()
});

$(function() {
	$('#comment').popover({
		html: true,
		title: 'Comment'
	});

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

  maps_init()
});

//Should save the comment. 
function add_comment() {
	var comment = $("#leaveComment").val();
	//here we should save the comment.
	if (comment.length > 0) {
		alert($("#leaveComment").val());	
	}
}

//Skal lage json data for innsending av innsamlet data
function submit_form() {
	/*
	var data = { 	
		"program": selectedOrg, 
		"orgUnit": selectedProg, 
		"eventDate": "2013-05-17",
	 	"status": "COMPLETED", 
	 	"storedBy": "admin", 
	 	"coordinate": {"latitude": "59.8", "longitude": "10.9"}, 			
	 	"dataValues": [
			{	"dataElement": "qrur9Dvnyt5", "value": "22" }, 
			{	"dataElement": "oZg33kd9taw", "value": "Male" },
			{	"dataElement": "msodh3rEMJa", "value": "2013-05-18" } 
			{	"dataElement": "comment", "value": "kommentar skal inn her"} //litt usikker på comment elementet her
		] 
	};
	sendEvent(data);*/
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
		dataType: "json",
		//async: false,
		headers: {
			Authorization : "Basic " + btoa(user+":"+password)
		},
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
		//async: false,
		headers: {
			Authorization : "Basic " + btoa(user+":"+password)
		},
		success: function(data) {
			$.each(data.programs, function(key, val) {
				var opt = { label: val.name, value: val.id };
				progList.push(opt);
			});
			console.log("Programs loaded");
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
		//async: false,
		headers: {
			Authorization : "Basic " + btoa(user+":"+password)
		},
		success: function(data) {
			$.each(data.organisationUnits, function(key, val) {
				var opt = { label: val.name, value: val.id };
				orgList.push(opt);
			});
			console.log("OrganisationUnits loaded");
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error loading organisationUnits: " + textStatus + ", " + error);
		},
	});
}

//loads information about what organisations is connected to each program
//necesarry because the dhis2 api is stupid
function loadProgOrgs() {
	console.log("Trying to load " + progList.length + " prog/org connections");
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
		//async: false,
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
			console.log("Prog/org connections loaded");
		},
		error: function(jqXhr, textStatus, error) {
			console.log("Error loading program/org connections: " + textStatus + ", " + error);
		},
	});
}


//TODO: caching
//url +  api/optionSets/eUZ79clX7y1.json
function loadICD() {
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
}

var forms = [];
var types = {"string" : "text", "int" : "number", "date": "date"};

function getProgramStage() {
	var arr = progStageArray[selectedProg];

	for(var i = 0; i < arr.length; i++) {
		console.log("Loading forms for: " + arr[i]);

		$.ajax({
			type: "GET",
			url: dhis_url + "api/programStages/" + arr[i],
			dataType: 'json',
			async: false,
			headers: {
				Authorization: "Basic " + btoa(user+":"+password)
			},
			success: function(data) {
				console.log("ProgramStage loaded");

				$.each(data.programStageDataElements, function() {
					/* fetch the element of each form 
					 */

					console.log(this.dataElement);
					var dId = this.dataElement.id;

					/*fetch each dataElement in the programStage*/
					$.ajax({
						type: "GET",
						url: dhis_url + "api/dataElements/" + dId,
						dataType: 'json',
						async: false,
						headers: {
							Authorization: "Basic " + btoa(user+":"+password)
						},
						success: function(dataElement) {

							//GOT THE DATAELEMENT

							/*
							 * If it has optionset, get it 
							 */
							 var dId = this.dataElement.id;
							if(dataElement.optionSet != null) {
								$.ajax({
									type: "GET",
									url: dhis_url + "api/optionSets/" + dId,
									dataType: 'json',
									async: false,
									headers: {
										Authorization: "Basic " + btoa(user+":"+password)
									},
									success: function(optionSet) {
										//got optionset, create options for the form:
										var options = [];
										$.each(optionSet.options, function(key, value) {
											var opt = document.createElement('option');
											opt.innerHTML = value.name; //?
											opt.value = value;
											options.appendChild(opt);			
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
