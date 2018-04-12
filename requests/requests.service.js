(function() {
    'use strict';

    var svc = 'RequestSvc'
    angular.module('app.requests')

    .service(svc, function($q, $log, $rootScope, Request, Pouch) {
        var self = this;
        //array of Request ojbects and the current request object
        self.requests = [];
        self.currentRequest = {};
        self.currentSegment = {};
        self.isReady = false;
        self.readyCallbacks = [];
        self.readyPromises = [];
        _hydrateFromPouch();
//
// Public Methods - add, update and delete
//
        self.ready = _ready;
        self.addRequest = _addRequest;
        self.saveRequest = _saveRequest;
        self.deleteRequest = _deleteRequest;
//
// Private Methods - add, update and delete
//
        function _ready(cb) {

            return $q(function(resolve, reject) {
                if (self.isReady)
                    resolve(true);
                else
                    self.readyPromises.push({ res: resolve, rej: reject });
            });
//            if (self.isReady)
//                cb();
//            else
//                self.readyCallbacks.push(cb);
        }

        function _addRequest(r) {
            $log.log('RequestSvc::addRequest - ' + r.title);
            if (r.id == -1) r.id = self.requests.length;
            r._id = moment().format('YYYYMMDD.hhmmss.SSS');
            Pouch.db.put(r).then(function(result) {
                self.requests.push(r);
                console.log(result)
                $log.log(result);
            }).catch(function(err) {
                $log.log(err);
            });
        }

        function _deleteRequest(r) {
            return Pouch.db.remove(r._id, r._rev)
            .then(function() {
                var index = self.requests.indexOf(r);
                if (index >-1) {
                    self.requests.splice(index,1);
                    return;
                } else {
                    $log.log('Request not found in RequestSvc');
                    return;
                }
            }).catch(function(err) {
                $log.error('RequestSvc::deleteRequest - ' + r.title);
                return err;
            });
        }

        function _saveRequest(r) {
            $log.info('RequestSvc_saveRequest BEGIN: ' + r._rev);
            return Pouch.db.put(r).then(function(result) {
                $log.info('RequestSvc_saveRequest END: ' + result.rev);
                r._rev = result.rev;
                return result.rev;
            });
        }
//
// Utility Methods - hydrateFromLocalStorage, hydrateFromPuchDB, hydrate
//
        function _hydrateFromLocal() {
            if (localStorage['requests']) {
                //grab requests from localStorage and then hydrate the data
                var serviceData = JSON.parse(localStorage['requests']);
                return _hydrate(serviceData);
            } else {
                throw new Error('hydrateFromLocal: There is no localStorage of requests.');
            }
        }

        function _hydrateFromPouch() {
            return Pouch.db.allDocs({include_docs:true, attachments:true})
                .then(function(result) {
                    console.log(result);
                    return _hydrate(result);
                }).catch(function(err) {
                    $log.error(err);
                });
        }

        function _hydrate(data) {
            //check for an array of trips in the json data provided
            if (data) {
                var requests = data.requests?data.requests:data.rows;
                //reset the internal array of requests in the service, then loop each request
                self.requests.length = 0;
                requests.forEach(function(requestData) {
                    //pass the trip JSON to the constrcutor of the Request class
                    if (requestData.doc.hasOwnProperty('travelerFirstName')) {
                        //instantiate a Request obj from the json doc
                        var request = new Request(requestData.doc);
                        request.id = self.requests.length + 1;
                        //and add the trip to the collection in the service
                        self.requests.push(request);
                        $log.info('Request hydrated: ' + request._id);
                        return true;
                    } else {
                        $log.info('This is not a trip doc: ' + requestData.doc._id);
                        return false;
                    }
                });
                //$rootScope.$broadcast('RequestSvc::ready');
                //self.readyCallbacks.forEach(function(cb) { self.isReady = true; cb(); });
                self.readyPromises.forEach(function(obj) { self.isReady = true; obj.res(true); })
            } { return false;}
        }

        return self;
    })

})();
