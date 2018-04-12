(function()
{
	'use strict';

	let ctrl = 'SegmentCtrl';
	angular.module('request.segment')

	.controller(ctrl, function($scope, $state, $ionicModal, RequestSvc, UtilitySvc)
	{
        $scope.requestSvc = RequestSvc;
        $scope.utilitySvc = UtilitySvc;
//
// Public Methods - add, update and delete
//
        $scope.goBack = _goBack;
        $scope.saveSegment = _saveSegment;
        $scope.goToSlide = _goToSlide;
        $scope.openModal = _openModal;
        $scope.closeModal = _closeModal;
        
//
// Private Methods - add, update and delete
//       
        $scope.$on('$ionicView.enter', function() { _init(); });
        $scope.$on('$ionicView.leave', function() { _cleanUp(); });
        $scope.$on("$ionicSlides.sliderInitialized", function (event, data) { $scope.slider = data.slider; });

        function _init() 
        {
            console.log("SegmentCtrl.enter");
            console.log("Current Request ->", RequestSvc.currentRequest);
            console.log("Current Segment ->", RequestSvc.currentSegment);

            document.querySelector(".tab-nav")['style'].display = 'none';
            
            _initSlider();
            _initModals();
        }
        
        function _cleanUp()
        {
            console.log("SegmentCtrl.enter");

            document.querySelector(".tab-nav")['style'].display = 'flex';
        }

        function _goBack()
        {
            $state.go('app.request.segments');
        }

        function _saveSegment(currentModal)
        {
            let index = RequestSvc.currentRequest.segments.indexOf(RequestSvc.currentSegment);
            // console.log("Segments Collection ->", RequestSvc.currentRequest.segments);
            // console.log("Index of Current Segment ->", index);
            
            //replace segment in collection w/ updated copy & then save
            RequestSvc.currentRequest.segments[index] = $scope.segmentCopy;
            RequestSvc.currentRequest.save();

            _closeModal(currentModal);
        }
//
// ION-SLIDES - init, goToSlide
//
        function _initSlider() 
        {
            $scope.sliderOptions = {
                loop: false
                //, effect: 'fade'
                , speed: 500
                , initialSlide: 0
            }

            $scope.$on("$ionicSlides.slideChangeStart", function (event, data) 
            {
                console.log('Slide change start');
            });

            $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) 
            {
                console.log('Slide change end');
                // note: the indexes are 0-based

                $scope.$apply(function()
                {
                    // note: the indexes are 0-based
                    $scope.activeIndex = data.slider.activeIndex;
                })
                
                //console.log("Active Slide Index ->", $scope.activeIndex);
                //console.log("Current Segment Model ->", $scope.currentSegment);
            });

            //always start at the first slide when entering the view
            $scope.activeIndex = $scope.sliderOptions.initialSlide;
            $scope.slider.slideTo($scope.sliderOptions.initialSlide);
        }

        function _goToSlide(index)
        {
            if($scope.slider && index || index == 0)
            {
                $scope.slider.slideTo(index, 1000);
                $scope.activeIndex = index;
            }
        }
//
// MODALS - Edit Flight, Rental, & Hotel
//
        function _initModals()
        {
            _loadModal('flight', 'app/requests/request/segment/segment.flight-modal.html');
            _loadModal('rental', 'app/requests/request/segment/segment.rental-modal.html');
            _loadModal('hotel', 'app/requests/request/segment/segment.hotel-modal.html');

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() 
            {
                $scope.flightModal.remove();
                $scope.rentalModal.remove();
                $scope.hotelModal.remove();
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

            function _loadModal(modalName, templateUrl)
            {
                $ionicModal
                    .fromTemplateUrl(templateUrl, {
                        scope: $scope
                        , animation: 'slide-in-up'
                    })
                    .then(function(modal) 
                    {
                        modalName = modalName + 'Modal';
                        $scope[modalName] = modal;
                    });
            }
        };
        
        function _openModal(modal) 
        {
            $scope.segmentCopy = RequestSvc.currentSegment;

            $scope.segmentCopy.departureTime = moment($scope.segmentCopy.departureTime).toDate();
            $scope.segmentCopy.rental.pickupDate = moment($scope.segmentCopy.rental.pickupDate).toDate();
            $scope.segmentCopy.rental.dropoffDate = moment($scope.segmentCopy.rental.dropoffDate).toDate();
            $scope.segmentCopy.hotel.checkInDate = moment($scope.segmentCopy.hotel.checkInDate).toDate();
            $scope.segmentCopy.hotel.checkOutDate = moment($scope.segmentCopy.hotel.checkOutDate).toDate();

            modal.show();
        };

        function _closeModal(currentModal) 
        {
            currentModal.hide();
        };
	});
})();
