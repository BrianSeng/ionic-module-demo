(function() 
{
    'use strict';
    
    var ctrl = 'RequestCtrl';
    angular.module('app.request')
    
    .controller(ctrl, function($scope, SettingsSvc) 
    {
        $scope.settingsSvc = SettingsSvc;
    });
})();