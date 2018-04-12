(function() {
    'use strict';

    var factoryName = 'Flight';
    
    angular.module('segment.flight')
        .factory(factoryName, factory);
    
    function factory($log) {
        $log.info('building the factory object for: ' + factoryName);
//
// Class Constrcutor
//
        var Flight = function(data) {
            //grab a reference to this context for use.
            var self = this;
            //check the data param to check for a JSON object
            var isDataObject = (typeof data === "object") && (data !== null);

            //public properties
            this._id = -1;
            this.departureDate = moment().add(1, 'week').set({
                'hour': 8,
                'minute': 0,
                'second': 0
            });
            this.leavingAirport = "";
            this.arrivingAirport = "";
            this.preferredTime = this.departureDate.clone();
            this.preferredAirline = "";
            
            //if data is JSON, then use extend to copy in all the values
            if (data && isDataObject) {
                //hold over from the original Pouch document DB approach 
                self._id = data._id;
                
                self.departureDate = moment(data['departureDate']);
                self.leavingAirport = data['leavingAirport'];
                self.arrivingAirport = data['arrivingAirport'];
                self.preferredTime = moment(data['preferredTime']);
                self.preferredAirline = moment(data['preferredAirline']);
            }
        };
//
// Instance Methods
//
        Flight.prototype.info = _info;
//
// Private Implementation Methods
//
        function _info() {
            var msg = 'Flight: ' + this.departureDate.format('MMM-dd')
                        + ' ' + (this.leavingAirport || 'n/a')
                        + ' - ' + (this.arrivingAirport || 'n/a');
            $log.log(msg);
            return msg;
        }
//
// Return the Object Constructor
//
        return Flight;
    }
})();