(function () {
    'use strict';

    let ctrl = 'WizardCtrl';
    angular
        .module('request.wizard')
        .controller(ctrl, function ($scope, $state, $ionicPopup, $timeout, Segment
                                    , RequestSvc, SettingsSvc, UtilitySvc) 
        {
            $scope.requestSvc = RequestSvc;
            $scope.settingsSvc = SettingsSvc;
            $scope.utilitySvc = UtilitySvc;
//
// Public Methods & Properties
//
            $scope.addSegment = _addSegment;
            $scope.goToSlide = _goToSlide;
            $scope.goBack = _goBack;
//
// OBSERVED EVENTS - view enter/leave, slider events
//
            $scope.$on('$ionicView.enter', function () { _init(); });
            $scope.$on('$ionicView.leave', function () { _cleanUp(); });
            $scope.$on("$ionicSlides.sliderInitialized", function (event, data) { _getSliderObj(data) });
            $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) { _updateActiveIdx(data); });
//
// Private Methods - initCtrl, add, cleanUp, addSegment, checkIfReturnFlight
//       
            function _init() 
            {
                console.log("WizardCtrl.enter");
                //hide tab nav bar
                document.querySelector(".tab-nav")['style'].display = 'none';

                _initSlider();
                UtilitySvc.scrollToTop("contentTop");
                
                if (!$scope.currentSegment) 
                {
                    $scope.currentSegment = new Segment();
                }

                console.log("Current Segment Model ->", $scope.currentSegment);
            }

            function _cleanUp() 
            {
                console.log("WizardCtrl.leave");
                
                document.querySelector(".tab-nav")['style'].display = 'flex';
                SettingsSvc.activeWizardSlide = 0;
                $scope.currentSegment = new Segment();
            }

            function _addSegment(currentSegment)
            {
                if(currentSegment)
                {
                    if (currentSegment.arrivingAirport && currentSegment.departingAirport) 
                    {
                        currentSegment.title = currentSegment.departingAirport + " to " + currentSegment.arrivingAirport;
                    }
                    console.log("Adding Current Segment:", currentSegment);

                    RequestSvc.currentRequest.addSegment(currentSegment);
                    RequestSvc.currentRequest.save();

                    _alertAndRedirect();                    
                }

                function _alertAndRedirect() 
                {
                    let successAlert = $ionicPopup.alert({
                        title: '<b>Travel Segment Added To Trip!</b><br /><img class="success-gif" src="img/success-checkmark.gif"/>'
                    });

                    successAlert.then(function(res) { console.log("New Segment Added To -->", RequestSvc.currentRequest); });

                    $timeout(function () 
                    {
                        successAlert.close();
                        $state.go('app.request.segments');                            
                    }, 1500);
                }
            }

            function _checkIfReturnFlight()
            {
                // note: the indexes are 0-based
                if ($scope.currentSegment.isReturnFlight) 
                {
                    if ($scope.activeIndex == 1 || $scope.activeIndex == 2) 
                    {
                        let confirmPgIdx = 4;
                        let confirmPopup = $ionicPopup.confirm({
                            title: 'Confirm Return Flight',
                            template: 'We noticed this flight is marked as a return trip. Would you like to skip to the confirmation page to add?'
                        });

                        confirmPopup
                            .then(function(res) 
                            {
                                if(res) 
                                {
                                    //$scope.activeIndex = confirmPgIdx;
                                    console.log('Skipping');
                                    $scope.slider.slideTo(confirmPgIdx);
                                    UtilitySvc.scrollToTop("contentTop");
                                } 
                                else 
                                {
                                    console.log('Cancel Skip');
                                    return;
                                }
                            });
                    }
                }
            }

            function _goBack() 
            {
                $state.go('app.request.segments');
            };
//
// ION-SLIDES - init, getSliderObj, updateActiveIdx, goToSlide
//
            function _initSlider() 
            {
                $scope.sliderOptions = {
                    loop: false
                    , effect: 'fade'
                    , speed: 500
                    , initialSlide: 0
                }
                //always start at the first slide when entering the view
                $scope.activeIndex = $scope.sliderOptions.initialSlide;
                $scope.slider.slideTo($scope.sliderOptions.initialSlide);
            }

            function _getSliderObj(data)
            {
                //bind slider object to $scope
                $scope.slider = data.slider;
            }

            function _updateActiveIdx(data)
            {
                console.log('===> Slide Change End <===');

                $scope.$apply(function()
                {
                    // note: the indexes are 0-based
                    $scope.activeIndex = data.slider.activeIndex;
                })

                _checkIfReturnFlight();
                
                console.log("Active Slide Index ->", $scope.activeIndex);
                //console.log("Current Segment Model ->", $scope.currentSegment);
            }

            function _goToSlide(index)
            {
                if($scope.slider && index || index == 0)
                {
                    $scope.slider.slideTo(index, 1000);
                    $scope.activeIndex = index;
                }
            }

            
        });
})();
