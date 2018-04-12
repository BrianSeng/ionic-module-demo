(function() {
    'use strict';

    angular
        .module('app.request')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.request'
                , config: {
                    url: '/request'
                    , abstract: true
                    , views: {
                        'menuContent': {
                            templateUrl: 'app/requests/request/request.view.html'
                            , controller: 'RequestCtrl'
                        }
                    }
                }
            }
        ];
    }
})();
