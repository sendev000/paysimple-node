// 'use strict'
let crypto =  require('crypto')
let request = require('request');

let paysimple = require('./paysimple.js');
let credentials = require('./credentials.js')

var pay = new paysimple(credentials.paysimple);
var ret = pay.setDevmode();


/***** Customer Objects *****/
// 1. Successfully Create a new Customer Object
var addr1 = {
    StreetAddress1: "Test",
    StreetAddress2: null,
    City: "San Francisco",
    StateCode: "CA",
    ZipCode: "94101",
    Country: null
};

var newCustomer1 = {
    BillingAddress: addr1,
    ShippingSameAsBilling: true,
    ShippingAddress: null,
    Company: "Test",
    Notes: "This is a note about Test company",
    CustomerAccount: "TestAccount",
    FirstName: "Maya",
    LastName: "Yoshida",
    Email: "maya@yoshida.com",
    Phone: "1234567890"
};
pay.customers.create(newCustomer1, function(customerSRes, customerBody){
    console.log("\r\n\r\nCustomer 1. Successfully Create a new Customer Object");
    if (customerSRes.indexOf('success') != -1){
        var customerId = customerBody["Response"]["Id"];
        console.log("Successfully created the customer. CustomerId: " + customerId);
        console.log("Return Status Code: " + customerBody["Meta"]["HttpStatus"]);
    }else{
        console.log("Failed to create the customer.");
    }
});


// 2. Attempt to create a Customer including all elements of the Billing Address except StreetAddress1.
var addr2 = {
    StreetAddress2: null,
    City: "San Francisco",
    StateCode: "CA",
    ZipCode: "94101",
    Country: null
};
var newCustomer2 = {
    BillingAddress: addr2,
    ShippingSameAsBilling: true,
    ShippingAddress: null,
    Company: "Test",
    Notes: "This is a note about Test company",
    CustomerAccount: "TestAccount",
    FirstName: "Maya",
    LastName: "Yoshida",
    Email: "maya@yoshida.com",
    Phone: "1234567890"
}; // Except StreetAddress1
pay.customers.create(newCustomer2, function(customerSRes, customerBody){
    console.log("\r\n\r\nCustomer 2. Attempt to create a Customer including all elements of the Billing Address except StreetAddress1.");
    if (customerSRes.indexOf('success') != -1){
        var customerId = customerBody["Response"]["Id"];
        console.log("Successfully created the customer. CustomerId: " + customerId);
    }else{
        console.log("Failed to create the customer.");
        console.log("StatusCode: " + JSON.stringify(customerBody["Meta"]["HttpStatusCode"]));
        console.log("Status: " + customerBody["Meta"]["HttpStatus"]);
        console.log("Error Message: " + JSON.stringify(customerBody["Meta"]["Errors"]["ErrorMessages"]));
    }
});

/***** Customer Objects *****/





/***** Account Objects *****/

var addr3 = {
    StreetAddress1: "Test",
    StreetAddress2: null,
    City: "San Francisco",
    StateCode: "CA",
    ZipCode: "94101",
    Country: null
};

var newCustomer3 = {
    BillingAddress: addr3,
    ShippingSameAsBilling: true,
    ShippingAddress: null,
    Company: "Test",
    Notes: "This is a note about Test company",
    CustomerAccount: "TestAccount",
    FirstName: "Maya",
    LastName: "Yoshida",
    Email: "maya@yoshida.com",
    Phone: "1234567890"
};


var customer_id = 0;
var cardType = {"visa": 12, "mastercard": 13, "amex": 14, "discover": 15};

