(function() {
    'use strict';
    
    // summary.route.js
    angular
        .module('request.segments')
        .run(appRun);
    
    /* @ngInject */
    function appRun(routerHelper) 
    {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'app.request.segments',
                config: {
                    url: '/segments',
                    views: {
                        'tab-segments': {
                            templateUrl: 'app/requests/request/segments/segments.view.html',
                            controller: 'SegmentsCtrl'
                        }        
                    }
                }
            }
        ];
    }
    })();