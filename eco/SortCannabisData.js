const fs = require("fs");
const sql = require("./SQLController");

//BCC parse Address
let parseAddress = function(input){
    let outputJSON = [];
    for(let cell in input){
        let field = input[cell];
        //field["Premise Address"]
        if(field["Premise Address"] !== undefined){
        let unsortedAdress= field["Premise Address"].split(",")
        console.log(unsortedAdress);
        // console.log(unsortedAdress[1]);

        if(isNaN(unsortedAdress[0].slice(0,2))){
            field.city = unsortedAdress[0];
            // console.log(`found city! ${field.city}`);
        }else{
            // console.log(`parsing street and city street  ${unsortedAdress[0]}`);
            let street = unsortedAdress[0].split(" ");
            for(let i = 0; i<street.length;i++){
                if(street[i] == "ST" || street[i] == "RD" || street[i] == "DR" ||
                    street[i] == "BLVD" || street[i] == "AVE" || street[i] == "TRL" ||
                    street[i] == "PL" || street[i] == "LN" || street[i] == "HWY" || street[i] == "HIGHWAY 9"){
                    let streetArray =[];
                    let cityArray = [];
                    for(let si=0;si<=i;si++){
                        streetArray.push(street[si]);
                        field.street = streetArray.join(" ")
                    }
                    for(let ci=i+1;ci<street.length; ci++){
                        cityArray.push(street[ci]);
                        field.city = cityArray.join(" ");
                    }
                    // console.log(`street  ${field.street}`);
                    // console.log(`city    ${field.city}`);

                }
            }
        }
        if(unsortedAdress[1] !== undefined){
            let zipAndCounty = unsortedAdress[1].split(" ");
            //console.log(zipAndCounty);
            field.state = zipAndCounty[1];
            field.zip = zipAndCounty[2];
            field.county = zipAndCounty.slice(4, zipAndCounty.length).join();
        }

       // console.log(field);
        outputJSON.push(field);
    }
        else{
            outputJSON.push(field);
        }
    }
    return outputJSON;

}

//parse cotnact info field
let parseContactInfo = function(input){
    let outputJSON = [];
    for(let cell in input){
        let field = input[cell];
        let contactInfo = field['Business Contact Information'].split(":");
        //console.log(contactInfo);
        field["buisness name"] = contactInfo[0];

        for(let i=0;i<contactInfo.length;i++){
            if(contactInfo[i] !== undefined){
                // console.log(contactInfo[i]);
                if(contactInfo[i].slice(1,6) == "Email"){
                    // console.log(contactInfo[i].slice(8))
                    field.Email = contactInfo[1].slice(8)
                }
                if(contactInfo[i].slice(1,6) == "Phone"){
                    // console.log(contactInfo[i].slice(8))
                    field.Phone = contactInfo[i].slice(8)
                }
                // console.log(contactInfo[i].slice(1,8));
                if(contactInfo[i].slice(1,8) == "Website"){
                    // console.log(contactInfo[i].slice(10));
                    field.website = contactInfo[i].slice(10);
                }
            }
        }
        outputJSON.push(field);
    }
    // console.log(outputJSON);
    return outputJSON;
}


//createCustomerObject
let parseCovaCustomers = async function(jsonArray){
    let resArray = [];
    let errArray = [];
    let con = await sql.GetConnection();
    for(let index in jsonArray){
        let currentCustomer = jsonArray[index];
        try{
            let sqlRes = await sql.insertNewUser(con,"users", {
                fullName:jsonArray[index]["First Name"] +" "+jsonArray[index]["Last Name"],
                dob:currentCustomer["Date Of Birth"],
                phone:currentCustomer["Phone"]|| "",
                email:currentCustomer["Email"]|| "",
                allowMarketing:currentCustomer["Allow Marketing"],
                streetAddress:currentCustomer["Street Address 1"],
                city: currentCustomer["City"],
                state: currentCustomer["Region"],
                zip: currentCustomer["Postal Code"],
                dl: currentCustomer["Drivers License Number"],
                medRecNum: currentCustomer["Medical Recommendation Number"],
                medRecExp: currentCustomer["Medical Recommendation Expiry Date"],
            });
            resArray.push(sqlRes);

        }catch(err){
            errArray.push({err,currentCustomer});
            continue;
        }

    }
    return new Promise((resolve, reject )=>{
        if(resArray.length+errArray.length == jsonArray.length){
            resolve({resArray, errArray, totalLen:jsonArray.length});
        }
        else{
            reject("error lengths missmatched");
        }

    } )
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


//console.log(parseAddress(jsonFile));
// parseContactInfo(jsonFile);



let main = async function(){
    let jsonFromFile = fs.readFileSync("rawData/customer-export-ecocannabis.json", "utf8");
    let input = JSON.parse(jsonFromFile);
    let response = await parseCovaCustomers(input);
    console.log(response.errArray);
    console.log(`err array len ${response.errArray.length}  total len ${response.totalLen}  current len ${response.resArray.length}`);



    // let output = JSON.stringify(output1);
    // console.log(output);
    // // console.log(input.length);
    // // console.log(output.length);
    //
    // fs.writeFile("BCC-2019-10-parsed.json", output, 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }
    //
    //     console.log("JSON file has been saved.");
    // });
    return "completed";
}

main();
