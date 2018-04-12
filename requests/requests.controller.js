(function() {
'use strict';

let ctrl = 'RequestsCtrl';
angular.module('app.requests')

.controller(ctrl, function($scope, $q, $state, $ionicPopup, $ionicModal, $log, $timeout
                            , $ionicLoading, $cordovaEmailComposer, $ionicListDelegate
                            , logger, Request, RequestSvc, ReportSvc, EmailSvc, SettingsSvc)
{
    $scope.requestSvc = RequestSvc;
    $scope.gotoRequest = _gotoRequest;
    $scope.deleteRequest = _deleteRequest;
    $scope.saveRequest = _saveRequest;
    $scope.sendRequest = _sendRequest;

    $scope.$on('$ionicView.enter', function() { _init(); });
    $scope.$on('$ionicView.leave', function() { _save(); });
    //_init();
    function _init() {
        //$ionicLoading.show();
		logger.info('Enter Controller: ' + ctrl);
        RequestSvc.ready().then(function() {
            console.info('RequestSvc ready to get rockin and rollin...');
            $ionicLoading.hide();
        });
		$scope.$on('RequestSvc::ready', function(event, msg) {
			$scope.$apply();
            $ionicLoading.hide();
		});
//
// ReportSvc Event Listeners: Progress/Done
//
		$scope.$on('ReportSvc::Progress', function(event, msg) {
			showLoading(msg);
		});
		$scope.$on('ReportSvc::Done', function(event, err) {
			hideLoading();
        });

        console.log("Requests Collection ->", RequestSvc.requests)
    }

    function _save() {
		logger.info('Save RequestSvc: ' + ctrl, 'no data');
        console.log('RequestCtrl: saving tripSvc data to localStorage');
        //RequestSvc.pause();
    }

    function _gotoRequest(r) {
        console.log('Set Current Request --> ' + r.title);
        RequestSvc.currentRequest = r;
        console.log("States:", $state.get());
        $state.go('app.request.summary');
    }

    function _deleteRequest(r) {
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Request',
         template: 'Are you sure you want to delete the request:<br/><br/><b>' + r.title + '</b>'
        });
        return confirmPopup.then(function(res) {
            if(res) {
                console.log('Delete Request');
                return RequestSvc.deleteRequest(r);
            } else {
                console.log('Cancel Delete');
                $ionicListDelegate.closeOptionButtons();
                return;
            }
        }).finally($ionicListDelegate.closeOptionButtons);
    }

    function _saveRequest() 
    {
        RequestSvc.addRequest($scope.newRequest);
        //RequestSvc.pause();

        let successAlert = $ionicPopup.alert({
            title: '<b>Travel Request Successfully Created!</b><br /><img class="success-gif" src="img/success-checkmark.gif"/>'
        });

        successAlert.then(function(res) { $log.log('RequestsCtrl_saveRequest()'); });

        $timeout(function () 
        {
            successAlert.close();
            $scope.travelerModal.hide();

            RequestSvc.currentRequest = $scope.newRequest;
            $scope.newRequest = {};
            
            $state.go('app.request.segments');
        }, 1500);
    };

    // function _sendRequest(r)
    // {
    //     _validateRequest(r)
    //         .then(function (res) 
    //         {
    //             if (res) 
    //             {
    //                 _confirmProfileEmail()
    //                     .then(function(res) 
    //                     {
    //                         var reportPath = "";
    //                         if (res) 
    //                         {
    //                             return ReportSvc
    //                                 .runReportAsync(r)
    //                                 .then(function(filePath) 
    //                                 {
    //                                     reportPath = filePath;
    //                                     return $ionicPopup.alert({
    //                                         title: 'Submitting Travel Request',
    //                                         template: 'A report was generated for your travel request <b>'
    //                                             + r.title + '</b>.  An email is being drafted with the report attached for completing your submission to the travel office.'
    //                                     });
    //                                 })
    //                                 .then(function(res) 
    //                                 {
    //                                     console.log('drafting email to send report');
    //                                     return EmailSvc
    //                                         .sendRequest(reportPath);
    //                                 })
    //                                 .catch(function(e) 
    //                                 {
    //                                     // workaround for the .reject() that always fires in $cordovaEmailComposer.open()
    //                                     if(e)
    //                                     {
    //                                         //make sure to close the swiped buttons
    //                                         $ionicListDelegate.closeOptionButtons();
    //                                         $ionicPopup.alert({
    //                                             title: 'Submission Problem',
    //                                             template: 'There was a problem preparing your request report email for submission.'
    //                                         });
    //                                         return $q.reject(e);
    //                                     }
    //                                     else
    //                                     {
    //                                         let successAlert = $ionicPopup.alert({
    //                                             title: '<b>Request Emailed Successfully!</b><br /><img class="success-gif" src="img/success-checkmark.gif"/>'
    //                                         });
                    
    //                                         successAlert.then(function(res)
    //                                         {
    //                                             r.isSubmitted = true;
    //                                             r.save();
    //                                             //$state.go('app.requests');
    //                                             $ionicListDelegate.closeOptionButtons();
    //                                         });
                    
    //                                         $timeout(function () 
    //                                         {
    //                                             successAlert.close();
    //                                         }, 1500);
    //                                     }
    //                                 });
    //                         }
    //                     });
    //             }
                
    //         })
    //         .catch(function(e){
    //             console.log(e);
    //         })
    // }
    function _sendRequest(r) 
    {
        if (_validateRequest(r)) 
        {
            _confirmProfileEmail().then(function(res) 
            {
                var reportPath = "";
                if (res) 
                {
                    return ReportSvc
                        .runReportAsync(r)
                        .then(function(filePath) 
                        {
                            reportPath = filePath;
                            return $ionicPopup.alert({
                                title: 'Submitting Travel Request',
                                template: 'A report was generated for your travel request <b>'
                                    + r.title + '</b>.  An email is being drafted with the report attached for completing your submission to the travel office.'
                            });
                        })
                        .then(function(res) 
                        {
                            console.log('drafting email to send report');
                            return EmailSvc
                                .sendRequest(reportPath, r, SettingsSvc.sportSupervisor.email);
                        })
                        .catch(function(e) 
                        {
                            // workaround for the .reject() that always fires in $cordovaEmailComposer.open()
                            if(e)
                            {
                                //make sure to close the swiped buttons
                                $ionicListDelegate.closeOptionButtons();
                                $ionicPopup.alert({
                                    title: 'Submission Problem',
                                    template: 'There was a problem preparing your request report email for submission.'
                                });
                                return $q.reject(e);
                            }
                            $ionicListDelegate.closeOptionButtons();
                            // will always prompt dialog even if canceling email
                            // else
                            // {
                            //     let successAlert = $ionicPopup.alert({
                            //         title: '<b>Request Emailed Successfully!</b><br /><img class="success-gif" src="img/success-checkmark.gif"/>'
                            //     });
        
                            //     successAlert.then(function(res)
                            //     {
                            //         r.isSubmitted = true;
                            //         r.save();
                            //         //$state.go('app.requests');
                            //         $ionicListDelegate.closeOptionButtons();
                            //     });
        
                            //     $timeout(function () 
                            //     {
                            //         successAlert.close();
                            //     }, 1500);
                            // }
                        });
                }
            });
        } 
        else 
        {
            return $ionicPopup.alert({
                title: 'Invalid Request',
                template: 'Your trip is missing a purpose, or a start date, or both.  Please correct and resubmit.'
            });
        }
	}

    function _validateRequest(r) 
    {
        var isValid = true;

        logger.info('RequestsCtrl::validateRequest', 'TODO - need to insert code to validate still');
        return isValid;
    }
    // function _validateRequest(r) 
    // {
    //     var deferred = $q.defer();
    //     //TODO
    //     // insert code to validate the details of the request

    //     if (r.isSubmitted) 
    //     {
    //         let confirmPopup = $ionicPopup.confirm({
    //             title: 'Request Resubmission',
    //             template: 'We noticed that this request, ' + r.title + ', has been submitted already. Would you like to resubmit it?'
    //         });

    //         return confirmPopup
    //             .then(function(res) 
    //             {
    //                 if(!res) 
    //                 {
    //                     console.log('Cancel Resubmit');
    //                     return deferred.reject(false);
    //                 }
    //                 else
    //                 {
    //                     return deferred.resolve(true);
    //                 }
    //             })
    //             .finally($ionicListDelegate.closeOptionButtons);
    //     }
    //     else
    //     {
    //         // will eventually have a path for IF NOT VALID
    //         return deferred.resolve(true);
    //     }
    //     //logger.info('RequestsCtrl::validateRequest', 'TODO - need to insert code to validate still');
    // }

    function _confirmProfileEmail() 
    {
        if (SettingsSvc.sportSupervisor.email && (SettingsSvc.defaultEmail || SettingsSvc.defaultEmail.length >= 7 || RequestSvc.currentRequest.travelerEmail || RequestSvc.currentRequest.travelerEmail.length >= 7) ) 
        {
            return $q.when(true);
        } 
        else 
        {
            var confirmOptions = {
                title: 'No Email', // String. The title of the popup.
                template: 'You do not appear to have a valid email address for this travel request.  Please check <b>Settings</b> to make sure you have a valid email entered and a sport supervisor selected to email the request to.'
            };
            return $ionicPopup.alert( confirmOptions ).then(function() { return false; });
        }
    }

    function _newRequest() 
    {
        //set today as the start date
        var startDate = new Date();
        //and set the endDate default to 5 days from start
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(5));
        //create the trip w/ a title, city, start and end
        var request = new Request({
            title: SettingsSvc.defaultTitle?SettingsSvc.defaultTitle:""
            , travelerFirstName: SettingsSvc.firstName?SettingsSvc.firstName:""
            , travelerMiddleName: SettingsSvc.middleName?SettingsSvc.middleName:""
            , travelerLastName: SettingsSvc.lastName?SettingsSvc.lastName:""
            , travelerGender: SettingsSvc.defaultGender?SettingsSvc.defaultGender:""
            , travelerDob: SettingsSvc.defaultDob?moment(SettingsSvc.defaultDob):moment()
            , travelerCell: SettingsSvc.defaultCell?SettingsSvc.defaultCell:""
            , travelerEmail: SettingsSvc.defaultEmail?SettingsSvc.defaultEmail:""
            , purpose: SettingsSvc.defaultPurpose?SettingsSvc.defaultPurpose:""
            , knownTravelerNumber: SettingsSvc.knownTravelerNumber?SettingsSvc.knownTravelerNumber:""
            //fau properties
            , fauAccount: SettingsSvc.defaultAcct?SettingsSvc.defaultAcct:""
            , fauCC: SettingsSvc.defaultAcctCC?SettingsSvc.defaultAcctCC:""
            , fauProject: SettingsSvc.defaultAcctProj?SettingsSvc.defaultAcctProj:""
            , isSubmitted: false
        });

        return request;
    }

//
// MODAL - Add Request Form
//
    $ionicModal.fromTemplateUrl('app/requests/request.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.travelerModal = modal;
    });
    $scope.openModal = function() 
    {
        $scope.modalTitle = "Add Request";
        $scope.headerBtn = "Next";
        $scope.newRequest = _newRequest();
        $scope.newRequest.travelerDob = moment($scope.newRequest.travelerDob).toDate();

        $scope.travelerModal.show();
    };
    $scope.closeModal = function() 
    {
        $scope.travelerModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.travelerModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
//
// Loading UI Functions: utility functions to show/hide loading UI
//
    function showLoading(msg) {
        $ionicLoading.show({
          template: msg
        });
    }
    function hideLoading(){
        $ionicLoading.hide();
    }
});
})();