// 1. Successfully Create a Credit Card account
var cardNumber1 = "4111111111111111"
var newCreditCard1 = {
    CreditCardNumber: cardNumber1,
    ExpirationDate: "05/2020",
    Issuer: cardType[detectCardType(cardNumber1)],
    BillingZipCode: "94101",
    CustomerId: customer_id,
    IsDefault: false,
    Id: 0
};
pay.customers.create(newCustomer3, function(customerSRes, customerBody){
    if (customerSRes.indexOf('success') != -1){
        var customerId = customerBody["Response"]["Id"];
        newCreditCard1["CustomerId"] = customerId;
        pay.paymentAccounts.addCreditCard(newCreditCard1, function(cardSRes, cardBody){
            console.log("\r\n\r\nCredit Card 1. Successfully Create a Credit Card account");
            if (cardSRes.indexOf('success') != -1){
                var cardId = cardBody["Response"]["Id"];
                console.log("Successfully created the credit card. Credit Id:" + cardId);
                console.log("Return Status Code: " + cardBody["Meta"]["HttpStatusCode"]);
            }
            else{
                console.log("Failed to create the credit card. ");
            }
        });
    }
    else
        ;
})

// 2. Attempt to create Credit Card account using an invalid card number
var cardNumber2 = "4111111111111123"
var newCreditCard2 = {
    CreditCardNumber: cardNumber2,
    ExpirationDate: "05/2020",
    Issuer: cardType[0],
    BillingZipCode: "94101",
    CustomerId: customer_id,
    IsDefault: false,
    Id: 0
};
pay.customers.create(newCustomer3, function(customerSRes, customerBody){
    if (customerSRes.indexOf('success') != -1){
        var customerId = customerBody["Response"]["Id"];
        newCreditCard2["CustomerId"] = customerId;
        pay.paymentAccounts.addCreditCard(newCreditCard2, function(cardSRes, cardBody){
            console.log("\r\n\r\nCredit Card 2. Attempt to create Credit Card account using an invalid card number");
            if (cardSRes.indexOf('success') != -1){
                var cardId = cardBody["Response"]["Id"];
                console.log("Successfully created the credit card. Credit Id:" + cardId);
            }
            else{
                console.log("Failed to create the credit card. ");
                console.log("StatusCode: " + JSON.stringify(cardBody["Meta"]["HttpStatusCode"]));
                console.log("Status: " + cardBody["Meta"]["HttpStatus"]);
                console.log("Error Message: " + JSON.stringify(cardBody["Meta"]["Errors"]["ErrorMessages"]));
            }
        });
    }
    else
        ;
})
/***** Account Objects *****/

/***** Payment Objects *****/
var addr4 = {
    StreetAddress1: "Test",
    StreetAddress2: null,
    City: "San Francisco",
    StateCode: "CA",
    ZipCode: "94101",
    Country: null
};

var newCustomer4 = {
    BillingAddress: addr4,
    ShippingSameAsBilling: true,
    ShippingAddress: null,
    Company: "Test",
    Notes: "This is a note about Test company",
    CustomerAccount: "TestAccount",
    FirstName: "Maya",
    LastName: "Yoshida",
    Email: "maya@yoshida.com",
    Phone: "1234567890"
};
var customer_id = 0;
var cardType = {"visa": 12, "mastercard": 13, "amex": 14, "discover": 15};

