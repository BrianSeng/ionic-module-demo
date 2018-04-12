(function() {
    'use strict';
    
    // summary.route.js
    angular
        .module('request.submit')
        .run(appRun);
    
    /* @ngInject */
    function appRun(routerHelper) 
    {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'app.request.submit',
                config: {
                    url: '/submit',
                    views: {
                        'tab-submit': {
                            templateUrl: 'app/requests/request/submit/submit.view.html',
                            controller: 'SubmitCtrl'
                        }        
                    }
                }
            }
        ];
    }
})();