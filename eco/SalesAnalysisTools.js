const sql = require("./SQLController");
const moment = require("moment");





module.exports = {


    // Arithmetic mean
    getMean: function (data) {
        if(data == undefined || data.length == 0){
            return 0;
        }
        return data.reduce(function (a, b) {
            return Number(a) + Number(b);
        }) / data.length;
    },

    // Standard deviation
    getSD:function (data) {
        let m = this.getMean(data);
        return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
    },

    calculateNumberOfVisitsPerMonth: function(invoiceArray){
        //moment(invoiceArray[invoiceArray.length-1]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a")
        // console.log(`start date unix ${moment(invoiceArray[0]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a").unix()}  end date ${moment(invoiceArray[0]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a").unix()}`);
        // console.log(moment(invoiceArray[invoiceArray.length-1]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a").diff(moment(invoiceArray[0]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a"), "months"));
        let invoicesCalculated = {
            totalFreq: 0,
            totalVisits: invoiceArray.length,
            totalSpent:0,
            totalTimeUnix: 0,
            timeBetweenVisits:[],
            totalPerVisit:[],
            visitsInMonth:{}
        };

        if(invoiceArray.length == 1){
            console.log("invoice array ===================== 1");
            invoicesCalculated.totalFreq = 0;
            invoicesCalculated.totalTimeUnix = 0;
        }else if(invoiceArray.length>1){
            invoicesCalculated.totalFreq = invoiceArray.length/(moment(invoiceArray[invoiceArray.length-1]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a").diff(moment(invoiceArray[0]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a"), "months"));
            invoicesCalculated.totalTimeUnix = moment(invoiceArray[invoiceArray.length-1]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a").unix()-moment(invoiceArray[0]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a").unix();
        }
        if(invoicesCalculated.totalFreq == Infinity){
            invoicesCalculated.totalFreq = 0;
        }
        let prevUnixTime = 0;
        //loop through each transaction for a customer and calculate the time  between visits
        for(let i in invoiceArray){
            // console.log(invoiceArray[i]);
            //get a moment object with the time of current tx
            console.log(invoiceArray[i]);
            let unixTime = moment(invoiceArray[i]['createdOn'],"MM-DD-YYYY-hh-mm-ss-a");

            //add visit too current month basket
            //if its a new month create a array for that months key
            if(invoicesCalculated.visitsInMonth[unixTime.month()] == undefined){
                invoicesCalculated.visitsInMonth[unixTime.month()] = [];
            }
            //add the invoice to the month.
            invoicesCalculated.visitsInMonth[unixTime.month()].push(invoiceArray[i].id);

            //if this is the first tx set the prev tx to the current tx and skip the rest
            if(prevUnixTime == 0){
                prevUnixTime = unixTime;
                continue;
            }
            //add the difference in time too time between visits array  prevUnixTime
            invoicesCalculated.timeBetweenVisits.push(unixTime.diff(prevUnixTime, 'days'));
            //set prev time to current unix time
            prevUnixTime = unixTime;
            //add total spent and add to spending array.
            invoicesCalculated.totalSpent += parseFloat(invoiceArray[i].total);
            invoicesCalculated.totalPerVisit.push(invoiceArray[i].total);
        }
        return invoicesCalculated;
    }



    //END OF MODULE EXPORTS
};
