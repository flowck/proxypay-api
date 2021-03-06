/*
* ProxyPay API Wrapper
* https://flowck.github.io/proxypay-api
*
* Licensed MIT @ Firmino Changani
*/

// Enable strict mode
"use strict";

// Import dependencies
const request = require("request");
const hasha = require("hasha");

// ProxyPay constructor
function ProxyPay(config){
	this.config = {
		host: "https://api.proxypay.co.ao",
		apikey: new Buffer("api:" + config.apikey).toString("base64")
	}
}

/*
* Method name: Generate.
* Description: It generates a new reference.
* params: data - An object containing all information needed to generate a new reference.
*/
ProxyPay.prototype.GenerateReference = function(data){
	
	// Reference to the ProxyPay this
	var that = this;

	return new Promise(function(resolve, reject){
		request({
			uri:  that.config.host + "/references",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Basic " + that.config.apikey
			},
			body: data,
			json: true
		}, function(err, response, body){

			if(err){
				reject(err);
			}

			resolve(body);
			
		});
	});

}

/*
* Method name: GetAll.
* Description: This method returns all references.
* params: N / A
*/
ProxyPay.prototype.GetAllReferences = function(params){

	if(!params){
		var params = {}
	}

	this.params = {
		limit: params.limit || 20,
		offset: params.offset || 0,
		status: params.offset || "",
		q: params.q || ""
	}

	// Reference to the ProxyPay this
	var that = this;

	return new Promise(function(reject, resolve){
		var query = "?limit=" + that.params.limit;
			query += "&offset=" + that.params.offset;
			query += "&status=" + that.params.status;
			query += "&q=" + that.params.q;

		request({
			uri:  that.config.host + "/references" + query,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Basic " + that.config.apikey
			},
			json: true
		}, function(err, response, body){

			if(err){
				reject(err);
			}

			resolve(body);
			
		});
	});


}

/*
* Method name: GetAll.
* Description: This method returns and object with the specified reference.
* params: id - A string
*/
ProxyPay.prototype.GetOneReference = function(id){
	
	// Reference to the ProxyPay this
	var that = this;

	return new Promise(function(reject, resolve){
		request({
			uri:  that.config.host + "/references/" + id,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Basic " + that.config.apikey
			},
			json: true
		}, function(err, response, body){

			if(err){
				reject(err);
			}

			resolve(body);
			
		});
	});

}

/*
* Method name: FetchNewPayments.
* Description: This method returns and object with all payments made.
* params: N / A
*/
ProxyPay.prototype.FetchNewPayments = function(params){

	if(!params){
		var params = {}
	}

	this.params = {
		limit: params.max || 100,
		offset: params.offset || 0
	}

	// Reference to the ProxyPay this
	var that = this;

	return new Promise(function(reject, resolve){
		var query = "?n=" + that.params.max;
			query += "&offset=" + that.params.offset;

		request({
			uri:  that.config.host + "/payments?" + query,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Basic " + that.config.apikey
			},
			json: true
		}, function(err, response, body){

			if(err){
				reject(err);
			}

			resolve(body);
			
		});
	});	
}

/*
* Method name: Acknowledge Payment.
* Description: This method acknowledges that a specific payment has been processed..
* params: paymentid - This parameter can be a string or an array with all ids that need to be
* acknowledged
*/
ProxyPay.prototype.AcknowledgePayments = function(paymentid){

	// Check if paymentid is a string for just a single payment or an array for 
	// multiple payments
	if(typeof(paymentid) === "string"){
		console.log("One paymentid");
		var multipleIds = null;
	}else if(typeof(paymentid) === "object" && paymentid.length > 0){
		console.log("Multiple payments");
		var multipleIds = {ids: paymentid}
	}

	// Reference to the ProxyPay this
	var that = this;

	return new Promise(function(reject, resolve){
		request({
			uri:  that.config.host + "/payments/" + paymentid,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Basic " + that.config.apikey,
			},
			json: true,
			body: multipleIds
		}, function(err, response, body){

			if(err){
				reject(err);
			}

			resolve(body);
			
		});
	});	
}


// Export the constructor
module.exports = ProxyPay;