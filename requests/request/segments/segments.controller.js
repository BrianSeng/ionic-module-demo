(function () {
'use strict';

let ctrl = 'SegmentsCtrl';
angular
    .module('request.segments')
    .controller(ctrl, function ($scope, $state, $ionicModal
                                , RequestSvc, UtilitySvc
                                , $ionicPopup, $ionicListDelegate) 
    {
        $scope.requestSvc = RequestSvc;
        $scope.utilitySvc = UtilitySvc;
//
// Public Methods - add, update and delete
//
        $scope.goBack = _goBack;
        $scope.openSegmentWizard = _openSegmentWizard;
        $scope.viewSegment = _viewSegment;
        $scope.deleteSegment = _deleteSegment;
//
// Private Methods - add, update and delete
//       
        $scope.$on('$ionicView.enter', function () { _init(); });
        // $scope.$on('$ionicView.leave', function() { _save(); });

        function _init() 
        {
            //console.log("Current Segment ->");

            UtilitySvc.scrollToTop("contentTop");
        }

        function _goBack() 
        {
            $state.go('app.requests');
        }

        function _viewSegment(segment) 
        {
            if (segment)
                RequestSvc.currentSegment = segment;

            $state.go('app.request.segment');
        }

        function _openSegmentWizard() 
        {
            if (_hasReturnSegment()) 
            {
                return $ionicPopup.alert({
                    title: 'Return Segment Already Exists',
                    template: 'Your trip seems to already contain a final return segment.<br/><br/><b>Please delete it to add more.<b>'
                });
            }
            else
            {
                $state.go('app.request.wizard');
            }
            
            function _hasReturnSegment() 
            {
                // test if collection contains a return segment
                return RequestSvc.currentRequest.segments.some(function(elem){ return elem.isReturnFlight === true });
            }
        }

        function _deleteSegment(segment)
        {
            if (segment) 
            {
                let confirmPopup = $ionicPopup.confirm({
                    title: 'Delete Segment',
                    template: 'Are you sure you want to delete the segment:<br/><br/><b class="col-33 col-offset-33">' + segment.title + '</b>'
                });  
                return confirmPopup.then(
                    function(res) 
                    {
                        if(res) 
                        {
                            console.log('Deleting Segment');
                            return _spliceSegment(segment);
                        } 
                        else 
                        {
                            console.log('Cancel Delete');
                            $ionicListDelegate.closeOptionButtons();
                            return;
                        }
                    })
                    .finally($ionicListDelegate.closeOptionButtons);
            }

            function _spliceSegment(segment)
            {
                let index = RequestSvc.currentRequest.segments.indexOf(segment);
                
                RequestSvc.currentRequest.segments.splice(index, 1);
                RequestSvc.currentRequest.save();
            }
        }
    });
})();