var cardNumber4 = "4111111111111111"
var newCreditCard4 = {
    CreditCardNumber: cardNumber4,
    ExpirationDate: "05/2020",
    Issuer: cardType[detectCardType(cardNumber4)],
    BillingZipCode: "94101",
    CustomerId: customer_id,
    IsDefault: false,
    Id: 0
};
pay.customers.create(newCustomer4, function(customerSRes, customerBody){
    if (customerSRes.indexOf('success') != -1){
        var customerId = customerBody["Response"]["Id"];
        newCreditCard4["CustomerId"] = customerId;
        pay.paymentAccounts.addCreditCard(newCreditCard4, function(cardSRes, cardBody){
            if (cardSRes.indexOf('success') != -1){
                var cardId = cardBody["Response"]["Id"];
                var price1 = 1000;

                1. Successfully Post a Credit Card Payment
                var payRequest1 = {
                    AccountId: cardId,
                    Amount: price1
                }
                pay.payments.create(payRequest1, function(paymentSRes, paymentBody){
                    console.log("\r\n\r\nPayment Objects 1. Successfully Post a Credit Card Payment");
                    if(paymentSRes.indexOf('success') != -1)
                    {
                        var paymentId = paymentBody["Response"]["Id"];
                        console.log("Successfully created the payment. Payment Id:" + paymentId);
                        console.log("Return Status Code: " + paymentBody["Meta"]["HttpStatusCode"]);
                    }
                    else
                        console.log("Failed to create payment. "); 
                });


                3. Void an Authorized Credit Card Payment
                var payRequest3 = {
                    AccountId: cardId,
                    Amount: price1
                }
                pay.payments.create(payRequest3, function(paymentSRes, paymentBody){
                    if(paymentSRes.indexOf('success') != -1)
                    {
                        var voidObj = {
                            paymentId: paymentBody["Response"]["Id"]
                        };
                        pay.payments.void(voidObj, function(paymentRefundRes, paymentRefundBody){
                            console.log("\r\n\r\nPayment Objects 3. Void an Authorized Credit Card Payment");
                            if(paymentRefundRes.indexOf('success') != -1)
                            {
                                var paymentId = paymentRefundBody["Response"]["Id"];
                                console.log("Successfully voided the payment. Payment Id:" + paymentId);
                                console.log("Return Status Code: " + paymentRefundBody["Meta"]["HttpStatusCode"]);
                            }
                            else{

                            }
                        });
                    }
                    else
                        console.log("Failed to create payment. ");
                });


                4. Post a Credit card Payment for over $2 million
                var payRequest4 = {
                    AccountId: cardId,
                    Amount: 2000001
                }
                pay.payments.create(payRequest4, function(paymentSRes, paymentBody){
                    console.log("\r\n\r\nPayment Objects 4. Post a Credit card Payment for over $2 million");
                    if(paymentSRes.indexOf('success') != -1)
                    {
                        var paymentId = paymentBody["Response"]["Id"];
                        console.log("Successfully created the payment. Payment Id:" + paymentId);
                    }
                    else{
                        console.log("Failed to create payment. "); 
                        console.log("Status: " + paymentBody["Meta"]["HttpStatus"]);
                        console.log("Error Message: " + 
                            JSON.stringify(paymentBody["Meta"]["Errors"]["ErrorMessages"]));
                    }
                });

                5. Post a Credit card Payment for $0
                var payRequest4 = {
                    AccountId: cardId,
                    Amount: 0
                }
                pay.payments.create(payRequest4, function(paymentSRes, paymentBody){
                    console.log("\r\n\r\nPayment Objects 5. Post a Credit card Payment for $0");
                    if(paymentSRes.indexOf('success') != -1)
                    {
                        var paymentId = paymentBody["Response"]["Id"];
                        console.log("Successfully created the payment. Payment Id:" + paymentId);
                    }
                    else{
                        console.log("Failed to create payment. "); 
                        console.log("Status: " + paymentBody["Meta"]["HttpStatus"]);
                        console.log("Error Message: " + 
                            JSON.stringify(paymentBody["Meta"]["Errors"]["ErrorMessages"]));
                    }
                });
            }
            else
                ;
        });
    }
    else
        ;
})


// 2. Refund a "Settled" Credit card Payment
var possibleIds = [4354387, 4354396, 4354398];
var refundObj = {
    paymentId: possibleIds[0]
};
pay.payments.refund(refundObj, function(paymentRefundRes, paymentRefundBody){
    console.log("\r\n\r\nPayment Objects 2. Refund a 'Settled' Credit Card Payment");
    if(paymentRefundRes.indexOf('success') != -1)
    {
        var paymentRefundId = paymentRefundBody["Response"]["Id"];
        console.log("Successfully refunded the payment. Payment Id:" + paymentRefundId);
        console.log("Return Status Code: " + paymentRefundBody["Meta"]["HttpStatusCode"]);
    }
    else{
        console.log("Failed to refund payment.");
    }
});
/***** Payment Objects *****/

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
