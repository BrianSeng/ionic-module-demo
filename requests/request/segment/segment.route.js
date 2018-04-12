(function() {
    'use strict';
    
    // segment.route.js
    angular
        .module('request.segment')
        .run(appRun);
    
    /* @ngInject */
    function appRun(routerHelper) 
    {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'app.request.segment',
                config: {
                    url: '/segment',
                    views: {
                        'segment-detail': {
                            templateUrl: 'app/requests/request/segment/segment.view.html',
                            controller: 'SegmentCtrl'
                        }        
                    }
                }
            }
        ];
    }
    })();