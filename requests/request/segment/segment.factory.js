(function() {
    'use strict';

    angular.module('request.segment')

    .factory('Segment', function($log, Pouch) {
//
// Class Constructor
//
        let Segment = function(data) {
            //grab a reference to this context for use.
            let self = this;
            //check the data param to check for a JSON object
            let isDataObject = (typeof data === "object") && (data !== null);

            //if data is not JSON, it is the string for the title
            this.title = (!!data && !isDataObject)?data:"";

            //public properties
            this.isCharterFlight = false;
            this.flightNumber = "";
            this.preferredAirline = "";

            this.departingAirport = "";
            this.departureDate = moment().toDate();
            this.departureTime = "";

            this.arrivingAirport = "";
            this.arrivalTime = "";

            this.isReturnFlight = false;
            this.mustReturnBy = "";

            this.hotel = {
                preferredHotel: ""
                , address: ""
                , checkInDate: moment().toDate()
                , checkOutDate: moment().add(1, 'days').toDate()
            };
            this.rental = {
                preferredCompany: ""
                , pickupDate: moment().toDate()
                , pickupTime: ""
                , dropoffDate: moment().add(1, 'days').toDate()
                , dropoffTime: ""
            };

            
            
            
            //if data is JSON, then use extend to copy in all the values
            if (data && isDataObject) 
            {
                self.title = data['title'];
                self.departingAirport = data['departingAirport'];
                self.arrivingAirport = data['arrivingAirport'];
                self.preferredAirline = data['preferredAirline'];

                self.departureDate = moment(data['departureDate']).toDate();
                self.departureTime = data['departureTime'];
                self.mustReturnBy = moment(data['mustReturnBy']).toDate();

                self.hotel = data['hotel'];
                self.rental = data['rental'];

                self.isCharterFlight = data['isCharterFlight'];
                self.isReturnFlight = data['isReturnFlight'];                
            }
        }

        return Segment;
    });

})();
