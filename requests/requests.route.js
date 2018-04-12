(function() {
    'use strict';

    angular
        .module('app.requests')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.requests',
                config: {
                    url: '/requests',
                    views: {
                        'menuContent': {
                            templateUrl: 'app/requests/requests.view.html',
                            controller: 'RequestsCtrl'
                        }        
                    }
                }
            }
        ];
    }
})();