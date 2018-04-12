(function() {
    'use strict';

    var factoryName = 'Rental';
    
    angular.module('segment.rental')
        .factory(factoryName, factory);
    
    function factory($log) {
        $log.info('building the factory object for: ' + factoryName);
//
// Class Constrcutor
//
        var Rental = function(data) {
            //grab a reference to this context for use.
            var self = this;
            //check the data param to check for a JSON object
            var isDataObject = (typeof data === "object") && (data !== null);

            //public properties
            this._id = -1;
            this.rentalDate = moment().add(1, 'week').set({
                'hour': 16,
                'minute': 0,
                'second': 0
            });
            this.preferredCompany = "";
            
            //if data is JSON, then use extend to copy in all the values
            if (data && isDataObject) {
                //hold over from the original Pouch document DB approach 
                self._id = data._id;
                
                self.rentalDate = moment(data['rentalDate']);
                self.preferredCompany = data['preferredCompany'];
            }
        };
//
// Instance Methods
//
        Rental.prototype.info = _info;
//
// Private Implementation Methods
//
        function _info() {
            var msg = 'Rental: ' + (this.preferredCompany || 'n/a')
                        + ' ' + this.rentalDate.format('MMM-DD');
            $log.log(msg);
        }
//
// Return the Object Constructor
//
        return Rental;
    }
})();