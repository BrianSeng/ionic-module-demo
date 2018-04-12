(function() {
    'use strict';

    angular.module('app.requests')

    .factory('Request', function($log, Pouch, Segment) {
//
// Class Constrcutor
//
        var Request = function(data) {
            //grab a reference to this context for use.
            var self = this;
            //check the data param to check for a JSON object
            var isDataObject = (typeof data === "object") && (data !== null);

            this.id = -1;
            this._id = moment().format('YYYYMMDD.hhmmss.SSS');
            //if data is not JSON, it is the string for the title
            this.title = (!!data && !isDataObject)?data:"";
            this.purpose = "";
            this.isSubmitted = false;

            //public properties
            this.travelerFirstName = "";
            this.travelerMiddleName = "";
            this.travelerLastName = "";
            this.travelerGender = "";
            this.travelerDob = "";
            this.travelerEmail = "";
            this.travelerCell = "";
            this.knownTravelerNumber = "";
            //public accounting properties
            this.fauAccount = "";
            this.fauCC = "";
            this.fauProject = "";
            //arrays of request items: tripSegments
            this.segments = [];
            this.comments = "";
            //if data is JSON, then use extend to copy in all the values
            if (data && isDataObject) {
                //hold over from the original Pouch document DB approach
                self._id = data._id;
                self._rev = data._rev;

                self.title = data['title'];
                self.purpose = data['purpose'];

                //angular.extend(self, data);
                //self.traveler = data['traveler'];
                self.travelerFirstName = data['travelerFirstName'];
                self.travelerMiddleName = data['travelerMiddleName'];
                self.travelerLastName = data['travelerLastName'];
                self.travelerGender = data['travelerGender'];
                self.travelerDob = data['travelerDob'];
                self.travelerEmail = data['travelerEmail'];
                self.travelerCell = data['travelerCell'];
                self.knownTravelerNumber = data['knownTravelerNumber'];

                self.fauAccount = data['fauAccount'];
                self.fauCC = data['fauCC'];
                self.fauSub = data['fauSub'];
                self.fauProject = data['fauProject'];

                self.isSubmitted = data['isSubmitted'];
//
// Segments = flight segments in the requested trip
//
                if (data.segments && data.segments.length > 0) {
                    var segments = data.segments;
                    self.segments = [];
                    segments.forEach(function(s) {
                        var segment = new Segment(s);
                        self.segments.push(segment);
                    })
                }
            }
        }
//
// Public Instance Methods
//
        Request.prototype.save = _save;
        Request.prototype.addSegment = _addSegment;
        Request.prototype.deleteSegment = _deleteSegment;

        Request.prototype.info = function() {
            $log.log('Request Title: ' + this.title);
        }

//
// Private Intance Method Implementations
//
        function _save() {
            var self = this;
            return Pouch.db.put(self).then(function(result) {
                $log.info('Request.saved: ' + self._rev + ' --> ' + result);
                self._rev = result.rev;
            });
        }

        function _addSegment(l) {
            this.segments.push(l);
        }

        function _deleteSegment(l) {
            $log.log('Request::deleteSegment - ' + l);
            var index = this.segments.indexOf(l);
            if (index >-1) {
                this.segments.splice(index,1);
                //added to make sure trip is persisted after update from delete
                this.save();
            } else {
                $log.log('Segment not found in request object');
            }
        };

        return Request;
    });

})();
