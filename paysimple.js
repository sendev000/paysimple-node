var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var request = require('request');
var crypto = require('crypto');
var debug = require('debug')('pay');

var fs = require('fs');
var util = require('util');
var log_url = "paysimple_log.txt";

var express = require('express');
var app = express();

var paysimple = function paysimpleclass(params) {
    params = params || {};

    var self = this;

    self._base = "https://api.paysimple.com/v4";

    self.accessid = params.accessid || '';
    self.key = params.key || '';


    self.setDevmode = function setDevmode() {
        self._base = 'https://sandbox-api.paysimple.com/v4';
        return self;
    };

    self._request = function _request(opts, callback) {
        opts = opts || { };
        if (opts.json === undefined) opts.json = true;
        if (!opts.body) opts.body = { };
        opts.url = self._base + opts.url;
        opts.strictSSL = false;

        var iso = new Date().toISOString();
        var hmac = crypto.createHmac('sha256', self.key).update(new Buffer(iso).toString()).digest('base64');

        opts.headers = {
            // Authorization: PSSERVER accessid=APIUser1000; timestamp=2012-07-20T20:45:44.0973928Z; signature=WqV47Dddgc6XqBKnQASzZbNU/UZd1tzSrFJJFVv76dw=
            "Authorization": "PSSERVER AccessId=" + self.accessid + '; '
                + 'Timestamp=' + iso + '; '
                + 'Signature=' + hmac
        };

        if (opts.query) {
            opts.url += url.format({ query: opts.query });
        }

        // debug('REQUEST opts', JSON.stringify(opts, null, 2));
        // console.log(opts);
        // delete opts.body;
        // opts.method = "GET";

        request(opts, function onAfterRequest(err, res, body) {
            var statusCode = 500;
            if (res != undefined)
                statusCode = (res.statusCode != undefined) ? res.statusCode : statusCode;
            if (err || (statusCode < 200 || statusCode > 299)) {
                debug('response ERROR', statusCode, JSON.stringify(err || body, null, 2));
                return callback('fail', body);
            }
            debug('RESPONSE OK', statusCode, JSON.stringify(body, null, 2));

            var log = fs.createWriteStream(__dirname + "/" + log_url, {flags : 'a'});
            log.once('open', function(fd) {
                var dat = new Date();
                var dat_str = "";
                if (opts.log != undefined)
                    log.write(util.format("----------'" + opts.log + "' CALLING...----------\r\n"));
                dat_str = getFullDateString(dat) + "  " + getFullTimeString(dat);
                log.write("Calling time: " + dat_str + " \r\n")
                log.write("---Request res---\r\n")
                log.write(util.format(JSON.stringify(res, null, 2)) + '\n');
                log.write("\r\n---Request body---\r\n")
                log.write(util.format(JSON.stringify(body, null, 2)) + '\n');
                if (opts.log != undefined)
                    log.write(util.format("\r\n----------'" + opts.log + "' CALLING ENDED----------\r\n\r\n\r\n"));
                log.end();
            });

            callback('success', body);
        });
    };


    self.customers = {
        findOne: function (params, callback) {
            var url = '/customer/' + params.id;
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "Retrieve a Single Customer Record"
            }, callback);
        },
        find: function (params, callback) {
            var url = '/customer';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "Retrieving a Customer List"
            }, callback);
        },
        create: function (params, callback) {
            var url = '/customer';
            self._request({
                url: url,
                method: 'POST',
                body: params,
                log: "Create Customer Object"
            }, callback);
        },
        update: function (params, callback) {
            var url = '/customer';
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Update Customer Object"
            }, callback);
        }
    };

    self.paymentAccounts = {
        addCreditCard: function (params, callback) {
            var url = '/account/creditcard';
            self._request({
                url: url,
                method: 'POST',
                body: params,
                log: "Create a new Payment Credit Card Account Object"
            }, callback);
        },
        addAch: function (params, callback) {
            var url = '/account/ach';
            self._request({
                url: url,
                method: 'POST',
                body: params,
                log: "Create a new Payment ACH(bank account) Account Object with ACH"
            }, callback);
        },
        updateCreditCard: function (params, callback) {
            var url = '/account/creditcard';
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Update Credit Card Account Objects"
            }, callback);
        },
        updateAch: function (params, callback) {
            var url = '/account/ach';
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Update ACH(bank account) Account Objects"
            }, callback);
        },
        setDefaultCreditCard: function (params, callback) {
            var url = '/customer/' + params.CustomerId + '/' + params.AccountId;
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Set a Credit Card as the default"
            }, callback);
        },
        setDefaultAch: function (params, callback) {
            var url = '/customer/' + params.CustomerId + '/' + params.AccountId;
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Set a ACH(bank account) as the default"
            }, callback);
        },
        getDefaultCreditCard: function (params, callback) {
            var url = '/customer/' + params.CustomerId + '/defaultcreditcard';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "Retrieve the Default Credit Card"
            }, callback);
        },
        getDefaultAch: function (params, callback) {
            var url = '/customer/' + params.CustomerId + '/defaultach';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "Retrieve the Default ACH(bank account) Account"
            }, callback);
        },
        list: function (params, callback) {
            var url = '/customer/' + params.id + '/accounts';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "List All Payment Accounts for a Customer"
            }, callback);
        },
        listCreditCards: function (params, callback) {
            var url = '/customer/' + params.id + '/creditcardaccounts';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "List All Credit Card Accounts for a Customer"
            }, callback);
        },
        listAchs: function (params, callback) {
            var url = '/customer/' + params.id + '/achaccounts';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "List All ACH Accounts for a Customer"
            }, callback);
        }
    };

    self.recurringPayment = {
        createNew: function (params, callback) {
            var url = '/recurringpayment';
            self._request({
                url: url,
                method: 'POST',
                body: params,
                log: "Create a New Recurring Payment Object"
            }, callback);
        },
        retriveSchedule: function (params, callback) {
            var url = '/recurringpayment';
            self._request({
                url: url,
                method: 'GET',
                body: params,
                log: "Retrieve a list of all Recurring Payment Schedules"
            }, callback);
        },
        suspendSchedule: function (params, callback) {
            var url = '/recurringpayment/' + params.scheduleId + '/suspend';
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Suspend a Recurring Payment Schedule"
            }, callback);
        },
        pauseSchedule: function (params, callback) {
            var url = '/recurringpayment/' + params.scheduleId + '/pause?enddate=' + params.enddate;
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Pause a Recurring Payment Schedule"
            }, callback);
        },
        resumeSchedule: function (params, callback) {
            var url = '/recurringpayment/' + params.scheduleId + '/resume';
            self._request({
                url: url,
                method: 'PUT',
                body: params,
                log: "Resume a Recurring Payment"
            }, callback);
        },
        deleteSchedule: function (params, callback) {
            var url = '/recurringpayment/' + params.scheduleId;
            self._request({
                url: url,
                method: 'DELETE',
                body: params,
                log: "Delete a Recurring Payment"
            }, callback);
        },
        deletePlan: function (params, callback) {
            var url = '/paymentplan';
            self._request({
                url: url,
                method: 'DELETE',
                body: params,
                log: "Delete the specified Payment Plan Schedule Record"
            }, callback);
        },
        listSchedule: function (params, callback) {
            var url = '/recurringpayment/' + params.scheduleId + '/payments';
            self._request({
                url: url,
                method: 'GET',
                log: "Retrieve Payments for a Recurring Payment Object"
            }, callback);
        },
        listPlan: function (params, callback) {
            var url = '/paymentplan/' + params.scheduleId + '/payments';
            self._request({
                url: url,
                method: 'GET',
                log: "Retrieve Payments for a Payment Plan Object"
            }, callback);
        }
    };

    self.payments = {
        /**
         * Create a payment.
         *
         * ```
         * pay.payments.create({ AccountId: 324323, Amount: 3.49 }, callback);
         * ```
         * @param object params
         * @param number params.AccountId
         * @param number params.Amount
         */
        create: function (params, callback) {
            var url = '/payment';
            self._request({
                url: url,
                method: 'POST',
                body: params,
                log: "Create a new one-time Payment Object"
            }, callback);
        },
        refund: function (params, callback) {
            var url = '/payment/' + params.paymentId + '/reverse';
            self._request({
                url: url,
                method: 'PUT',
                log: "Refund a Payment"
            }, callback);
        },
        void: function (params, callback) {
            var url = '/payment/' + params.paymentId + '/void';
            self._request({
                url: url,
                method: 'PUT',
                log: "Void a Payment"
            }, callback);
        }
    };

    return self;
};

module.exports = paysimple;

function getFullDateString(dt)
{
    var ret = "";
    ret = dt.getFullYear() + "-";
    if ((dt.getMonth() + 1) < 10) ret += '0';
    ret += (dt.getMonth()+1) + "-";
    if (dt.getDate() < 10) ret += '0';
    ret += dt.getDate();
    return ret;
}
function getFullTimeString(dt)
{
    var ret = "";
    if (dt.getHours() < 9) ret += '0';
    ret += dt.getHours()  + "-";
    if ((dt.getMinutes() + 1) < 10) ret += '0';
    ret += (dt.getMinutes()+1) + "-";
    if (dt.getSeconds() < 10) ret += '0';
    ret += dt.getSeconds();
    return ret;
}