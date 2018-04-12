(function () 
{
    'use strict';
    
    let ctrl = 'SubmitCtrl';
    angular
    .module('request.submit')
    .controller(ctrl, function ($scope, $state, $timeout, $ionicListDelegate
                                , $ionicModal, $ionicPopup, $ionicLoading
                                , UtilitySvc, SettingsSvc, RequestSvc, $q
                                , EmailSvc, ReportSvc, logger) 
    {
        $scope.requestSvc = RequestSvc;
        $scope.utilitySvc = UtilitySvc;
        $scope.settingsSvc = SettingsSvc;
//
// Public Methods - 
//
        $scope.goBack = _goBack;
        $scope.sendRequest = _sendRequest;
//
// Private Methods - 
//      
        $scope.$on('$ionicView.enter', function () { _init(); });
        // $scope.$on('$ionicView.leave', function() { _save(); });

        function _init() 
        {
            console.info("Current Segment ->", RequestSvc.currentSegment);

            // output --> "4-764205-RE-70500-ProjName" || "N/A - Incomplete FAU Info Provided"
            $scope.fauString = (SettingsSvc.defaultAcct.acctNumber && SettingsSvc.defaultAcctCC.code) || (RequestSvc.currentRequest.fauAccount.acctNumber && RequestSvc.currentRequest.fauCC.code) ? `4-${SettingsSvc.defaultAcct.acctNumber||RequestSvc.currentRequest.fauAccount.acctNumber}-${SettingsSvc.defaultAcctCC.code||RequestSvc.currentRequest.fauCC.code}-70500${SettingsSvc.defaultAcctProj||RequestSvc.currentRequest.fauProject?"-"+(SettingsSvc.defaultAcctProj||RequestSvc.currentRequest.fauProject):""}`:"N/A - Incomplete FAU Info Provided";
//
// ReportSvc Event Listeners: Progress/Done
//
            $scope.$on('ReportSvc::Progress', (event, msg) => { _showLoading(msg); });
            $scope.$on('ReportSvc::Done', (event, err) => { _hideLoading(); });
        }

        function _goBack() 
        {
            $state.go('app.requests');
        }

        // On Submit Btn Click
        function _sendRequest(r) 
        {
            if (RequestSvc.currentRequest.comments) 
            {
                RequestSvc.saveRequest(RequestSvc.currentRequest);    
            }

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
//
// Loading UI Functions: utility functions to show/hide loading UI
//
        function _showLoading(msg) 
        {
            $ionicLoading.show({
                template: msg
            });
        }
        function _hideLoading()
        {
            $ionicLoading.hide();
        }
    });
})();
    