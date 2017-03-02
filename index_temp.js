// 'use strict'
let crypto =  require('crypto')
let request = require('request');

let userName = "APIUser154628";
let superSecretCode = "kL1t0BCKBjcBulnF4xpT8VYuz4sIJfu3a4bPSObSzkvFZ43E0HKEJwWAxqHN4aly2EhqFILMcLbT1cib5PxlKi0YDAWOmv0dNRZo3md0tXmQbanWLdfkUBoz05Tf5JR0";

let paysimple = require('paysimple.js');
let credentials = require('credentials.js')

var opts = {};

pay = new paysimple(credentials.paysimple);
var ret = pay.setDevMode();

// let url = "https://sandbox-api.paysimple.com/v4/customer";
var addr = {
    StreetAddress1: "FEW",
    StreetAddress2: null,
    City: "Alaska",
    StateCode: "CO",
    ZipCode: "1234567",
    Country: null
};
var newCustomer = {
    BillingAddress: addr,
    ShippingSameAsBilling: true,
    ShippingAddress: null,
    Company: "ABC",
    Notes: "This is a note about ABC",
    CustomerAccount: "EFWFEWFE",
    FirstName: "aa",
    LastName: "aa",
    Email: "aa@aa.com",
    Phone: "1234567890"
};

// let url = "https://sandbox-api.paysimple.com/v4/account/creditcard";
// var customer_id = 367084;
// var cardType = {"visa": 12, "mastercard": 13, "amex": 14, "discover": 15};
// var cardNumber = "4111111111111111"
// var newCreditCard = {
// 	CreditCardNumber: cardNumber,
//     ExpirationDate: "05/2020",
//     Issuer: cardType[detectCardType(cardNumber)],
//     BillingZipCode: "123456",
//     CustomerId: customer_id,
//     IsDefault: false,
//     Id: 0
// };
// console.log(newCreditCard);
// let url = "https://sandbox-api.paysimple.com/v4/recurringpayment";
// var account_id = 564437;
// var dateStr = "2017-02-24"
// schedule = {
//     // EndDate: "2017-10-31",
//     PaymentAmount: 270,
//     // PaymentSubType: "MOTO",
//     AccountId: account_id,
//     // InvoiceNumber: "123A",
//     // OrderId: null,
//     FirstPaymentAmount: 81,
//     FirstPaymentDate: "2017-02-03",
//     StartDate: "2017-04-04",
//     ExecutionFrequencyType: 5,
//     ExecutionFrequencyParameter: 4,
//     Description: "This is a recurring payment schedule entered via the API"
// }
// // schedule = {
// //     AccountId: account_id,
// //     PaymentAmount: 25,
// //     StartDate: dateStr,
// //     ExecutionFrequencyType: 4
// // }

// opts["url"] = url;
// opts["method"] = "POST";
// opts["strictSSL"] = false;
// opts["body"] = schedule;
// opts["json"] = true;
// opts["headers"]  = headers;


// request(opts, function onAfterRequest(err, res, body) {
// 	var statusCode = 500;
// 	if (res != undefined)
// 		statusCode = (res.statusCode != undefined) ? res.statusCode : statusCode
//     if (err || (statusCode < 200 || statusCode > 299)) {
//     	console.log(statusCode);
//     	// console.log(res);
//         // return callback(err || body || "Error: status=" + statusCode);
//     }
//     console.log(body);
// });

function detectCardType(number) {
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    }

    for(var key in re) {
        if(re[key].test(number)) {
            return key
        }
    }
}

// var countries = require('country-data').countries;
// var provinces = require('provinces');
// var country_name = "Canada";
// var province_name = "Alberta";
// var country_abbr, province_abbr;
// for(i=0;i<countries.all.length;i++)
// {
//     if (countries.all[i].name == country_name)
//     {
//         country_abbr = countries.all[i].alpha2;
//     }
// }
// for (i=0;i<provinces.length;i++){
//     if (provinces[i].name == province_name && provinces[i].country == country_abbr)
//     {
//         province_abbr = provinces[i].short;
//     }
// }
// console.log(country_abbr);
// console.log(province_abbr);