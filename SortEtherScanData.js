const fs = require("fs");

//questions to be answered in this descriptive analysis
//List of all taxable transactions and their tax basis

//what is the distribution of sales in our smart contract EG biggest spenders
//Sort Transactions by sender


let sortTransactionBySender = function(jsonInput){
    let senders = {};
    for(let i in jsonInput){
        let item = jsonInput[i]
        // console.log(item);
        if(senders[item.From] == undefined){
            // console.log("new sender");
            senders[item.From] = {
                transactions:[],
                feesArray: []
            }
        }
        let tx = {
            hash:item.Txhash,
            unixTimeStamp:item.UnixTimestamp,
            sender:item.From,
            ValIn:item["Value_IN(ETH)"],
            currentVal:item["CurrentValue @ $174.26/Eth"],
            TxFeeEth:item["TxnFee(ETH)"],
            TxFeeUsd:item["TxnFee(USD)"],
            HistoricalPrice:item["Historical $Price/Eth"]

        };
        senders[item.From].transactions.push(tx);
        senders[item.From].totalETH += item["Value_IN(ETH)"];
        senders[item.From].totalUSD += item["CurrentValue @ $174.26/Eth"];
        senders[item.From].feesArray.push(item["TxnFee(USD)"]);


    }
    // console.log(senders);
    return senders;

};

// x is the amount of money spent total
// y is
let averageOfArray = function(Array){
    let total = 0;
    for(let i in Array){
        total += Array[i];
    }
    return total/Array.length;
};

let standardDeviationOfAnArray = function(array){
    let mean = averageOfArray(array);
    console.log(`the mean is ${mean}`);
    let newArray = array.map((item)=>{
        let pass = item-mean;
        console.log(pass);
        return  Math.sqrt(pass);
    });
    console.log(newArray);
    return Math.sqrt(averageOfArray(newArray));

};

// Arithmetic mean
let getMean = function (data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};

// Standard deviation
let getSD = function (data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
        return sq + Math.pow(n - m, 2);
    }, 0) / (data.length - 1));
};


let generateTransactionSummery = function(transactionsBySender){
    let outputSummery = {
        numberOfTx:[],
        totalValueOfTx:[],
        feesUsd:[],
        avgNumTx:0,
        avgValTX:0,
        avgFees:0

    };

    console.log("generating transaction summery");
    for(let senders in transactionsBySender){
        console.log(senders);
        let totalTxOfSender = 0;
        let totalTxValue = 0;
        let sender = transactionsBySender[senders];
        outputSummery.feesUsd.push(averageOfArray(sender["feesArray"]));
        for(let tx in sender.transactions){
            let Transaction = sender.transactions[tx];
            totalTxOfSender +=1;
            totalTxValue += Transaction["currentVal"];
            console.log(totalTxValue);
            console.log(totalTxValue);
        }
        outputSummery.totalValueOfTx.push(totalTxValue);
        outputSummery.numberOfTx.push(totalTxOfSender);
    }
    outputSummery.avgNumTx = averageOfArray(outputSummery.numberOfTx);
    outputSummery.avgValTX = averageOfArray(outputSummery.totalValueOfTx);
    outputSummery.avgFees = averageOfArray(outputSummery.feesUsd);
    console.log(outputSummery);
    console.log(averageOfArray(outputSummery.feesUsd));
    return outputSummery;
}







let main = function() {
    ///let jsonFromFile = fs.readFileSync("oct-6-nugbase-contract.json", "utf8");
    let jsonFromFile2 = fs.readFileSync( "transactionSummery.json", "utf8");
    // let input = JSON.parse(jsonFromFile);
    let input2 = JSON.parse(jsonFromFile2);
    // let transactionsBySender = sortTransactionBySender(input);
    // let Summery = generateTransactionSummery(transactionsBySender);

    // let output = JSON.stringify(transactionsBySender);
    // let output2 = JSON.stringify(Summery);
    let SD = getSD(input2.totalValueOfTx);
    console.log(SD);


    // fs.writeFile("transactionsBySender.json", output, 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }
    //
    //     console.log("JSON file has been saved.");
    // });
    //
    // fs.writeFile("transactionSummery.json", output2, 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }
    //
    //     console.log("JSON2 file has been saved.");
    // });
}


main();
