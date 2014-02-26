//Account.js Ruth - Modified: 09-Apr-13
define(
['jquery', 'underscore', 'communication', 'utils', 'properties', 'constants', 'sidebar', 'pubsub'], function ($, _, MFiCommunication, Utils, Properties, Constants, Sidebar) {
	var module = {
		el: "",

		render: function () {
			var that = this;
			var sHtml="";
			var assignee_html = "";
			sHtml += '<div class="mfi-save-eidt-buttoncontrol pull-right"><button class="btn-mfi btn-mfi-default pull-left" id="btn-account-edit">Edit</button><div class="pull-right"><button class="btn-mfi btn-mfi-default pull-left" id="btn-account-cancel" style="display: none; ">Cancel</button><button class="btn-mfi btn-mfi-default pull-left" id="btn-account-save" style="display: none; ">Save</button></div></div>';

			var oDataapp = {
					enrollId : MFi.get("enrollid"),
					processInstanceId :  MFi.get("pin"),
					userId : MFi.get("userId")
			};

			var aData = {userId : MFi.get("userId")};

			var oData = {
					licenseeId : MFi.get("enrollid")
			};

			var template = _.template('<dl class="dl-horizontal"><dt><%= label %></dt><dd><%= value %></dd></dl>');


			MFiCommunication.call("fetchAllAS.action", aData, displayAssignee,"Loading");

			function displayAssignee(data) {
				assignee_html += '<option value="">No Value</option>';
				$.each(data.resultList[0].returnList, function(i, item) {
					if(item.email != null){
						if(item.namePostFix == null){
							assignee_html += '<option value="'+item.email+'">'+item.userFirstName+" "+item.userLastName+'</option>';
						} else {
							assignee_html += '<option value="'+item.email+'">'+item.userFirstName+" "+item.userLastName+" "+item.namePostFix+'</option>';
						}
					}
				});
				$("#assign_account_specialist").html(assignee_html);
				$("#assign_account_specialist").val(MFi.get("assign_account_specialist_val"));
				return assignee_html;
			}

				var sURL = "getTaskDetails.action";

				if ($('li.active').attr('name')){
					if ($('li.active').attr('name').indexOf("INBOX") >= 0)
						sURL = "getTaskDetails.action";
					else
						sURL = "getActionDetails.action";
				}else{
					sURL = "getActionDetails.action";
				}

			MFiCommunication.call(sURL, oDataapp, displayApplicationList,"Loading");
			//MFiCommunication.call("getAllContracts.action", oData, that.displayContractsList);
			function displayApplicationList(data) {
				var account_type_val = "";
				var account_type_text = "";
				var account_subtype_val = "";
				var assign_account_specialist_val="";
				var account_status_val= "";
				var account_status_array = ["label.ListAccountStatus.Active", "label.ListAccountStatus.TermforConvenience", "label.ListAccountStatus.Delinquent","label.ListAccountStatus.Canceled","label.ListAccountStatus.Inactive","label.ListAccountStatus.Rejected","label.ListAccountStatus.TermforBreach","label.ListAccountStatus.Post-Term","label.ListAccountStatus.Pending"]
				var process_phase_val= "";
				var process_phase_array = ["label.ListOfPhases.Ph2AwSignLic","label.ListOfPhases.Ph4AwLicExec","label.ListOfPhases.Ph2AwSignLicPaper","label.ListOfPhases.Ph3Confirmed_PaperUpgradeDocsReceived","label.ListOfPhases.Ph3Confirmed_eSIgnUpgradeError","label.ListOfPhases.Ph2LicESignDeclined","label.ListOfPhases.Ph2AwaitingSGS","label.ListOfPhases.Ph2ReportSub","label.ListOfPhases.Ph2LicRejected","label.ListOfPhases.Ph4Terminated","label.ListOfPhases.Ph5Pending","label.ListOfPhases.Ph4Rejected","label.ListOfPhases.Ph3Confirmed","label.ListOfPhases.Ph2AsAssigned","label.ListOfPhases.Ph2Approved","label.ListOfPhases.Ph3Confirmed_eSIgnUpgradeStarted","label.ListOfPhases.Ph2LicReceived","label.ListOfPhases.Ph2Escalated","label.ListOfPhases.Ph3Confirmed_PaperUpgradeDocsSent","label.ListOfPhases.Ph2Returned","label.ListOfPhases.Ph2Legal","label.ListOfPhases.Ph1Enrollment","label.ListOfPhases.Ph2AppSub","label.ListOfPhases.Ph2Error"]
				$.each(data.resultList[0].returnList, function (i, item) {
					 sHtml += '<div id="admin-accountstatus" class="editfields">\
	                      		<h4>Account Status</h4>';

					 var accstatus_html = '<option value="">No Value</option>';
					 $.each(account_status_array, function (j, accstatus) {
						 accstatus_html += '<option value="'+accstatus+'">'+Properties.getTextFromKey(accstatus)+'</option>';
					 });
					 sHtml += template({
	            		  		label : 'Account Status',
	            		  		value : '<div class="selectcontrol"><select id="account_status" data-value="">'+accstatus_html+'</select></div>'
	            	  			});
					 var processphase_html = '<option value="">No Value</option>';
					 $.each(process_phase_array, function (j, procphase) {
						 processphase_html += '<option value="'+procphase+'">'+Properties.getTextFromKey(procphase)+'</option>';
					 });
				 	  sHtml += template({
	      		  		label : 'Process Phase',
	      		  		value : '<div class="selectcontrol"><select id="process_phase" data-value="">'+processphase_html+'</select></div>'
	      		  		});
	      		  	  sHtml += template({
		      		  		label : 'Assign Account Specialist',
		      		  		value : '<div class="selectcontrol"><select id="assign_account_specialist"></select><font class="asterisk hide assign_account_specialist">Please select Account Specialist</font></div>'
		                });
	            	  sHtml += template({
	      		  		label : 'Last Status Change On',
	      		  		value : '<input type="text" id="last_status_changed" data-value="' + (item.licenseeChangeStatusDate != null ? Utils.getTimezoneDate(item.licenseeChangeStatusDate,"mmddyyyy","/") : "") + '" value="' + (item.licenseeChangeStatusDate != null ? Utils.getTimezoneDate(item.licenseeChangeStatusDate,"mmddyyyy","/") : "") + '">'
	      	  			});
	            	  sHtml += template({
	      		  		label : 'Initial Submission On',
	      		  		value : '<input type="text" id="initial_submission_on" data-value="' + (item.createdDate != null ? Utils.getTimezoneDate(item.createdDate,"mmddyyyy","/") : "") + '" value="' + (item.createdDate != null ? Utils.getTimezoneDate(item.createdDate,"mmddyyyy","/") : "") + '">'
	      	  			});
	            	  sHtml += template({
	      		  		label : 'Licensee Met On',
	      		  		value : '<input type="text" id="licensee_met_on" data-licenseemetontimehs="' + (item.licenseeMeetingDate != null ? Utils.getTimezoneDate(item.licenseeMeetingDate,"hms","/") : "") + '" value="'+(item.licenseeMeetingDate != null ? Utils.getTimezoneDate(item.licenseeMeetingDate,"mmddyyyy","/") : "") +'">'
	      	  			});
	            	  sHtml += template({
	      		  		label : 'Licensee Executed On',
	      		  		value : '<input type="text" id="licensee_executed_on" data-value="' + (item.licenseeExecutedDate != null ? Utils.getTimezoneDate(item.licenseeExecutedDate,"mmddyyyy","/") : "") + '" value="' + (item.licenseeExecutedDate != null ? Utils.getTimezoneDate(item.licenseeExecutedDate,"mmddyyyy","/") : "") + '">'
	      	  			});
	            	  sHtml += template({
		      		  		label : 'Contract Decline Reason',
		      		  		value : '<label title="'+(item.contractDeclineReason != null ? item.contractDeclineReason : "") +'"data-value="'+item.contractDeclineReason+'" id="contract_decline_reason" style="padding-left: 77px; width: 250px;">'+(item.contractDeclineReason != null ? item.contractDeclineReason : "")+'</label>'
	            	  });
	            	  var rows = ((item.contractDeclineComments != null ? Math.ceil(item.contractDeclineComments.length/50) : 1))
	            	  sHtml += template({
		      		  		label : 'Contract Decline Comments',
		      		  		value : '<textarea disabled id="contract_decline_comments" rows="'+rows+'" columns="50" data-value="'+ (item.contractDeclineComments != null ? item.contractDeclineComments : "") +'">' + (item.contractDeclineComments != null ? item.contractDeclineComments : "") + '</textarea>'
		      	  			});
	            	  
	            	sHtml += '</div><div id="admin-licenseeinfo" class="editfields">\
	                        			<hr class="mfi-hr">\
	                    					<h4>Licensee Information</h4>';

	            	var acctype_html = '<option value="">No Value</option>';
	            	$.each(item.accountTypeList, function (j, accounttype) {
						acctype_html += '<option value="'+accounttype.accountTypeId+'">'+Properties.getTextFromKey(accounttype.accountType)+'</option>';
					});
	            	sHtml += template({
	      		  		label : 'Legal Company Name',
	      		  		value : '<input type="text" id="legal_company_name" value="' + (item.companyLegalName != null ? item.companyLegalName : "") + '">'
	                });
	            	sHtml += template({
	      		  		label : 'Account Type',
	      		  		value : '<div class="selectcontrol"><select id="account_type" onchange="changeDefVal()">'+acctype_html+'</select></div>'
	      	  			});

	            	var accsubtype_html = '<option value="">No Value</option>';
					$.each(item.subTypeList, function (j, accsubtyp) {
						accsubtype_html += '<option value="'+accsubtyp+'">'+Properties.getTextFromKey(accsubtyp)+'</option>';
					});
	            	sHtml += template({
	      		  		label : 'Account Subtype',
	      		  		value : '<div class="selectcontrol"><select id="account_subtype">'+accsubtype_html+'</select></div>'
	                });
	            	var geo_html = '<option value="">No Value</option>';
					$.each(item.geoList, function (j, geo) {
						geo_html += '<option value="'+geo+'">'+Properties.getTextFromKey(geo)+'</option>';
					});

	                sHtml += template({
	      		  		label : 'GMACC Customer Number',
	          		  	value : '<input type="text" id="gmacc_customer_number" value="' + (item.numberForInvoicing != null ? item.numberForInvoicing : "") + '"><font class="asterisk hide gmacc_customer_number">Accepts only numeric data</font>'
	                });
	                /*sHtml += template({
	      		  		label : 'DBA Company Name',
	      		  		value : '<input type="text" id="dba_company_name" value="' + (item.companyDBAname != null ? item.companyDBAname : "") + '">'
	                });
	                sHtml += template({
	      		  		label : 'Parent Company Name',
	      		  		value : '<input type="text" id="parent_company_name" value="' + (item.parentCompany != null ? item.parentCompany : "") + '">'
	                });
	                sHtml += template({
	      		  		label : 'Division',
	      		  		value : '<input type="text" id="division" value="' + (item.companyDivision != null ? item.companyDivision : "") + '">'
	                });
	                sHtml += template({
	      		  		label : 'Address',
	      		  		value : '<textarea id="address">'+ (item.address != null ? item.address : "") + '</textarea>'
	                });
	                sHtml += template({
	      		  		label : 'City/Town',
	      		  		value : '<input type="text" id="city_town" value="' + (item.city != null ? item.city : "") + '">'
	                });
	                sHtml += template({
	      		  		label : 'State/Province',
	      		  		value : '<input type="text" id="state_province" value="' + (item.state != null ? item.state : "") + '">'
	                });
	                sHtml += template({
	      		  		label : 'Postal Code',
	      		  		value : '<input type="text" id="postal_code" value="' + (item.zip != null ? item.zip : "") + '">'
	                });*/
	                sHtml += template({
	                	label : 'Geo',
	      		  		value : '<div class="selectcontrol"><select id="geo">'+geo_html+'</select></div>'
	                });
	                sHtml += template({
	      		  		label : 'License Document View Attributes',
	      		  		value : '<input type="text" id="licensee_document_view_attr" value="' + (item.licenseeDocumentAttributes != null ? item.licenseeDocumentAttributes : "") + '">'
	                });
	                sHtml += template({
	      		  		label : 'Selling Unauthorized Product',
	      		  		value : '<div class="selectcontrol"><select id="selling_authorized_product"><option value="1">Yes</option><option value="0">No</option></select></div>'
	                });
	                sHtml += template({
	      		  		label : 'URL of Unauthorized Product',
	      		  		value : '<input type="text" id="url_authorized_product" value="' + (item.urlOfUnauthorizedProduct != null ? item.urlOfUnauthorizedProduct : "") + '">'
		            });
		            sHtml += template({
	      		  		label : 'Maximum Number of Contacts',
	      		  		value : '<input type="text" id="max_no_contacts" value="' + (item.maxNumberOfContacts != null ? item.maxNumberOfContacts : "") + '"><font class="asterisk hide max_no_contacts">Accepts only numeric data</font>'
	                });
	                sHtml += template({
	      		  		label : 'PP Allowed per Project Number',
	      		  		value : '<input type="text" id="pp_allowed_per_project" value="' + (item.ppAllowedAutoProject != null ? item.ppAllowedAutoProject : "") + '"><font class="asterisk hide pp_allowed_per_project">Accepts only numeric data</font>'
		            });
	                var esignhtml = '<option value="">No Value</option><option value="label.ListOfSignTypes.ESign">'+Properties.getTextFromKey("label.ListOfSignTypes.ESign")+'</option>\
								<option value="label.ListOfSignTypes.PaperDocs">'+Properties.getTextFromKey("label.ListOfSignTypes.PaperDocs")+'</option>';
					sHtml += template({
	      		  		label : 'Document Signing Preference',
	      		  		value : '<div class="selectcontrol"><select id="document_signing_prefrence">'+esignhtml+'</select></div>'
	                });
					sHtml += template({
	      		  		label : 'Special Interest to Follow Up?',
	      		  		value : '<input type="checkbox" id="special_follow_up" >'
	                });
	                sHtml += template({
	      		  		label : 'Need to Terminate',
	      		  		value : '<input type="checkbox" id="need_to_terminate" >'
	                });
	                sHtml += template({
	      		  		label : 'Override to Termination',
	      		  		value : '<input type="checkbox" id="override_to_termination" >'
		            });
		            sHtml += template({
	      		  		label : 'Incompliant for Royalty',
	      		  		value : '<input type="checkbox" id="incompliant_royalty" >'
	                });
	                sHtml += template({
	      		  		label : 'Low Volume',
	      		  		value : '<input type="checkbox" id="low_volume" >'
	                });
	                var insurancehtml = '<option value="">No Value</option><option value="label.ListOf_MedProofInsurance_Requested">'+Properties.getTextFromKey("label.ListOf_MedProofInsurance_Requested")+'</option>\
					<option value="label.ListOf_MedProofInsurance_Received">'+Properties.getTextFromKey("label.ListOf_MedProofInsurance_Received")+'</option><option value="label.ListOf_MedProofInsurance_Override">'+Properties.getTextFromKey("label.ListOf_MedProofInsurance_Override")+'</option>'
	                sHtml += template({
	      		  		label : 'Proof of Insurance Status',
	      		  	value : '<div class="selectcontrol"><select id="insurance_status">'+insurancehtml+'</select></div>'
	                });

	                sHtml += '</div>\
	                				<div id="admin-rating" class="editfields">\
	                					<hr class="mfi-hr">\
	                						<h4>Coface</h4>';

	                sHtml += template({
	      		  		label : 'Coface Credit Score',
	      		  		value : '<input type="text" value="'+(item.cofaceCreditScore != null ? item.cofaceCreditScore : "") +'" id="cofaceCreditScore"><font class="asterisk hide cofaceCreditScore">Accepts only integers</font>'
					});
	                MFi.set("prev_creditscore",item.cofaceCreditScore);
	                sHtml += template({
	      		  		label : 'Coface Decision Date',
	      		  		value : '<input type="text" data-cofacedecisionhs="'+(item.cofaceCreditDecisionDate != null ? Utils.getTimezoneDate(item.cofaceCreditDecisionDate,"hms","/") : "") +'" value="'+(item.cofaceCreditDecisionDate != null ? Utils.getTimezoneDate(item.cofaceCreditDecisionDate,"mmddyyyy","/") : "") +'" id="cofaceDecisionDate" readonly="true">'
					});
	                sHtml += template({
	      		  		label : 'Coface  Status',
	      		  		value : '<div class="selectcontrol"><select id="cofaceStatus" value="'+item.cofaceStatus+'">\
						<option value="">No Value</option>\
						<option value="Requested">Requested</option>\
						<option value="Rejected">Rejected</option>\
						<option value="Complete">Complete</option>\
						<option value="Pass">Pass</option>\
						<option value="Override">Override</option>\
					</select></div>'
					});

	                sHtml += template({
	      		  		label : 'Credit Update Date',
	      		  		value : '<input type="text" data-cofaceupdatehs="'+(item.creditUpdateDate != null ? Utils.getTimezoneDate(item.creditUpdateDate,"hms","/") : "") +'" value="'+(item.creditUpdateDate != null ? Utils.getTimezoneDate(item.creditUpdateDate,"mmddyyyy","/") : "") +'" id="cofaceUpdateDate" readonly="true">'
					});
	                sHtml += template({
	      		  		label : 'Credit Request Date',
	      		  		value : '<input type="text" data-cofacerequesths="'+(item.cofaceCreditRequestDate != null ? Utils.getTimezoneDate(item.cofaceCreditRequestDate,"hms","/") : "") +'" value="'+(item.cofaceCreditRequestDate != null ? Utils.getTimezoneDate(item.cofaceCreditRequestDate,"mmddyyyy","/") : "") +'" id="cofaceRequestDate" readonly="true">'
					});
	                sHtml += template({
	      		  		label : 'Credit Rating',
	      		  		value : '<input type="text" value="'+(item.cofaceCreditRating != null ? item.cofaceCreditRating : "") +'" id="cofaceRating"><font class="asterisk hide cofaceRating">Please enter valid data (*Accepts 0-9,R,N,X,$,@)</font>'
					});
					sHtml += template({
	      		  		label : 'Coface Company Name',
	      		  		value : '<input type="text" value="'+(item.cofaceCompanyName != null ? item.cofaceCompanyName : "")+'" id="cofaceCompanyName">'
					});
					sHtml += template({
	      		  		label : 'Easy Number',
	      		  		value : '<input type="text" value="'+(item.easyNumber != null ? item.easyNumber : "") +'" id="easyNumber">'
					});
					sHtml += template({
	      		  		label : 'Easy Number Update Date',
	      		  		value : '<input type="text" data-easyNumberUpdatehs="'+(item.easyNumberUpdateDate != null ? Utils.getTimezoneDate(item.easyNumberUpdateDate,"hms","/") : "") +'" value="'+(item.easyNumberUpdateDate != null ? Utils.getTimezoneDate(item.easyNumberUpdateDate,"mmddyyyy","/") : "") +'" id="easyNumberUpdateDate" readonly="true">'
					});

                	sHtml += '</div>\
        				<div id="admin-rating" class="editfields rating_sgs">\
    					<hr class="mfi-hr">\
    						<h4>SGS</h4>';
					sHtml += template({
	      		  		label : 'SGS Rating',
	      		  		value : '<input type="text" value="'+(item.sgsRating != null ? item.sgsRating : "") +'" id="sgsRating"><font class="asterisk hide sgsRating">Accepts only numeric data</font>'
					});
					sHtml += template({
	      		  		label : 'SGS Status',
	      		  		value : '<div class="selectcontrol"><select id="sgsStatus" value="'+item.sgsStatus+'">\
					<option value="">No Value</option>\
					<option value="label.ListOfCreditPhases.Requested">Requested</option>\
					<option value="label.ListOfCreditPhases.Rejected">Rejected</option>\
					<option value="label.ListOfCreditPhases.Complete">Complete</option>\
					<option value="label.ListOfCreditPhases.Pass">Pass</option>\
					<option value="label.ListOfCreditPhases.Override">Override</option>\
					</select></div>'
					});
					sHtml += template({
	      		  		label : 'SGS Decision Date',
	      		  		value : '<input type="text" data-sgstimehs="'+(item.sgsDate != null ? Utils.getTimezoneDate(item.sgsDate,"hms","/") : "") +'" value="'+(item.sgsDate != null ? Utils.getTimezoneDate(item.sgsDate,"mmddyyyy","/") : "") +'" id="sgsDate" readonly="true">'
					});

						sHtml += '</div>';

						//Contacts Table
						sHtml +='<div id="admin-contacts">\
									<hr class="mfi-hr">\
										<h4 class="pull-left">Contacts</h4>\
										<div class="pull-right"><button id="new_contact" data-id="new" class="btn-mfi-small-default" type="button">Add New Contact</button></div><div class="clear"></div>';
					 MFi.set("contactslist",JSON.stringify(item.contactList));
					 MFi.set("contactssize",item.contactList.length);
					 var item_count = 0;
					 
					 if (MFi.get("quickSearch")=="Contact") {
						 $("#admin-contacts").trigger('click');
						 MFi.set("quickSearch", null);
					 }

					 if(item.contactList.length == 0){
						 sHtml += '<div style="align:center; ">No Contacts</div>';
					 }else{
						 sHtml += '<table class="table readonly table-bordered table-striped bordered bs-docs-example-table-border" >\
								<tr>\
								  <th>Name</th>\
				                  <th>Email</th>\
				                  <th>Contact Type(s)</th>\
							 	  <th>Personal Document View Attributes</th>\
								  <th>Action</th>\
								</tr>';

						 var template_contact = _.template('<tr id="<%= contactId %>" class="row_contact"><td><%= name %></td><td><%= email %></td><td style="max-width:1px; word-wrap:break-word;"><%= contact_types %></td><td><%= doc_view_attributes %></td><td class="tablebuttoncell"><button id="edit_contact" data-id="<%= contactId %>" class="btn-mfi-small-gray" type="button">Edit</button> <button id="delete_contact" data-primary="<%= is_primary %>" data-id="<%= contactId %>" class="btn-mfi-small-gray" type="button">Delete</button></td></tr>')
						 $.each(item.contactList, function (j, contactitem) {
							 var is_primary = 0;
							 if(contactitem.mfiContactTypes.length > 0){
							 		if (contactitem.mfiContactTypes.toString().indexOf("Primary") >= 0){
							 			is_primary = 1;
							 			var contactMobileNumber = contactitem.mobile;
							 			var contactPhoneNumber  = contactitem.phone;
							 			var prcontact = '<a href="mailto:'+contactitem.primaryContactEmail+'">'+ contactitem.name +" "+ contactitem.lastName +'</a>';
							 			if (contactMobileNumber != null && $.trim(contactMobileNumber) != '') {
							 				prcontact += '&nbsp;('+contactMobileNumber+')';
							 			} else if (contactPhoneNumber != null && $.trim(contactPhoneNumber) != '') {
							 				prcontact += '&nbsp;('+contactPhoneNumber+')';
							 			} else {
							 				prcontact += '&nbsp;';
							 			}
							 			$('dt:contains("Primary Contact")').next().html(prcontact);
							 		}		
							 	}
							 sHtml += template_contact({
										sno : item_count+1,
										name : contactitem.name +" "+ contactitem.lastName,
										email : contactitem.primaryContactEmail,
										doc_view_attributes : contactitem.personalDocumentAttributes,
										contact_types : (contactitem.mfiContactTypes.length > 1 ? contactitem.mfiContactTypes.toString().replace(/,/g, ", ") : contactitem.mfiContactTypes),
										contactId : contactitem.contactId,
										is_primary : is_primary
								});
							 	item_count ++;
						 		MFi.set("primarycontact",contactitem.primaryContactEmail);
						 		MFi.set("primaryContactName",contactitem.name +" "+contactitem.lastName);
						});
						 	MFi.set("contactsListForAccount",item.contactList);
						 	MFi.set("contact_sno",item_count);

						 	sHtml += '<tr id="lastcontact"><th colspan="5"></th></tr></table></div>';
							$(".row_contract:even").css("background-color", "");
							$(".row_contract:odd").css("background-color", "#E3E7ED");
					 }


					sHtml += '<div id="admin-contract" class="editfields">\
							</div>';
					sHtml += '<div id="admin-additionalinfo" class="editfields">\
                        <hr class="mfi-hr">\
						<h4 class="pull-left">Additional Manufacturing info</h4>';
						
						sHtml += template({
							label : 'Mfg List Opt Out',
							value : '<input type="checkbox" id="mFg_list_opt_out" disabled="disabled"/>'
						});
						
						var textinput = "input";
						var inputType = "text";
						sHtml += template({
							label : 'Product Category',
							value :  getTheInputHTML(textinput, "product_category", inputType, item.productCategory)
								
						});

						sHtml += template({
							label : 'Sales Contact Name',
							value : getTheInputHTML(textinput, "sales_contact_name", inputType, item.salesContactName)
						});

						sHtml += template({
							label : ' Sales Contact Email',
							value : getTheInputHTML(textinput, "sales_contact_email", inputType, item.salesContactEmail)
						});

						sHtml += template({
							label : ' Sales Contact Telephone',
							value : getTheInputHTML(textinput, "sales_contact_telephone", inputType, item.salesContactPhone)
						});
						sHtml += '</div>';
					

					
					account_type_val = item.type;
					account_type_text = item.accountType;
					account_subtype_val = item.subtype;
					assign_account_specialist_val = item.owner;
					MFi.set("assign_account_specialist_val",assign_account_specialist_val);
					geo_val = item.geo;
					product_category_val=item.productCategory;
					account_status_val = item.status;
					process_phase_val = item.phaseName;
					cofaceStatus_val = item.cofaceStatus;
					sgsStatus_val = item.sgsStatus;
					docsSigningType_val = item.docsSigningType;
					insurance_val = item.medProofInsurance;
					cofaceCompanyName_val = (item.cofaceCompanyName != null ? item.cofaceCompanyName.replace(/\"/g, '\"') : "");
					
      	  			//checkboxes
					needToTerminate_val = item.needToTerminate;
					overwriteTermination_val = item.overwriteTermination;
				    inCompliantForRoyalty_val = item.inCompliantForRoyalty;
				    lowVolume_val = item.lowVolume;
				    specialInterestToFollowUp_val=item.specialInterestToFollowUp;
				    sellingUnauthorizedPproduct_val = item.sellingUnauthorizedPproduct;
				    mFgListOptOut_val=item.mFgListOptOut;
				    MFi.set("ndaExecutedVersion", (item.ndaExecutedVersion != null ? item.ndaExecutedVersion : ""));
				    MFi.set("ndaExecutedDate", (item.ndaExecutedDate != null ? Utils.getTimezoneDate(item.ndaExecutedDate,"mmddyyyy","/") : ""));
				    $('dt:contains("Last Activity")').next().html(item.lastActivity);
				    $('dt:contains("Process Phase")').next().html(Properties.getTextFromKey(item.phaseName));
				    if ($('li.active').attr('name')){
				    	if ($('li.active').attr('name').indexOf("INBOX") >= 0){
				    		$("#acc_assignee").text(MFi.get("userFirstName") + " " + MFi.get("userLastName"));
				    		if(MFi.get("impersonate") == "true"){
				    			$("#acc_assignee").text(MFi.get("impersonate_userFirstName") + " " + MFi.get("impersonate_userLastName"));
				    		}
				    	}	
				    	else
				    		$("#acc_assignee").text(item.assignee);
				    }else
				    	$("#acc_assignee").text(item.assignee);
					
				    MFi.set("default_assignee",(item.assignee != null ? item.assignee : ""));
				    MFi.set("actual_assignee",(item.actualAssignee != null ? item.actualAssignee : ""));
				    if(MFi.get("currentNodeName") == "NOT-AVAILABLE"){
				    	MFi.set("currentNodeName",item.currentNodeName);
					    MFi.set("taskid",item.taskId);
					    var action_call = MFiCommunication.call("getEnrollmentWorkFlow.action", null, that.displayTransitions);
				    }

				});
				setTimeout(function() {
					MFiCommunication.call("getAllContracts.action", oData, that.displayContractsList);
				}, 100);
				$("#admin-account").html(sHtml);
				$('#url_authorized_product').parent().parent().hide();
				$("#assign_account_specialist").html(assignee_html);
				$("#account_type").val(account_type_val);
				if(account_type_val == null)
					$("#account_type").val(1);
				if($("#account_type").val() == 2 && account_type_text == Constants.LIST_ACCOUNT_TYPE_CM){
					$("#account_type").find(":selected").text('CM');
				}
				$("#account_subtype").val(account_subtype_val);
				$("#assign_account_specialist").val(assign_account_specialist_val);
				$("#geo").val(geo_val);
				$("#product_category").val(product_category_val);
				$("#account_status").val(account_status_val);
				$('#account_status').data('value', account_status_val);
				$("#process_phase").val(process_phase_val);
				$("#process_phase").data('value', process_phase_val);
				$("#cofaceStatus").val(cofaceStatus_val);
				$("#sgsStatus").val(sgsStatus_val);
				$("#document_signing_prefrence").val(docsSigningType_val);
				$("#insurance_status").val(insurance_val);
				$("#cofaceCompanyName").val(cofaceCompanyName_val);

				$("#btn-account-save, #btn-account-cancel").hide();
			    $("#btn-account-edit, #accountstatus").show();
			    (needToTerminate_val > 0) ? $('#need_to_terminate').attr('checked', true) : $('#need_to_terminate').attr('checked', false);
			    (overwriteTermination_val > 0) ? $('#override_to_termination').attr('checked', true) : $('#override_to_termination').attr('checked', false);
			    (inCompliantForRoyalty_val > 0) ? $('#incompliant_royalty').attr('checked', true) : $('#incompliant_royalty').attr('checked', false);
			    (lowVolume_val > 0) ? $('#low_volume').attr('checked', true) : $('#low_volume').attr('checked', false);
			    (specialInterestToFollowUp_val > 0) ? $('#special_follow_up').attr('checked', true) : $('#special_follow_up').attr('checked', false);
			    (mFgListOptOut_val > 0) ? $('#mFg_list_opt_out').attr('checked',true) : $('#mFg_list_opt_out').attr('checked', false);
			    			    			    
			    if(sellingUnauthorizedPproduct_val){
					$('#selling_authorized_product').val(1);
					$('#url_authorized_product').parent().parent().show();
				}else{
					$('#selling_authorized_product').val(0);
					$('#url_authorized_product').parent().parent().hide();
				}

			    $('#selling_authorized_product').live("change", function() {
			    	var selling_type = $(this).val();
			    	if(selling_type == 1)
			    		$('#url_authorized_product').parent().parent().show();
			    	else
			    		$('#url_authorized_product').parent().parent().hide();
			     });

			    $("#last_status_changed, #initial_submission_on, #licensee_met_on, #licensee_executed_on, #cofaceRequestDate, #cofaceDecisionDate, #cofaceUpdateDate, #sgsDate, #easyNumberUpdateDate").datepicker().attr("readonly", true).addClass("hasDatepicker");
			    $("#process_phase, #last_status_changed, #licensee_executed_on, #contract_decline_reason, #contract_decline_comments, #initial_submission_on, #nda_execution_date").attr("disabled", "disabled");
			    that.viewMode();
			}

		},
		displayTransitions: function(data) {
			$(".select_button").hide();
			var html_workflow = "";
			var template_approve = _.template('<li><a data-id="<%= value %>" data-type="<%= type %>" id="btn-reject" href="javascript:void(0)" title="<%= value_format %>"><%= value_format %></a></li>');
			var approve_action = false;
			$.each(data.resultList[0].returnList, function(i, item) {
				if (item.type == MFi.get("currentNodeName")) for (j in item.values) {
					//<rdar://problem/14254768>, <rdar://problem/14254947>
					if(item.type == "task.initialAssign" && item.values[j] == "tr.approve"){
							html_workflow += template_approve({
								value : item.values[j],
								value_format : "Assign AS",
								type : item.type
							});
					//<rdar://problem/15289835> Rename button to "Submit to Avent"
					}else if(item.type == "task.reviewAvnetSubm" && item.values[j] == "tr.submit"){
									html_workflow += template_approve({
										value : item.values[j],
										value_format : "Submit to Avnet",
										type : item.type
							});
					}else if(item.type == "task.asReview" && item.values[j] == "tr.accept"){
							$("#btn-enr-approve").attr("data-id",item.values[j]);
							$("#btn-enr-approve").attr("data-type",item.type);
							$("#btn-enr-approve").text("Approve");
							approve_action = true;
					//<rdar://problem/14254768>, <rdar://problem/14254947>
					}else if(item.type == "task.terminate" && item.values[j] == "tr.approve"){
						//rdar://problem/14693200
						$("#btn-enr-approve").attr("data-id",item.values[j]);
						$("#btn-enr-approve").attr("data-type",item.type);
						$("#btn-enr-approve").text("Pending Termination");
						approve_action = true;
					}else if(item.type == "task.reviewHardCopy" && item.values[j] == "tr.acceptHardCopy"){
					//rdar://problem/14680377
					$("#btn-enr-approve").attr("data-id",item.values[j]);
					$("#btn-enr-approve").attr("data-type",item.type);
					$("#btn-enr-approve").text("Accept Hard Copy");
					approve_action = true;
				}else{
					var approve_label = Properties.getTextFromKey(item.values[j]);
					//<rdar://problem/15890424>
					if(item.type == "task.dirSignTheDocuments" && item.values[j] == "tr.approve"){
						approve_label = "Execute";
					}						
					if(approve_label != "Approve"){
						var display_value = Properties.getTextFromKey(item.values[j]);
						if(item.values[j] == "tr.reject")
							display_value = "Reject";
						if(item.type == "task.dirSignTheDocuments" && item.values[j] == "tr.approve")
							display_value = "Execute";
						//<rdar://problem/15173168>
						if(MFi.get("islicensee") == true && item.type == "task.manageDeclined" && item.values[j] == "tr.returnToAS"){
							//dont show Return to AS in UI
						}else{
							html_workflow += template_approve({
								value : item.values[j],
								value_format : display_value,
								type : item.type
							});
						}
					}else{
							$("#btn-enr-approve").attr("data-id",item.values[j]);
							$("#btn-enr-approve").attr("data-type",item.type);
							$("#btn-enr-approve").text(Properties.getTextFromKey(item.values[j]));
							approve_action = true;
						}
					}
				}
			});

			if(!approve_action){
				$("#btn-enr-approve").addClass("hide");
			}else{
				$("#btn-enr-approve").removeClass("hide");
			}
			$("#ulTransition").html(html_workflow);
			if(html_workflow == ""){
				$("#reject_approve_sales").addClass("hide");
				//$("#ulTransition").removeClass("dropdown-menu");
				//$("#action_caret").removeClass("caret");
			}else{
				if($('#ulTransition > li').size() == 1){
					$("#reject_approve_sales").addClass("hide");
					$(".select_button").show();
					$(".select_button").attr("data-id",$('#ulTransition > li').find("a").data("id"));
					$(".select_button").attr("data-type",$('#ulTransition > li').find("a").data("type"));
					$(".select_button").text($('#ulTransition > li').find("a").text());
				}else{
					$("#reject_approve_sales").removeClass("hide");
				}	
			}
			return html_workflow;
		},
		displayContractsList: function (data) {
			MFi.set("contractslist",JSON.stringify(data));
			var dl_template = _.template('<dl class="dl-horizontal"><dt><%= label %></dt><dd><%= value %></dd></dl>');
			var html = '<hr class="mfi-hr"><h4 class="pull-left">Contract Info</h4>';

			html+= '<div class="pull-right"><button id="new_contract" data-id="new" class="btn-mfi-small-default" type="button">Add New Contract</button></div><div class="clear"></div>';

			html += dl_template({
		  		label : 'NDA Execution Date',
		  		value : '<input type="text" id="nda_execution_date" value="'+(MFi.get("ndaExecutedDate") != "NOT-AVAILABLE" ? MFi.get("ndaExecutedDate") : "") +'">'
	  			});
			html += dl_template({
		  		label : 'NDA Version',
		  		value : '<input type="text" id="nda_version" value="'+(MFi.get("ndaExecutedVersion") != "NOT-AVAILABLE" ? MFi.get("ndaExecutedVersion") : "") +'">'
  			});
			
			html += '<table class="table readonly table-bordered table-striped bordered bs-docs-example-table-border" >\
				<tr>\
				  <th>Contract Type</th>\
                  <th>Contract Version</th>\
                  <th>Contract Number</th>\
				  <th>Contract Sent On</th>\
	              <th>Contract Executed On</th>\
	              <th>Contract Terminated On</th>\
				  <th>Action</th>\
				</tr>';

			if(data.resultList[0].LicenseeAccounts.length == 0){
				html += '<tr><td colspan="8">No Records</td></tr>';
			}else{
				var c_template = _.template('<tr class="row_contract"><td><%= contract_type %></td><td><%= contract_version %></td><td><%= contract_number %></td><td><%= contract_sent_on %></td><td><%= contract_executed_on %></td><td><%= contract_terminated_on %></td><td class="tablebuttoncell"><button id="edit_contract" data-id="<%= accountId %>" data-contracttypeid="<%= contracttypeid %>"  class="btn-mfi-small-gray" type="button">Edit</button> <button id="delete_contract" data-usercreated="<%= userCreatedContract %>" data-contractexecuted="<%= contract_executed_on %>" data-id="<%= accountId %>" class="btn-mfi-small-gray" type="button">Delete</button></td></tr>')
				var c_template1 = _.template('<tr class="row_contract"><td><%= contract_type %></td><td><%= contract_version %></td><td><%= contract_number %></td><td><%= contract_sent_on %></td><td><%= contract_executed_on %></td><td><%= contract_terminated_on %></td><td class="tablebuttoncell"><button id="edit_contract" data-id="<%= accountId %>" data-contracttypeid="<%= contracttypeid %>" class="btn-mfi-small-gray" type="button">Edit</button> <button id="delete_contract" data-usercreated="<%= userCreatedContract %>" data-contractexecuted="<%= contract_executed_on %>" data-id="<%= accountId %>" class="btn-mfi-small-gray" type="button">Delete</button> <button id="withdraw_contract" data-usercreated="<%= userCreatedContract %>" data-id="<%= accountId %>" class="btn-mfi-small-gray" type="button">Withdraw</button></td></tr>')
				
				$.each(data.resultList[0].LicenseeAccounts, function(i, item) {
					if ( (item.contractTypeId == 2 || item.contractTypeId == 3 ) 
							&& (item.phaseName == "label.ListOfPhases.Ph2Approved" || item.phaseName == "label.ListOfPhases.Ph2AwSignLic" )
								&& item.docsSigningType == "label.ListOfSignTypes.ESign" 
									&& item.contractTerminationDate == null 
										&& item.contractExecutedDate == null){					
						html += c_template1({
							contract_type : item.contractType,
							contract_version : item.contractVersion,
							contract_number : item.contractNumber,
							contract_sent_on : (item.contractSendDate!= null ? Utils.getTimezoneDate(item.contractSendDate,"mmddyyyy","/") : ""),
							contract_executed_on : (item.contractExecutedDate != null ? Utils.getTimezoneDate(item.contractExecutedDate,"mmddyyyy","/") : ""),
							contract_terminated_on : (item.contractTerminationDate != null ? Utils.getTimezoneDate(item.contractTerminationDate,"mmddyyyy","/") : ""),
							accountId : item.accountId,
							userCreatedContract : item.userCreatedContract,
							contracttypeid : item.contractTypeId
						});
	
					}else {
	
							html += c_template({
								contract_type : item.contractType,
								contract_version : item.contractVersion,
								contract_number : item.contractNumber,
								contract_sent_on : (item.contractSendDate!= null ? Utils.getTimezoneDate(item.contractSendDate,"mmddyyyy","/") : ""),
								contract_executed_on : (item.contractExecutedDate != null ? Utils.getTimezoneDate(item.contractExecutedDate,"mmddyyyy","/") : ""),
								contract_terminated_on : (item.contractTerminationDate != null ? Utils.getTimezoneDate(item.contractTerminationDate,"mmddyyyy","/") : ""),
								accountId : item.accountId,
								userCreatedContract : item.userCreatedContract,
								contracttypeid : item.contractTypeId
						});
					}
				});
			}
			
			html += '<tr><th colspan="8"></th></tr></table>';
			$(".row_contract:even").css("background-color", "");
			$(".row_contract:odd").css("background-color", "#E3E7ED");
			
			$("#admin-contract").html(html);
			$("#nda_execution_date").datepicker().attr("readonly", true).addClass("hasDatepicker");
			if ($('#btn-account-edit').is(':visible'))
				$("#nda_execution_date, #nda_version").attr("disabled", "disabled");
			else
				$("#nda_execution_date, #nda_version").removeAttr("disabled");
			var oDataapp = {
					enrollId :MFi.get("enrollid"),
					processInstanceId : MFi.get("pin"),
					userId : MFi.get("userId")
				};	
		},


		displayContactInfoList : function(data){
			MFi.set("contactsListForAccount",data.resultList[0].returnList);
			MFi.set("contactslist",JSON.stringify(data.resultList[0].returnList));
			MFi.set("contactssize",data.resultList[0].returnList.length);
			var html = '<hr class="mfi-hr"><h4 class="pull-left">Contacts</h4>';

			html+= '<div class="pull-right"><button id="new_contact" data-id="new" class="btn-mfi-small-default" type="button">Add New Contact</button></div><div class="clear"></div>';
			
			html += '<table class="table readonly table-bordered table-striped bordered bs-docs-example-table-border" >\
				<tr>\
				  <th>Name</th>\
                  <th>Email</th>\
                  <th>Contact Type(s)</th>\
			 	  <th>Personal Document View Attributes</th>\
				  <th>Action</th>\
				</tr>';
			
			if(data.resultList[0].returnList.length == 0){
				html += '<tr><td colspan="5">No Records</td></tr>';
			}else{
			 var template_contact = _.template('<tr id="<%= contactId %>" class="row_contact"><td><%= name %></td><td><%= email %></td><td style="max-width:1px; word-wrap:break-word;"><%= contacttype %></td><td><%= doc_view_attributes %></td><td class="tablebuttoncell"><button id="edit_contact" data-id="<%= contactId %>" class="btn-mfi-small-gray" type="button">Edit</button> <button id="delete_contact" data-primary="<%= is_primary %>" data-id="<%= contactId %>" class="btn-mfi-small-gray" type="button">Delete</button></td></tr>')
			 var item_count = 0;
				$.each(data.resultList[0].returnList, function(i, item) {
					 var is_primary = 0;
					 if(item.mfiContactTypes.length > 0){
					 		if (item.mfiContactTypes.toString().indexOf("Primary") >= 0){
					 			is_primary = 1;
					 			MFi.set("primarycontact",item.primaryContactEmail);
					 			MFi.set("primaryContactName",item.name +" "+item.lastName);
					 			var cItemMobileNumber = item.mobile;
					 			var cItemPhoneNumber  = item.phone;
					 			var prcontact = '<a href="mailto:'+item.primaryContactEmail+'">'+ item.name +" "+ item.lastName +'</a>';
					 			if (cItemMobileNumber != null && $.trim(cItemMobileNumber) != '') {
					 				prcontact += ' ('+cItemMobileNumber+')';
					 			} else if (cItemPhoneNumber != null && $.trim(cItemPhoneNumber) != '') {
					 				prcontact += ' ('+cItemPhoneNumber+')';
					 			} else {
					 				prcontact += '&nbsp;';
					 			}
						 		$('dt:contains("Primary Contact")').next().html(prcontact);
					 		}		
					 	}
					 html += template_contact({
						name : item.name +" "+ item.lastName,
						email : item.primaryContactEmail,
						contacttype : (item.mfiContactTypes.length > 1 ? item.mfiContactTypes.toString().replace(/,/g, ", ") : item.mfiContactTypes),
						doc_view_attributes : item.personalDocumentAttributes,
						contactId : item.contactId,
						is_primary : is_primary
					});
					item_count ++;
				});
			}
			html += '<tr><th colspan="5"></th></tr></table>';
			$(".row_contract:even").css("background-color", "");
			$(".row_contract:odd").css("background-color", "#E3E7ED");

			$("#admin-contacts").html(html);
		},


		init: function (el) {
			//Rebuilding my inner tab
			$("#col3-navbar2").html('<ul>\
										<li class="active"><a  data-id ="admin-accountstatus" class="selected">Account Status</a>\</li>\
										<li><a data-id="admin-licenseeinfo">Licensee Information</a></li>\
										<li><a data-id="admin-contacts">Contacts</a></li>\
										<li><a data-id="admin-rating">Rating</a></li>\
										<li><a data-id="admin-contract">Contract</a></li>\
										<li><a data-id="admin-additionalinfo"> Manufacturing Information</a></li>\
									</ul>');
			this.el = $(el);
			this.el.showLoader();
			this.render();
			this.attachEvents();
		},

		viewMode: function(){
			var that = this;
			that.el.addClass("editfields readonly");
			$("#btn-account-edit").show();
		    $("#btn-account-save, #btn-account-cancel").hide();
		    $("#admin-accountstatus,#admin-licenseeinfo,#admin-rating,#admin-contacts,#admin-contract,.rating_sgs,#admin-additionalinfo").find("input,select,textarea,checkbox").attr("disabled", "disabled");
		    $("#admin-accountstatus,#admin-licenseeinfo,#admin-rating,#admin-contacts,#admin-contract,.rating_sgs,#admin-additionalinfo").find("select").parent().addClass("disableselect");
		    //$('#address').css("height", $('#address')[0].scrollHeight+"px");
		},

		editMode: function(){
			var that = this;
			that.el.removeClass("readonly");
			$("#btn-account-edit").hide();
		    $("#btn-account-save,  #btn-account-cancel").show();
		    $("#admin-accountstatus,#admin-licenseeinfo,#admin-rating,#admin-contacts,#admin-contract,.rating_sgs,#admin-additionalinfo").find("input,select,textarea,checkbox").removeAttr("disabled");
		    $("#admin-accountstatus,#admin-licenseeinfo,#admin-rating,#admin-contacts,#admin-contract,.rating_sgs,#admin-additionalinfo").find("select").parent().removeClass("disableselect");
			$("#process_phase, #last_status_changed, #licensee_executed_on,#contract_decline_reason,#contract_decline_comments,#initial_submission_on, #nda_execution_date").attr("disabled", "disabled");
			//$('#address').css('height','');
			//<rdar://problem/14544133> MFi 1.0 iQA - Enrollment - No Gap present in-between the two fields present in the Addition Manufacturing Info  ---start//,
			//<rdar://problem/14596705> remove inline styles on selectcontrol when saving changes  ---start//
			$('#mFg_list_opt_out').css('margin','5px 0 10px 0');
			//<rdar://problem/14596705> remove inline styles on selectcontrol when saving changes  ---end//,
			//<rdar://problem/14544133> MFi 1.0 iQA - Enrollment - No Gap present in-between the two fields present in the Addition Manufacturing Info  ---end//
		},

		attachEvents: function () {
			var that = this;
			$("#new_contact, #edit_contact").die("click").live("click", function(e) {
				e.preventDefault();
				var currtar = "";
				if($(e.currentTarget).data("id") != ""){
					currtar =$(e.currentTarget).data("id");
				}else{
					currtar ="new";
				}
				$("#mfi-modal-thin-medium").css("height", "520px");
				if(currtar == "new"){
					var contact_size = (MFi.get("contactssize") >0 ? MFi.get("contactssize") : 0);
					if(contact_size < parseInt($("#max_no_contacts").val()))
						that.createContactModal($("#mfi-modal-thin-medium"), "New Contact", currtar);
					else{
						alert("The specified maximum number of contacts value for this Licensee is reached. Please modify and save the maximum number of contacts value to add a new contact");
					}
				}else{
					that.createContactModal($("#mfi-modal-thin-medium"), "New Contact", currtar);
				}
			});

			$("#new_contract, #edit_contract").die("click").live("click", function(e) {
				e.preventDefault();
				var currtar = "";
				if($(e.currentTarget).data("id") != "new"){
					currtar =$(e.currentTarget).data("id");
					MFi.set("contracttypeid",$(e.currentTarget).data("contracttypeid"));
				}else{
					currtar ="new";
				}
				/*if(currtar == "new"){
					var oData = {
							licenseeId : MFi.get("enrollid")
					};
					MFiCommunication.call("checkAddContract.action", oData, displayAddContract);

				}function displayAddContract(data){
					if(data.resultList[0].LicenseeAccounts.length > 0){
				      alert("Please enter Contract Termination Date before adding New Contract");
				     }
				     else{
				    	 that.createContractModal($("#mfi-modal-thin-medium"), "New Contract", currtar);
				     }
				}*/
				that.createContractModal($("#mfi-modal-thin-medium"), "New Contract", currtar);
				
			});

			$("#btn_ContactSave").die("click").live("click", function(e) {
				e.preventDefault();
				var btn = $(this);
				btn.showProgress(true, "Saving...");
				var contact_id = btn.data("id");
				$(".contact_first_name,.contact_last_name,.contact_title,.contact_phone,.contact_email,.contact_email_valid,.type_group,.primary_type_group").hide();
				var cData = {
						licenseeID:MFi.get("enrollid"),
						firstName : $("#contact_first_name").val(),
						lastName : $('#contact_last_name').val(),
						email : $("#contact_email").val(),
						title : $("#contact_title").val(),
						phone : $("#contact_phone").val(),
						mobile : $("#contact_mobile").val(),
						//contactCompany : $("#contact_company").val(),
						personalDocumentAttributes : $("#doc_view_attributes").val(),
						//adcPersonId: $("#adc_id").val(),
						personalAttributes : $("#personal_attributes").val()
					};
				var checkboxvalues = new Array();
				var is_primary= 0;var is_legal= 0;var is_technical= 0;var is_accounting= 0;var is_packaging= 0;var is_ats=0;
				$.each($("input[name='type_group[]']:checked"), function() {
					if($(this).val() == 1)
						is_primary = 1;
					if($(this).val() == 2)
						is_legal = 1;
					if($(this).val() == 3)
						is_technical = 1;
					if($(this).val() == 4)
						is_accounting = 1;
					if($(this).val() == 5)
						is_packaging = 1;
					if($(this).val() == 6)
						is_procurement = 1;
					if($(this).val() == 7)
						is_ats = 1;

					checkboxvalues.push($(this).val());
				});
				
				if($("#contact_first_name").val() == "" || $('#contact_last_name').val() == "" 
					|| $("#contact_title").val() == "" || $("#contact_phone").val() == ""
					|| $("#contact_email").val() == "" 
					|| validateEmail($("#contact_email").val()) > 0 || checkboxvalues.length == 0){
					if($("#contact_first_name").val() == "")
						$(".contact_first_name").show();
					if($('#contact_last_name').val() == "")
						$(".contact_last_name").show();
					if($('#contact_title').val() == "")
						$(".contact_title").show();
					if($('#contact_phone').val() == "")
						$(".contact_phone").show();
					if($('#contact_email').val() == "")
						$(".contact_email").show();
					else if(validateEmail($("#contact_email").val()) > 0)
						$(".contact_email_valid").show();
					if(checkboxvalues.length == 0)
						$(".type_group").show();

					btn.showProgress(false);
					return false;
				}
				function validateEmail(email){
					var emailPattern = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
					var error_count = 0;
					if(email == ""){
						error_count ++;
					}else{
						if (!emailPattern.test(email)) {
							error_count ++;
						}
					}
					return error_count;
				}
				if(contact_id != "new" && is_primary != 1){
					MFi.set("contactid", contact_id);
					var contacts_data = JSON.parse(MFi.get("contactslist"));
					var pcontacts = 0;
					$.each(contacts_data, function(j, contactitem) {
						if(contactitem.contactId != contact_id){
							$.each(contactitem.mfiContactTypes,function(k, contactitem){
								if(contactitem == "Primary"){
									pcontacts ++;
								}
					 		});
						}
					});
					if(pcontacts == 0 && is_primary == 0){
						$(".primary_type_group").show();
						btn.showProgress(false);
						return false;
					}
				}
				cData.contactTypeIds = checkboxvalues;

				var url ="";
				if(contact_id != "new"){
					url = "updateContactFromAdmin.action";
					cData.contactID = contact_id;
					MFiCommunication.call(url, cData, displayContact,"");
				}
				else{
					url = "addContactFromAdmin.action";
					MFiCommunication.jQueryAjaxPost(url, cData, displayContact,"");
				}

	               function displayContact(data){
	            	   btn.showProgress(false);
	            	   if(data.state == "SUCCESS"){
	            		   $("#mfi-modal-thin-medium").modal('hide');
	            		   MFiCommunication.call("getContactFromAdmin.action", {licenseeID : MFi.get("enrollid")} ,that.displayContactInfoList);
	            	   }
	               }
			});

			$("#delete_contact").die("click").live("click", function(e) {
				e.preventDefault();
				var btn = $(this);
				var is_primary = $(this).data("primary");
				
				if(is_primary == 1){
					if(MFi.get("roleAS") == Constants.ACCOUNT_SPECIALIST){
						var r=confirm("Are you sure want to Delete ?");
						if (r==true){
							var cid = btn.data("id");
							MFi.set("contactid", cid);
							//<rdar://problem/14720625>
							var contacts_data = JSON.parse(MFi.get("contactslist"));
							var pcontacts = 0;
							$.each(contacts_data, function(j, contactitem) {
								if(contactitem.contactId != cid){
									$.each(contactitem.mfiContactTypes,function(k, contactitem){
										if(contactitem == "Primary"){
											pcontacts ++;
										}
							 		});
								}
							});
							if(pcontacts == 0){
								alert("An account must contain at least 1 primary contact. Please add a new primary contact before deleting the desired primary contact");
							}else{
								btn.showLoader("Deleting", false);
								var cData = {
										licenseeID:MFi.get("enrollid"),
										contactID:cid
									};
								MFiCommunication.call("deleteContactFromAdmin.action", cData, successDelete,"Deleting Contact");
							}
						}
					}else{
						alert("Only AS can delete a Primary Contact");
					}
				}else{
					var r=confirm("Are you sure want to Delete ?");
					if (r==true){
						btn.showLoader("Deleting", false);
						var cid = btn.data("id");
						MFi.set("contactid", cid);
						var contacts_data = JSON.parse(MFi.get("contactslist"));
						var pcontacts = 0;
						$.each(contacts_data, function(j, contactitem) {
							if(contactitem.contactId != cid){
								$.each(contactitem.mfiContactTypes,function(k, contactitem){
									if(contactitem == "Primary"){
										pcontacts ++;
									}
						 		});
							}
						});
						if(pcontacts == 0 && is_primary != 1){
							alert("An account must contain at least 1 primary contact. Please add a new primary contact before deleting the desired primary contact");
						}else{
							var cData = {
									licenseeID:MFi.get("enrollid"),
									contactID:cid
								};
							MFiCommunication.call("deleteContactFromAdmin.action", cData, successDelete,"Deleting Contact");
						}
					}
					 
				}
				function successDelete(data){
					 btn.text("Delete");
	            	   if(data.state == "SUCCESS"){
	            		   MFiCommunication.call("getContactFromAdmin.action", {licenseeID : MFi.get("enrollid")} ,that.displayContactInfoList);
	            	   }
	               } 
			});

			$("#btn-account-edit").die().live("click", function(e) {
				that.editMode();
			});

			var changeStatus = [];

			$("#btn-account-cancel").die().live("click", function(e) {
				that.render();
				/*if(!($.inArray("change", changeStatus) !== -1)){
					that.viewMode();
			    }else{
			    	var r=confirm("Are you sure want to cancel ?");
					if (r==true){
						that.render();
					}
			    }*/
			});

			$("#admin-account").on("click","#btn-account-edit", function(){
				that.editMode();
				var formData = [];
				changeStatus = [];
				$("#admin-account > .editfields").find(":input").each(function(i,item){
					if ($(item).prop("type") === 'checkbox') {
						formData[i] = $(item).prop("checked");
					} else {
						formData[i] = $.trim($(item).val());
					}
					$(item).on("input, change",  function(data){
						var currentVal;
						if ($(this).prop("type") === 'checkbox') {
							currentVal = $(this).prop("checked");
						} else {
							currentVal = $.trim($(this).val());
						}
					  if (currentVal != formData[i]) {
					   changeStatus[i] = "change";
					  }else{
					   changeStatus[i] = "noChange";
					      }
				     });
					
			    });
		    });

			$("#btn-account-save").die().live("click", function(e) {
				e.preventDefault();

				if(!($.inArray("change", changeStatus) !== -1)){
					MFi.statusUpdate("No changes to Save.");
			    }else{

					$("#admin-account").removeClass("editfields readonly");
					$(".max_no_contacts, .cofaceCreditScore, .cofaceRating, .sgsRating, .pp_allowed_per_project, .gmacc_customer_number, .assign_account_specialist").hide();


					if($("#max_no_contacts").val() != "" || $("#cofaceCreditScore").val() != "" || $("#cofaceRating").val() != "" || $("#sgsRating").val() != "" || $("#pp_allowed_per_project").val() != "" || $("#gmacc_customer_number").val() != ""){
						if(isNaN($("#max_no_contacts").val()) ){
							 $(".max_no_contacts").show();
							  $("#max_no_contacts").focus();
							  return false;
						}else
							 $(".max_no_contacts").hide();
						if(isNaN($("#cofaceCreditScore").val()) ){
							 $(".cofaceCreditScore").show();
							  $("#cofaceCreditScore").focus();
							  return false;
						}else{
							if ($("#cofaceCreditScore").val() == Math.round($("#cofaceCreditScore").val())) {
								$(".cofaceCreditScore").hide();
							} else {
								 $(".cofaceCreditScore").show();
								  $("#cofaceCreditScore").focus();
								  return false;
							}
						}

						//<rdar://problem/14252502>
						if($.trim($("#cofaceRating").val()) != "" ){
							var regexp = new RegExp(/^[\d\sRNX@$, ]+$/i);
							if (!regexp.test($("#cofaceRating").val())) {
								$(".cofaceRating").show();
								  $("#cofaceRating").focus();
								  return false;
							}else
								 $(".cofaceRating").hide();
						}
						if(isNaN($("#sgsRating").val()) ){
							 $(".sgsRating").show();
							  $("#sgsRating").focus();
							  return false;
						}else
							 $(".sgsRating").hide();
						if(isNaN($("#pp_allowed_per_project").val()) ){
							 $(".pp_allowed_per_project").show();
							  $("#pp_allowed_per_project").focus();
							  return false;
						}else
							 $(".pp_allowed_per_project").hide();
						if(isNaN($("#gmacc_customer_number").val()) ){
							 $(".gmacc_customer_number").show();
							 $("#gmacc_customer_number").focus();
							  return false;
						}else
							 $(".gmacc_customer_number").hide();
					}
					//<rdar://problem/15438425>
					if($("#assign_account_specialist").val() == undefined || $("#assign_account_specialist").val() ==""){
						$(".assign_account_specialist").show();
						$("#assign_account_specialist").focus();
						return false;
					}
					
					MFi.set("new_creditscore",$('#cofaceCreditScore').val());
					//Account status
					var accountData = {
							licenseeId:MFi.get("enrollid"),
							accountStatus : $("#account_status").val(),
							//phaseName : $('#process_phase').val(),
							//lastChangeStatusDate : $("#last_status_changed").val(),
							//initialSubimissionDate : $("#initial_submission_on").val(),
							licenseeMeetingDate : Utils.setTimezoneDate($("#licensee_met_on").val(),$("#licensee_met_on").data("licenseemetontimehs")),
							//licenseeExecutedDate : $("licensee_executed_on").val(),
							accountType : $("#account_type").val(),
							accountSubtype : $("#account_subtype").val(),
							numberForInvoicing : $('#gmacc_customer_number').val(),
							geo : $("#geo").val(),
							legalCompanyName : $("#legal_company_name").val(),
							/*dbaCompanyName : $("#dba_company_name").val(),
							parentCompanyName : $("#parent_company_name").val(),
							divisionName : $("#division").val(),
							streetAddress : $("#address").val(),
							city : $("#city_town").val(),
							stateOrProvince : $("#state_province").val(),
							postalCode : $("#postal_code").val(),*/
							email : ($("#assign_account_specialist").val()!= null ? $("#assign_account_specialist").val() :""),
							licenseeDocumentViewAttributes : $("#licensee_document_view_attr").val(),
							sellingUnauthorizedProduct : ($("#selling_authorized_product").val() > 0 ? true : false),
							urlOfUnauthorizedProduct : $("#url_authorized_product").val(),
							maxNumberOfContacts : $('#max_no_contacts').val(),
							ppAllowedPerContractNumber : $("#pp_allowed_per_project").val(),
							documentSigningPreference : $("#document_signing_prefrence").val(),
							medProofInsurance : $("#insurance_status").val(),
							specialInterestToFollowUp : ($("#special_follow_up").is(':checked') ? true : false),
							needToTerminate : ($("#need_to_terminate").is(':checked') ? true : false),
							overrideTermination : ($("#override_to_termination").is(':checked') ? true : false),
							incomplianceForRoyalty : ($("#incompliant_royalty").is(':checked') ? true : false),
							lowVolume : ($("#low_volume").is(':checked') ? true : false),
							cofaceCompanyName : $("#cofaceCompanyName").val(),
							cofaceScore : $('#cofaceCreditScore').val(),
							cofaceStatus : $("#cofaceStatus").val(),
							cofaceDecisionDate : Utils.setTimezoneDate($("#cofaceDecisionDate").val(),$("#cofaceDecisionDate").data("cofacedecisionhs")),
							cofaceUpdateDate : Utils.setTimezoneDate($('#cofaceUpdateDate').val(),$("#cofaceUpdateDate").data("cofaceupdatehs")),
							cofaceRequestDate : Utils.setTimezoneDate($("#cofaceRequestDate").val(),$("#cofaceRequestDate").data("cofacerequesths")),
							cofaceRating : $("#cofaceRating").val(),
							easyNumber : $("#easyNumber").val(),
							easyNumberUpdateDate : Utils.setTimezoneDate($("#easyNumberUpdateDate").val(),$("#easyNumberUpdateDate").data("easyNumberUpdatehs")),
							sgsRating:$("#sgsRating").val(),
							sgsStatus:$("#sgsStatus").val(),
							sgsDecisionDate:Utils.setTimezoneDate($("#sgsDate").val(),$("#sgsDate").data("sgstimehs")),
							//ndaExecutionDate:$("#nda_execution_date").val(),
							ndaVersion:$("#nda_version").val(),
 							productCategory : $(
							"#product_category").val(),
							salesContactName : $(
							"#sales_contact_name").val(),
							salesContactEmail: $(
							"#sales_contact_email").val(),
							salesContactPhone : $(
							"#sales_contact_telephone").val(),
							mFgListOptOut : ($(
				            "#mFg_list_opt_out")
				             .is(':checked') ? true
							     : false)	
						};
						function saveAccount(data){
		            	   MFi.set("accspec",1);
		            	   MFi.set("acctype",1);
		            	   MFi.set("accupgrade",1);
		            	   MFi.set("accspecialist",1);
		            	   if(data.state == "SUCCESS"){
		            		   MFi.statusUpdate("Saved");
		            		   that.viewMode();
		            		   //<rdar://problem/14835366>
		            		   if(MFi.get("new_creditscore") != MFi.get("prev_creditscore") &&  MFi.get("roleRM") == Constants.REGIONAL_MANAGER){
		            			   var active_li = $("#mfi-col1 li.active").attr("name");
									MFi.set("active_li",active_li);
									Sidebar.init();
									$("li[name='"+MFi.get("active_li")+"']").addClass("active");
		            		   }
		            		 //<rdar://problem/14544133> MFi 1.0 iQA - Enrollment - No Gap present in-between the two fields present in the Addition Manufacturing Info  ---start//,
		            		 //<rdar://problem/14596705> remove inline styles on selectcontrol when saving changes  ---start//
		            		   $('#mFg_list_opt_out').css('margin','0');
		            		 //<rdar://problem/14596705> remove inline styles on selectcontrol when saving changes  ---end//,
		            		 //<rdar://problem/14544133> MFi 1.0 iQA - Enrollment - No Gap present in-between the two fields present in the Addition Manufacturing Info  ---end//
		            	   }
		                }
						accountData.processInstanceId = MFi.get("pin");
						MFiCommunication.call("submitLicenseeAccountInfo.action", accountData, saveAccount,"Saving Account..");
			    }
				
				
			});


			 $("#saveContract").die("click").live("click", function(e) {
					e.preventDefault();
					var btn = $(this);
					btn.showProgress(true, "Saving...");
					
//<rdar://problem/15411703> System set ccontract term date when no date is entered
//					function getTodayDate(){
//						var today = new Date();
//						var dd = today.getDate();
//						var mm = today.getMonth()+1;//January is 0!
//						var yyyy = today.getFullYear();
//						if(dd<10){dd='0'+dd}
//						if(mm<10){mm='0'+mm}
//						return mm+'/'+dd+'/'+yyyy;
//					}
					
					
					$(".contracttype, .contract_version, .contract_number, .contract_sent_on, .contract_executed_on, .contract_terminated_on").hide();
					//Removing Validations <rdar://problem/15184270>
					//if($("#contracttype").val() != "" && $("#contract_version").val() != "" && $("#contract_number").val() != "" && $("#contract_sent_on").val() != "" && $("#contract_executed_on").val() != "" && $("#contract_terminated_on").val() != "" ){
						var cData = {
								ContractTypeId : $("#contracttype").val(),
								ContractTypeName : $('#contracttype option:selected').text(),
								ContractVersion : $("#contract_version").val(),
								ContractNumber :  $("#contract_number").val(),
								ContractSentDate : Utils.setTimezoneDate($("#contract_sent_on").val(), $("#contract_sent_on").data("contractsenths")),
								ContractExecutedDate : Utils.setTimezoneDate($("#contract_executed_on").val(), $("#contract_executed_on").data("contractexecutedhs")),
								ContractTerminatedDate : Utils.setTimezoneDate($("#contract_terminated_on").val(), $("#contract_terminated_on").data("contractterminatedhs")),
								ContractReceivedDate : Utils.setTimezoneDate($("#contract_received_on").val(), $("#contract_received_on").data("contractreceivedhs")),
								ContractExecutedBy : $("#executed_by").val(),
								ContractTerminationLetterDate : Utils.setTimezoneDate($("#contract_termination_date").val(), $("#contract_termination_date").data("contractterminationhs")),
								LicenseeId : MFi.get("enrollid")
						};
								
						if($("#modified").is(':checked')){
							cData.contractModified = true;
						}else{
							cData.contractModified = false;
						}

						if(MFi.get("contractid") != "new"){
							cData.accountId = MFi.get("contractid");
						}
						MFiCommunication.call("submitContractInfo.action", cData, displayContract);



					/*}else{
						if($("#contracttype").val() == "" || $("#contract_version").val() == "" || $("#contract_number").val() == "" || $("#contract_sent_on").val() == "" || $("#contract_executed_on").val() == "" || $("#contract_terminated_on").val() == "" ){
							if($("#contracttype").val() == ""){
								$(".contracttype").show();
							}
							if($("#contract_version").val() == ""){
								$(".contract_version").show();
							}
							if($("#contract_number").val() == ""){
								$(".contract_number").show();
							}
							if($("#contract_sent_on").val() == ""){
								$(".contract_sent_on").show();
							}
							if($("#contract_executed_on").val() == ""){
								$(".contract_executed_on").show();
							}
							if($("#contract_terminated_on").val() == ""){
								$(".contract_terminated_on").show();
							}
							btn.showProgress(false);
							return false;
						}

					}*/

					 function displayContract(data){
						 btn.showProgress(false);
						 $("#mfi-modal-thin-medium").modal('hide');
						 MFiCommunication.call("getAllContracts.action", {licenseeId : MFi.get("enrollid")}, that.displayContractsList);
					 }
				});

			 $("#delete_contract").die("click").live("click", function(e) {
				 e.preventDefault();
				 var accountid = $(e.currentTarget).data("id");
				 var btn = $(this);
					var usercreated = $(e.currentTarget).data("usercreated");
					var contractexecuted = $(e.currentTarget).data("contractexecuted");
					if(usercreated == "")
						usercreated = 0;
					if(usercreated == 0 && contractexecuted != ""){
						alert("You are not authorized to Delete.");
					}else{
						var r=confirm("Are you sure you want to delete?");
						if (r==true){
							btn.showLoader("Deleting", false);
							MFiCommunication.call("deleteContract.action", {accountId : accountid}, displayContract);
						}
					}

					 function displayContract(data){
						btn.text("Delete");
						$("#mfi-modal-thin-medium").modal('hide');
						MFiCommunication.call("getAllContracts.action", {licenseeId : MFi.get("enrollid")}, that.displayContractsList);
					 }
				});

			 $("#withdraw_contract").die("click").live("click", function(e) {
					e.preventDefault();
					var accountid = $(e.currentTarget).data("id");
					var btn = $(this);
					var dData = {
							accountId : accountid
					};
					var r=confirm("Are you sure you want to Withdraw?");
					if (r==true){
						btn.showLoader("Withdrawing", false);
						MFiCommunication.call("withdrawContract.action", {licenseeId : MFi.get("enrollid")}, withdrawContract);
					}
					else
						return false;

					 function withdrawContract(data){
						btn.text("Withdraw");
						$("#mfi-modal-thin-medium").modal('hide');
						MFiCommunication.call("fetchAllAS.action", {userId : MFi.get("userId")}, displayAssignee, "Loading");
					 }
				});

		},
		createContactModal: function (_el, msg, id) {
            $(".modal-body").html("");
            _el.find("h3").html(msg);
            _el.find(".modal-body").html(
                '<div class="row-fluid modalformcontrols">\
            		<dl class="dl-horizontal">\
            			<dt><label>First Name:</label><sup class="asterisk">*</sup></dt>\
            			<dd><input type="text" id="contact_first_name"><span class="errorLeft hide contact_first_name">Please enter a first name.</span></dd>\
            		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label>Last Name:</label><sup class="asterisk">*</sup></dt>\
	        			<dd><input type="text" id="contact_last_name"><span class="errorLeft hide contact_last_name">Please enter a last name.</span></dd>\
            		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label>Job Title:</label><sup class="asterisk">*</sup></dt>\
	        			<dd><input type="text" id="contact_title" maxlength="100"><span class="errorLeft hide contact_title">Please enter a job title.</span></dd>\
            		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label>Email:</label><sup class="asterisk">*</sup></dt>\
	        			<dd><input type="text" id="contact_email"><span class="errorLeft hide contact_email">Please enter email address</span><span class="errorLeft hide contact_email_valid">Please enter an email address.</span><span class="errorLeft hide duplicate_email"></span></dd>\
            		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label>Phone:</label><sup class="asterisk">*</sup></dt>\
	        			<dd><input type="text" id="contact_phone" maxlength="50"><span class="errorLeft hide contact_phone">Please enter a phone number.</span></dd>\
	        		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label>Mobile:</label></dt>\
	        			<dd><input type="text" id="contact_mobile" maxlength="50"></dd>\
	        		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label>Contact Type:</label><sup class="asterisk">*</sup></dt>\
	        			<dd>\
            				<ul class="remove-bullets two-column-ul">\
	            				<li><input type="checkbox" name="type_group[]" id="is_primary" value="1" /><label for="is_primary">Primary</label></li>\
	            				<li><input type="checkbox" name="type_group[]" id="is_legal" value="2" /><label for="is_legal">Legal</label></li>\
	            				<li><input type="checkbox" name="type_group[]" id="is_technical" value="4" /><label for="is_technical">Technical</label></li>\
	            				<li><input type="checkbox" name="type_group[]" id="is_accounting" value="3" /><label for="is_accounting">Accounting</label></li>\
	            				<li><input type="checkbox" name="type_group[]" id="is_packaging" value="5" /><label for="is_packaging">Packaging</label></li>\
	            				<li><input type="checkbox" name="type_group[]" id="is_procurement" value="6" /><label for="is_procurement">Procurement</label></li>\
			            		<li><input type="checkbox" name="type_group[]" id="is_ats" value="7" /><label for="is_ats">ATS</label></li>\
            				</ul><span class="errorLeft hide type_group">Please select at least one Contact type.</span><span class="errorLeft hide primary_type_group">An account must contain at least 1 primary contact</span></dd>\
            		</dl>\
            		<dl class="dl-horizontal">\
						<dt><label title="DS Person ID">DS Person ID</label></dt>\
						<dd><label id="ds_prs_id"></label></dd>\
					</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label title="Personal Attributes">Personal Attributes</label></dt>\
	        			<dd><input type="text" id="personal_attributes"></dd>\
	        		</dl>\
            		<dl class="dl-horizontal">\
	        			<dt><label title="Personal Document View Attributes">Personal Document View Attributes</label></dt>\
	        			<dd><input type="text" id="doc_view_attributes"><font class="asterisk hide doc_view_attributes">Please enter Personal Document View Attributes</font></dd>\
	        		</dl>\</div>');
            _el.find(".modal-footer").html('<a id ="btnasClose" data-dismiss="modal" class="btn-mfi btn-mfi-default pull-left rm">Cancel</a>\
											<a aria-hidden="true" data-id="'+id+'" id ="btn_ContactSave" class="btn-block btn-mfi pull-right btn-mfi-blue">Save</a>');
            _el.modal('show');
            if(id != "new"){
				$('h3').text("Edit Contact");
				$("#contact_email").attr("disabled", "disabled");
				var contacts_data = JSON.parse(MFi.get("contactslist"));
				$.each(contacts_data, function(j, contactitem) {
					if(contactitem.contactId == id){
						$("#contact_first_name").val(contactitem.name);
						$("#contact_last_name").val(contactitem.lastName);
						$("#contact_email").val(contactitem.primaryContactEmail);
						$("#contact_title").val((contactitem.title != null ? contactitem.title : ""));
						//$("#contact_company").val((contactitem.contactCompany != null ? contactitem.contactCompany : ""));
						$("#contact_mobile").val((contactitem.mobile != null ? contactitem.mobile : ""));
						$("#contact_phone").val((contactitem.phone != null ? contactitem.phone : ""));
						$("#doc_view_attributes").val(contactitem.personalDocumentAttributes);
//						$("#adc_id").val(contactitem.adcPersonId);
						$("#ds_prs_id").text(Boolean(contactitem.dsPrsId)?contactitem.dsPrsId:"");
						$("#personal_attributes").val(contactitem.personalAttributes);
						$.each(contactitem.mfiContactTypes,function(k, contactitem){
							if(contactitem == "Primary")
				 				$("#is_primary").prop('checked', true);
							if(contactitem == "Legal")
								$("#is_legal").prop('checked', true);
							//else
								//$('#is_legal').parent().hide();
							if(contactitem == "Technical")
								$("#is_technical").prop('checked', true);
							if(contactitem == "Accounting")
								$("#is_accounting").prop('checked', true);
							if(contactitem == "Packaging")
								$("#is_packaging").prop('checked', true);
							if(contactitem == "Procurement")
								$("#is_procurement").prop('checked', true);
							if(contactitem == "ATS")
								$("#is_ats").prop('checked', true);
				 		});
					}
				});

			}else{
				$('h3').text("Add Contact");
				$('#is_legal').parent().hide();
			}
            $(".errorLeft").hide();

        },
        createContractModal: function (_el, msg, id) {
        	var that = this;
        	MFiCommunication.call("getMasterContractList.action", null, that.displayContractTypes,"Loading..");
			MFi.set("contractid",id);
            $(".modal-body").html("");
            _el.find("h3").html(msg);
            _el.find(".modal-body").html(
                '<div class="row-fluid modalformcontrols">\
            		<dl class="dl-horizontal">\
            		<dt><label>Contract Type</label><sup class="asterisk">*</sup></dt>\
            		<dd><div class="selectcontrol"><select id="contracttype">\
				          		</select><font class="asterisk hide contracttype">Please select Contract Type</font></div>\
				    	</dd>\
				    </dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Contract Version</label><sup class="asterisk">*</sup></dt>\
		    			<dd><input type="text" id="contract_version"><font class="asterisk hide contract_version">Please enter Contract Version</font></dd>\
	    			</dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Contract Number</label><sup class="asterisk">*</sup></dt>\
		    			<dd><input type="text" id="contract_number"><font class="asterisk hide contract_number">Please enter Contract Number</font></dd>\
	    			</dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Modified?</label></dt>\
	    				<dd><input id="modified" type="checkbox" readonly ></dd>\
	    			</dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Contract Sent on</label><sup class="asterisk">*</sup></dt>\
		    			<dd><input type="text" id="contract_sent_on" ><font class="asterisk hide contract_sent_on">Please select Contract Sent on</font></dd>\
	    			</dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Contract Received on</label></dt>\
		    			<dd><input type="text" id="contract_received_on" readonly></dd>\
            		</dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Contract Executed on</label><sup class="asterisk">*</sup></dt>\
		    			<dd><input type="text" id="contract_executed_on" ><font class="asterisk hide contract_executed_on">Please select Contract Executed on</font></dd>\
	    			</dl>\
            		<dl class="dl-horizontal">\
            		<dt><label>Executed By</label>\
		    			<dd><div class="selectcontrol"><select id="executed_by">\
	            		<option value="">No Value</option>\
	            		<option value="label.ListExecutedBy.Don">Don Ginsburg</option>\
		            		</select></div>\
	    				</dd>\
	    			</dl>\
    				<dl class="dl-horizontal">\
    				<dt><label>Contract Terminated on</label><sup class="asterisk">*</sup></dt>\
	    				<dd><input type="text" id="contract_terminated_on"><font class="asterisk hide contract_terminated_on">Please select Contract Terminated on</font></dl>\
	    			</dl>\
    				<dl class="dl-horizontal">\
    				<dt><label title="Contract Termination Letter Date">Termination Letter Date</label>\
	    				<dd><input type="text" id="contract_termination_date"></dd>\
	    			</dl></div>');
            _el.find(".modal-footer").html('<a id ="btnasClose" data-dismiss="modal" class="btn-mfi btn-mfi-default pull-left rm">Cancel</a>\
            								<a aria-hidden="true" id ="saveContract" class="btn-block btn-mfi pull-right btn-mfi-blue">Save</a>');
            _el.modal('show');
            $("#contract_sent_on, #contract_executed_on, #contract_received_on").datepicker().attr("readonly", true).addClass("hasDatepicker");
            $("#contract_terminated_on, #contract_termination_date").datepicker().addClass("hasDatepicker");
            if(id != "new"){
				$('h3').text("Edit Contract");
				var contracts_data = JSON.parse(MFi.get("contractslist"));
				$.each(contracts_data.resultList[0].LicenseeAccounts, function(j, item) {
					if(item.accountId == id){
						$("#contracttype").val(item.contractTypeId);
						$('#modified').prop('checked', Boolean(item.contractModified));
						$("#contract_version").val(item.contractVersion);
						$("#contract_number").val(item.contractNumber);
						$("#contract_sent_on").val((item.contractSendDate != null ? Utils.getTimezoneDate(item.contractSendDate,"mmddyyyy","/") : item.contractSendDate));
						$("#contract_sent_on").attr("data-contractsenths",(item.contractSendDate != null ? Utils.getTimezoneDate(item.contractSendDate,"hms","/") : item.contractSendDate));
						$("#contract_executed_on").val((item.contractExecutedDate != null ? Utils.getTimezoneDate(item.contractExecutedDate,"mmddyyyy","/") : item.contractExecutedDate));
						$("#contract_executed_on").attr("data-contractexecutedhs",(item.contractExecutedDate != null ? Utils.getTimezoneDate(item.contractExecutedDate,"hms","/") : item.contractExecutedDate));
						$("#contract_terminated_on").val((item.contractTerminationDate != null ? Utils.getTimezoneDate(item.contractTerminationDate,"mmddyyyy","/") : item.contractTerminationDate));
						$("#contract_terminated_on").attr("data-contractterminatedhs",(item.contractTerminationDate != null ? Utils.getTimezoneDate(item.contractTerminationDate,"hms","/") : item.contractTerminationDate));
						$("#contract_received_on").val((item.contractReceiveDate != null ? Utils.getTimezoneDate(item.contractReceiveDate,"mmddyyyy","/") : item.contractReceiveDate));
						$("#contract_received_on").attr("data-contractreceivedhs",(item.contractReceiveDate != null ? Utils.getTimezoneDate(item.contractReceiveDate,"hms","/") : item.contractReceiveDate));
						$("#executed_by").val(item.contractExecutedBy);
						$("#contract_termination_date").val((item.contractTerminationLtrDate != null ? Utils.getTimezoneDate(item.contractTerminationLtrDate,"mmddyyyy","/") : item.contractTerminationLtrDate));
						$("#contract_termination_date").attr("data-contractterminationhs",(item.contractTerminationLtrDate != null ? Utils.getTimezoneDate(item.contractTerminationLtrDate,"hms","/") : item.contractTerminationLtrDate));
					}
				});

			}else{
				$('h3').text("Add Contract");
			}
        },
        
        displayContractTypes: function(data){
        	var contract_html = '<option value="">No Value</option>';
        	$.each(data.resultList[0].MasterContracts, function (j, contract) {
				 contract_html += '<option value="'+contract.contractTypeId+'">'+contract.contractType+'</option>';
			 });
			 $("#contracttype").html(contract_html);
			 if(MFi.get("contracttypeid") != "NOT-AVAILABLE")
				 $("#contracttype").val(MFi.get("contracttypeid"))
        }

	};

	return module;
});

function changeDefVal(){
	var accountType = document.getElementById('account_type');
	if(accountType.options[accountType.selectedIndex].innerHTML == 'Manufacturing'){	
		document.getElementById('sgsStatus').value="label.ListOfCreditPhases.Override";
	}else{
		document.getElementById('sgsStatus').value="";
	}
	if(accountType.options[accountType.selectedIndex].innerHTML == 'Hearing Aid' || accountType.options[accountType.selectedIndex].innerHTML == 'iBeacon - Technology' || accountType.options[accountType.selectedIndex].innerHTML == 'iBeacon - Trademark'){	
		document.getElementById('document_signing_prefrence').value="label.ListOfSignTypes.PaperDocs";
	}
}

function getTheInputHTML(element, id, type, value){
		var myDiv = document.createElement(element != null ? element : "input");
		myDiv.setAttribute('id', id != null ? id : "id1");
		myDiv.setAttribute('type', type != null ? type : "text");
		myDiv.setAttribute('value', value != null ? value : "");
		return myDiv.outerHTML;
}
