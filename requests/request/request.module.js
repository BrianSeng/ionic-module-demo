(function() {
    'use strict';

    angular.module('app.request'
                    , ['request.summary'
                        ,'request.segments'
                        , 'request.segment'
                        , 'request.wizard'
                        , 'request.submit'
                    ]
                );
})();