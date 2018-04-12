(function() {
    'use strict';
    
    // wizard.route.js
    angular
        .module('request.wizard')
        .run(appRun);
    
    /* @ngInject */
    function appRun(routerHelper) 
    {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'app.request.wizard',
                config: {
                    url: '/wizard'
                    , views: {
                        'wizard-content': {
                            templateUrl: 'app/requests/request/wizard/wizard.view.html',
                            controller: 'WizardCtrl'
                        }        
                    }
                }
            }
        ];
    }
    })();