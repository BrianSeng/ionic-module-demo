(function() {
    'use strict';

    var factoryName = 'Hotel';
    
    angular.module('segment.hotel')
        .factory(factoryName, factory);
    
    function factory($log) {
        $log.info('building the factory object for: ' + factoryName);
//
// Class Constrcutor
//
        var Hotel = function(data) {
            //grab a reference to this context for use.
            var self = this;
            //check the data param to check for a JSON object
            var isDataObject = (typeof data === "object") && (data !== null);

            //public properties
            this._id = -1;
            this.checkinDate = moment().add(1, 'week').set({
                'hour': 16,
                'minute': 0,
                'second': 0
            });
            this.checkoutDate = this.checkinDate.clone().add(1, 'day').set({
                'hour': 8,
                'minute': 0,
                'second': 0
            });
            this.preferredHotel = "";
            
            //if data is JSON, then use extend to copy in all the values
            if (data && isDataObject) {
                //hold over from the original Pouch document DB approach 
                self._id = data._id;
                
                self.checkinDate = moment(data['checkinDate']);
                self.checkoutDate = moment(data['checkoutDate']);
                self.preferredHotel = data['preferredHotel'];
            }
        };
//
// Instance Methods
//
        Hotel.prototype.info = _info;
//
// Private Implementation Methods
//
        function _info() {
            var msg = 'Hotel: ' + (this.preferredHotel || 'n/a')
                        + ' ' + this.checkinDate.format('MMM-DD')
                        + ' to ' + this.checkoutDate.format('MMM-DD');
            $log.log(msg);
        }
//
// Return the Object Constructor
//
        return Hotel;
    }
})();