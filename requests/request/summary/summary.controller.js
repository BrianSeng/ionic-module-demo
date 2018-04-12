(function()
{
	'use strict';

    let ctrl = 'SummaryCtrl';
    
    angular
    .module('request.summary')
    .controller(ctrl, function($scope, $state, $q, $timeout, $ionicListDelegate, $ionicModal
                                , $ionicPopup, logger, UtilitySvc, SettingsSvc, RequestSvc
                                , AccountSvc, EmailSvc, ReportSvc)
	{
        $scope.requestSvc = RequestSvc;        
        $scope.utilitySvc = UtilitySvc;        
        $scope.accountSvc = AccountSvc;        
//
// Public Methods - add, update and delete
//
        $scope.goBack = _goBack;
        $scope.openTravelerModal = _openTravelerModal;        
        $scope.openFauModal = _openFauModal;        
        $scope.closeModal = _closeModal;
        $scope.saveRequest = _saveRequest;
        $scope.saveFau = _saveFau;
//
// Private Methods - add, update and delete
//       
        $scope.$on('$ionicView.enter', function() { _init(); });
        $scope.$on('$ionicView.leave', function() { RequestSvc.saveRequest(RequestSvc.currentRequest); });

        function _init() 
        {
            console.log("Current Request ->", RequestSvc.currentRequest);

            UtilitySvc.scrollToTop("contentTop");

            _loadModals();
        }

        function _goBack()
    	{
    		$state.go('app.requests');
    	}
        // On Submit Traveler Info Update
        function _saveRequest()
        {
            RequestSvc.saveRequest($scope.newRequest);
            $scope.newRequest = {};
            $scope.travelerModal.hide();
        }
        // On Submit FAU Update
        function _saveFau()
        {
            // Add validation check before saving
                //....

            RequestSvc.currentRequest.fauAccount = $scope.currentFau.account;
            RequestSvc.currentRequest.fauCC = $scope.currentFau.cc;
            RequestSvc.currentRequest.fauProject = $scope.currentFau.project;
            
            RequestSvc.saveRequest(RequestSvc.currentRequest);
            
            $scope.fauModal.hide();
        }
//
// MODALS - Edit Traveler Info & Edit FAU Info
//
        function _loadModals()
        {
            _loadTravelerModal();
            _loadFauModal();

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() 
            {
                $scope.travelerModal.remove();
                $scope.fauModal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function() 
            {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() 
            {
                // Execute action
            });

            function _loadTravelerModal()
            {
                $ionicModal
                    .fromTemplateUrl('app/requests/request.modal.html', {
                        scope: $scope
                        , animation: 'slide-in-up'
                    })
                    .then(function(modal) 
                    {
                        $scope.travelerModal = modal;
                    });
            }
            function _loadFauModal()
            {
                $ionicModal
                    .fromTemplateUrl('app/requests/request/summary/summary.fau-modal.html', {
                        scope: $scope
                        , animation: 'slide-in-up'
                    })
                    .then(function(modal) 
                    {
                        $scope.fauModal = modal;
                    });
            }
        };
        function _openTravelerModal() 
        {
            $scope.modalTitle = "Update Request";
            $scope.headerBtn = "Save";
            $scope.newRequest = RequestSvc.currentRequest;
            $scope.newRequest.travelerDob = moment($scope.newRequest.travelerDob).toDate();

            $scope.travelerModal.show();
        };
        function _openFauModal() 
        {
            // IF SETTING CONFIGURED --> Look through data service and set to matching obj in data svc array 
            // ELSE IF NOT CONFIGURED --> Set default val to first obj in relevant data svc array
            // WHY? --> Stored obj in PouchDB uses old ng-repeat $$hashkey, must re-assign to same obj in data svc array to properly auto-populate dropdown
            $scope.currentFau = {
                account: RequestSvc.currentRequest.fauAccount ? _.findWhere(AccountSvc.accounts, { acctNumber: RequestSvc.currentRequest.fauAccount.acctNumber }) : AccountSvc.accounts[0]
                , cc: RequestSvc.currentRequest.fauCC ? _.findWhere(AccountSvc.costCenters, { code: RequestSvc.currentRequest.fauCC.code }) : AccountSvc.costCenters[0]
                , project: RequestSvc.currentRequest.fauProject ? RequestSvc.currentRequest.fauProject : ""
            };
            $scope.fauModal.show();
        };
        function _closeModal(currentModal) 
        {
            currentModal.hide();
            //$scope.modal.hide();
        };
        
	});
})();
