const fs = require("fs");

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


//console.log(parseAddress(jsonFile));
// parseContactInfo(jsonFile);



let main = function(){
    let jsonFromFile = fs.readFileSync("bcc-2019-10.json", "utf8");
    let input = JSON.parse(jsonFromFile);
    let output0 = parseAddress(input);
    let output1 = parseContactInfo(input);
    // console.log(typeof output1);
    let output = JSON.stringify(output1);
    console.log(output);
    // console.log(input.length);
    // console.log(output.length);

    fs.writeFile("BCC-2019-10-parsed.json", output, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
    return "completed";
}

main();
