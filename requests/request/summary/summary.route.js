(function() {
    'use strict';
    
    // summary.route.js
    angular
        .module('request.summary')
        .run(appRun);
    
    /* @ngInject */
    function appRun(routerHelper) 
    {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'app.request.summary',
                config: {
                    url: '/summary',
                    views: {
                        'tab-summary': {
                            templateUrl: 'app/requests/request/summary/summary.view.html',
                            controller: 'SummaryCtrl'
                        }        
                    }
                }
            }
        ];
    }
})();