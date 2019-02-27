'use strict';
var express = require('express');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');

require('./config.js');
var hfc = require('fabric-client');

var utils = require('./app/utils.js');
var createChannel = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var upgrade = require('./app/upgrade-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');


var log4js = require('log4js');
var logger = log4js.getLogger('Energy-Management:[app.js]');
log4js.configure({
	appenders: {
		allLogs: {
			type: 'file',
			filename: 'logs/all_log.log'
		},
		specialLogs: {
			type: 'file',
			filename: 'logs/special_log.log'
		},
		console: {
			type: 'console'
		}
	},
	categories: {
		write: {
			appenders: ['specialLogs'],
			level: 'info'
		},
		default: {
			appenders: ['console', 'allLogs'],
			level: 'trace'
		}
	}
});

const baseurl = "/api/v1";

//********************** SET CONFIGURATONS *******************************

app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));
// set secret variable
app.set('secret', 'C!3VU$tokenSecret');
app.use(expressJWT({
	secret: 'C!3VU$tokenSecret'
}).unless({
	path: [baseurl + '/enroll_users', baseurl + '/newAffiliation', baseurl + '/register', baseurl + '/login', baseurl + '/register_residents', baseurl + '/register_bank', baseurl + '/register_utilitycompany', baseurl + '/userlist', baseurl + '/get_all_quotes']
}));
app.use(bearerToken());
app.use(function (err, req, res, next) {
	console.log("err>>>.." + err);
	if (err.name === 'UnauthorizedError') {
		res.status(401).send({
			"success": "false",
			"message": "Invalid Token"
		});
	}
});
app.use(function (req, res, next) {
	logger.debug(' New request for %s', req.originalUrl);
	if (req.originalUrl.indexOf(baseurl + '/enroll_users') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/newAffiliation') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/register') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/userlist') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/login') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/register_residents') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/register_bank') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/register_utilitycompany') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/register_residents_trial') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf(baseurl + '/get_all_quotes') >= 0) {
		return next();
	}
	var token = req.token;
	jwt.verify(token, app.get('secret'), function (err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /api/v1/enroll_users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			req.role = decoded.role;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});


//************************ START SERVER *******************************

var server = http.createServer(app).listen(port, function () { });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}



//******************* REST ENDPOINTS START HERE *****************************

// Register and enroll user
app.post(baseurl + '/enroll_users', async function (req, res) {
	try {
		var username = req.body.username;
		var orgName = req.body.orgName;
		if (!username) {
			res.json(getErrorMessage('\'username\''));
			return;
		}
		if (!orgName) {
			res.json(getErrorMessage('\'orgName\''));
			return;
		}
		var token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
			username: username,
			orgName: orgName
		}, app.get('secret'));
		console.log("QQQQQQQQQQQQQQQQQQQQQQQQQ" + username);
		console.log("QQQQQQQQQQQQQQQQQQQQQQQQQ" + orgName);
		let response = await utils.enrollInitUser(username, orgName, true);
		if (response && typeof response !== 'string') {
			logger.debug('Successfully registered the username %s for organization %s', username, orgName);
			response.token = token;
			res.json(response);
		} else {
			logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
			res.json({
				success: false,
				message: response
			});
		}
	} catch (e) {
		res.json({
			success: false,
			message: e.toString()
		});
	}

});

// Create Channel
app.post(baseurl + '/create_channels', async function (req, res) {
	logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
	logger.debug('End point : /api/v1/create_channels');
	var channelName = req.body.channelName;
	var channelConfigPath = req.body.channelConfigPath;
	logger.debug('Channel name : ' + channelName);
	logger.debug('channelConfigPath : ' + channelConfigPath); //../artifacts/channel/mychannel.tx
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!channelConfigPath) {
		res.json(getErrorMessage('\'channelConfigPath\''));
		return;
	}

	let message = await createChannel.createChannel(channelName, channelConfigPath, req.username, req.orgname);
	res.send(message);
});
// Join Channel
app.post(baseurl + '/join_channels/:channelName/peers', async function (req, res) {
	logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
	var channelName = req.params.channelName;
	var peers = req.body.peers;
	logger.debug('channelName : ' + channelName);
	logger.debug('peers : ' + peers);
	logger.debug('username :' + req.username);
	logger.debug('orgname:' + req.orgname);

	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}

	let message = await join.joinChannel(channelName, peers, req.username, req.orgname);
	res.send(message);
});
// Install chaincode on target peers
app.post(baseurl + '/install_chaincodes', async function (req, res) {
	logger.debug('==================== INSTALL CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodePath = req.body.chaincodePath;
	var chaincodeVersion = req.body.chaincodeVersion;
	var chaincodeType = req.body.chaincodeType;
	logger.debug('peers : ' + peers); // target peers list
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodePath) {
		res.json(getErrorMessage('\'chaincodePath\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	let message = await install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, req.username, req.orgname)
	res.send(message);
});
// Instantiate chaincode on target peers
app.post(baseurl + '/instantiate_chaincode/:channelName/chaincodes', async function (req, res) {
	logger.debug('==================== INSTANTIATE CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var chaincodeType = req.body.chaincodeType;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('peers  : ' + peers);
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
	res.send(message);
});

// Upgrade chaincode on target peers
app.post(baseurl + '/upgrade_chaincode/:channelName/chaincodes', async function (req, res) {
	logger.debug('==================== UPGRADE CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var chaincodeType = req.body.chaincodeType;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('peers  : ' + peers);
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await upgrade.upgradeChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
	res.send(message);
});
// ************************************************************************************
// *****************************SmartContract Endpoints********************************
// ************************************************************************************


app.post(baseurl + '/newAffiliation', async function (req, res) {
	logger.debug('***/newAffiliation***');
	var orgName = req.body.orgName;
	var affliation = req.body.affliation;
	try {
		let message = await utils.createNewAffiliation(orgName, affliation);
		logger.debug(message);
		res.send(message);
	} catch (e) {
		var response = e.toString();
		logger.info(response);
		res.send(response);
	}
});



// ************************************************************************************
// *****************************BlockChain Query Endpoints*****************************
// ************************************************************************************

//Query for Channel Information
app.get(baseurl + '/jeadigitalchannel/info', async function (req, res) {
	console.log('================ QUERY CHANNEL INFORMATION ======================');
	var peer = "peer0.residents.jeabc.com";
	var channelName = "jeadigitalchannel";
	let message = await query.getChainInfo(peer, channelName, req.username, req.orgname);
	res.send(message);
});

//  Query Block by BlockNumber
app.get(baseurl + '/jeadigitalchannel/block_info/:blockId', async function (req, res) {
	console.log('==================== GET BLOCK BY NUMBER ==================');
	let blockId = req.params.blockId;
	let peer = "peer0.residents.jeabc.com";
	var channelName = "jeadigitalchannel";
	if (!blockId) {
		res.json(getErrorMessage('\'blockId\''));
		return;
	}
	let message = await query.getBlockByNumber(peer, channelName, blockId, req.username, req.orgname);
	res.send(message);
});

// Query Transaction by Transaction ID
app.get(baseurl + '/jeadigitalchannel/transaction_info/:trxnId', async function (req, res) {
	console.log('================ GET TRANSACTION BY TRANSACTION_ID ======================');
	let peer = "peer0.residents.jeabc.com";
	var channelName = "jeadigitalchannel";
	let trxnId = req.params.trxnId;
	if (!trxnId) {
		res.json(getErrorMessage('\'trxnId\''));
		return;
	}
	let message = await query.getTransactionByID(peer, channelName, trxnId, req.username, req.orgname);
	console.log(message);
	res.send(message);
});

// Query Block by Hash
app.get(baseurl + '/block/by_hash', async function (req, res) {
	console.log('================ GET BLOCK BY HASH ======================');
	let hash = req.query.hash;
	let peer = "peer0.residents.jeabc.com";
	var channelName = "jeadigitalchannel";
	if (!hash) {
		res.json(getErrorMessage('\'hash\''));
		return;
	}
	let message = await query.getBlockByHash(peer, channelName, hash, req.username, req.orgname);
	res.send(message);
});

//Query for Channel instantiated chaincodes
app.get(baseurl + '/jeadigitalchannel/instantiated_chaincodes', async function (req, res) {
	console.log('============= GET INSTANTIATED CHAINCODES ===================');
	let peer = "peer0.residents.jeabc.com";
	var channelName = "jeadigitalchannel";
	let message = await query.getInstalledChaincodes(peer, channelName, 'instantiated', req.username, req.orgname);
	res.send(message);
});

// Query to fetch all Installed chaincodes
app.get(baseurl + '/jeadigitalchannel/installed_chaincodes', async function (req, res) {
	let peer = "peer0.residents.jeabc.com";
	var channelName = "jeadigitalchannel";
	console.log('================ GET INSTALLED CHAINCODES ======================');
	let message = await query.getInstalledChaincodes(peer, channelName, 'installed', req.username, req.orgname)
	res.send(message);
});

// Query to fetch channels
app.get(baseurl + '/get_channels', async function (req, res) {
	console.log('================ GET CHANNELS ======================');
	let peer = "peer0.residents.jeabc.com";
	if (!peer) {
		res.json(getErrorMessage('\'peer\''));
		return;
	}
	let message = await query.getChannels(peer, req.username, req.orgname);
	res.send(message);
});

app.post(baseurl + '/register_residents', async function (req, res) {
	console.log('============= NEW USER REGISTRATION REQUEST==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	var channelName = "jeadigitalchannel";
	var fcn = "registerResidents";
	var chaincodeName = "energymanagement";
	var peers = "";
	var orgName = "";

	peers = "peer0.residents.jeabc.com";
	orgName = "Residents";
	if (args.length != 7) {
		res.send({
			success: false,
			message: 'Incorrect argument length'
		});
	}
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null || args[4] == null || args[5] == null || args[6] == null) {
		res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	/*
		if ( typeof args[3]!="number"||typeof args[4]!="number"||typeof args[5]!="number"){
			res.send({
				success: false,
				message: 'argument must be number'
		});
	}
	*/
	try {
		let message = await utils.registerNewUser(peers, channelName, chaincodeName, fcn, args, orgName, true);
		console.log(message);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}

});


app.post(baseurl + '/register_bank', async function (req, res) {
	console.log('============= NEW USER REGISTRATION REQUEST==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	var channelName = "jeadigitalchannel";
	var fcn = "registerBank";
	var chaincodeName = "energymanagement";
	var peers = "";
	var orgName = "";

	peers = "peer0.bank.jeabc.com";
	orgName = "Bank";
	if (args.length != 3) {
		res.send({
			success: false,
			message: 'Incorrect argument length'
		});
	}
	if (args[0] == null || args[1] == null || args[2] == null) {
		res.send("Invalid input arguments");
	}

	if (!chaincodeName) {
		return res.send({
			success: false,
			message: 'Invalid chaincodeName'
		});
	}
	if (!channelName) {
		return res.send({
			success: false,
			message: 'Invalid channelName'
		});
	}
	if (!fcn) {
		return res.send({
			success: false,
			message: 'Invalid input function name'
		});
	}
	let message = await utils.registerNewUser(peers, channelName, chaincodeName, fcn, args, orgName, true);
	res.send(message);
});

app.post(baseurl + '/register_utilitycompany', async function (req, res) {
	console.log('============= NEW USER REGISTRATION REQUEST==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	var channelName = "jeadigitalchannel";
	var fcn = "registerUtilityCompany";
	var chaincodeName = "energymanagement";
	var peers = "";
	var orgName = "";

	peers = "peer0.utilitycompany.jeabc.com";
	orgName = "UtilityCompany";
	if (args.length != 6) {
		res.send({
			success: false,
			message: 'Incorrect argument length'
		});
	}
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null || args[4] == null) {
		res.send("Invalid input arguments");
	}


	if (!chaincodeName) {
		return res.send({
			success: false,
			message: 'Invalid chaincodeName'
		});
	}
	if (!channelName) {
		return res.send({
			success: false,
			message: 'Invalid channelName'
		});
	}
	if (!fcn) {
		return res.send({
			success: false,
			message: 'Invalid input function name'
		});
	}
	let message = await utils.registerNewUser(peers, channelName, chaincodeName, fcn, args, orgName, true);
	res.send(message);
});

app.post(baseurl + '/login', async function (req, res) {
	console.log('==================== QUERY BY CHAINCODE ==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	if (args.length != 3) {
		res.send({
			success: false,
			message: 'Incorrect argument length'
		});
	}
	try {

		var channelName = "jeadigitalchannel";
		var fcn = "authUser";
		var chaincodeName = "energymanagement";
		console.log(args);
		var peer = "";
		var orgName = "";
		if (args[2] == "Resident") {
			peer = "peer0.residents.jeabc.com";
			orgName = "Residents";
		} else if (args[2] == "Bank") {
			peer = "peer0.bank.jeabc.com";
			orgName = "Bank";
		} else if (args[2] == "UtilityCompany") {
			peer = "peer0.utilitycompany.jeabc.com";
			orgName = "UtilityCompany";
		} else {
			response = {
				user: args[0],
				success: false,
				role: null,
				message: 'Invalid User role',
				token: null
			};
			return res.send(response);
		}
		logger.info("12");
		var username = args[0];
		var role = args[2];
		var token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
			username: username,
			orgName: orgName,
			role: role
		}, app.get('secret'));

		let response = await utils.getRegisteredUser(username, orgName, true);
		let message = await query.queryLogin(peer, channelName, chaincodeName, args, orgName, fcn);
		var auth = message.toString();
		try {
			var auth_json = JSON.parse(auth);
			if (auth_json.success == true) {
				auth_json.token = token;
				console.log(auth_json);
				logger.info("User " + username + " Sucessfully loged in as " + auth_json.role);
				return res.send(auth_json);
			} else {
				auth_json.token = null;
				return res.send(auth_json);
			}
		} catch (err) {
			return res.send(auth);
		}
	} catch (err) {
		var response = {
			user: args[0],
			success: false,
			role: null,
			message: 'Invalid User',
			token: null
		};
		return res.send(response);
	}
});

app.get(baseurl + '/get_user_status/:residentId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getUserStatus";
	var args = [];
	args.push(req.params.residentId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_bank_status/:bankId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.bank.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getBankStatus";
	var args = [];
	args.push(req.params.bankId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_utilitycompany_status/:companyId', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.utilitycompany.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getUtilityCompanyStatus";
	var args = [];
	args.push(req.params.companyId);
	var role = req.role;
	logger.info(role);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_all_residents', async function (req, res) {
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllUserStatus";
	var args = [];


	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_all_bank', async function (req, res) {
	var peer = "peer0.bank.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllBankStatus";
	var args = [];


	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_all_utilitycompany', async function (req, res) {
	var peer = "peer0.utilitycompany.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllUtilityCompanyStatus";
	var args = [];


	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.post(baseurl + '/sell_resident_to_utilitycompany', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "sellEnergyResidentToUtilityCompany";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		//res.send(message);
		var success = {
            "success": true,
            "tx_id": message.tx_id,
            "resp": " Successfully sold energy"
        }
        res.send(success);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});

app.post(baseurl + '/buy_resident_to_utilitycompany', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "buyEnergyResidentToUtilityCompany";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		//res.send(message);
		var success = {
            "success": true,
            "tx_id": message.tx_id,
            "resp": " Successfully bought energy"
        }
        res.send(success);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});

//resident to utility cion transaction
/*
app.post(baseurl + '/resident_to_bank', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "residentToUtilityCompanyCoinTransaction";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});*/

app.post(baseurl + '/utilitycompany_to_bank', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.utilitycompany.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "utilityCompanyToBankTransaction";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
});

app.post(baseurl + '/update_energy_value', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	//var fcn = "updateEnergyValue";
	var fcn = "incrementEnergyValue";
	//var args = []
	var username = req.username;
	var orgname = req.orgname;
	//args.push(username);
	//args.push(req.body.energy);
	//args.push("u202@email.com");
	var args = req.body.args;
	if (args[0] == null || args[1] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
})



app.get(baseurl + '/get_all_energy', async function (req, res) {
	var peer = "peer0.utilitycompany.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "listAllEnergy";
	var args = [];


	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_all_coin', async function (req, res) {
	var peer = "peer0.utilitycompany.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "listAllCoin";
	var args = [];


	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_all_cash', async function (req, res) {
	var peer = "peer0.utilitycompany.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "listAllCash";
	var args = [];


	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/userlist', async function (req, res) {
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getAllUserStatus";
	var args = [];
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, "admin", "Residents");
	var userlist = []
	var list = JSON.parse(message);
	list.forEach(function (value) {
		userlist.push(value.ResidentID);
	});
	res.send(userlist);
});

app.get(baseurl + '/get_energy_status/:Userid', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getEnergyStatus";
	var args = [];
	args.push(req.params.Userid);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_coin_status/:Userid', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getCoinStatus";
	var args = [];
	args.push(req.params.Userid);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_cash_status/:Userid', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getCashStatus";
	var args = [];
	args.push(req.params.Userid);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.get(baseurl + '/get_coin_status/:Residentid/:coinID', async function (req, res) {
	logger.debug('====================Get All Invoice ==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "GetStatusOfCoin";
	var args = [];
	args.push(req.params.Residentid);
	args.push(req.params.coinID);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});

app.post(baseurl + '/register_residents_trial', async function (req, res) {
	console.log('============= NEW USER REGISTRATION REQUEST==================');
	var args = req.body.args;
	if (!args) {
		return res.send({
			success: false,
			message: 'Invalid input arguments'
		});
	}
	var channelName = "jeadigitalchannel";
	var fcn = "registerResidents";
	var chaincodeName = "energymanagement";
	var peers = "";
	var orgName = "";

	peers = "peer0.residents.jeabc.com";
	orgName = "Residents";

	if (args.length != 7) {
		res.send({
			success: false,
			message: 'Incorrect argument length'
		});
	}
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null || args[4] == null || args[5] == null || args[6] == null) {
		res.send("Invalid input arguments");
	}


	if (!chaincodeName) {
		return res.send({
			success: false,
			message: 'Invalid chaincodeName'
		});
	}
	if (!channelName) {
		return res.send({
			success: false,
			message: 'Invalid channelName'
		});
	}
	if (!fcn) {
		return res.send({
			success: false,
			message: 'Invalid input function name'
		});
	}
	let message = await utils.registerNewUser(peers, channelName, chaincodeName, fcn, args, orgName, true);
	res.send(message);
});


app.post(baseurl + '/resident_to_bank', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "residentToUtilityCompanyCoinTransaction";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	//args.push(username);
	//args.push("u202@email.com");
	//args.push(req.body.args);
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + args);
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		var resp = {
			resp: message,
			message: "Transaction Sucessfull"
		}
		res.send(resp);
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		var resp = {
			resp: response,
			message: "Transaction Failed "
		}
		res.send(resp);
	}
})

//********************************************************************************************************

app.get(baseurl + '/get_user_energy_history', async function (req, res) {
	logger.debug('====================Get user_energy_history==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getUserEnergyHistory";
	var args = [];
	args.push(req.username);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});


app.get(baseurl + '/get_all_energy_history', async function (req, res) {
	logger.debug('====================Get user_energy_history==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getUtilityCompanyEnergyHistory";
	var args = [];
	args.push(req.username);
	var role = req.role;
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	logger.debug(message);
	res.send(message);
});
app.get(baseurl + '/get_user_bank_history/:AccountID', async function (req, res) {

    logger.debug('====================Get user_energy_history==================');
    var peer = "peer0.bank.jeabc.com";
    var chaincodeName = "energymanagement";
    var channelName = "jeadigitalchannel";
    var fcn = "getUserBankHistory";
    var args = [];
	//args.push(req.username);
	args.push(req.params.AccountID);
    var role = req.role;
    logger.info(role);
    logger.info("<<>>" + args);
    let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
    logger.debug(message);
    res.send(message);
});

///********************************* QUOTE ******************************* */



app.get(baseurl + '/get_all_quotes', async function (req, res) {
	logger.debug('====================Get All Quotes ==================');
	var peer = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "getQuote";
	var args = [];
	var role = req.role;
	var username="r1@email.com";
	var orgname="Residents";
	
	logger.info(role);
	logger.info("<<>>" + args);
	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, username,orgname);
	logger.debug(message);
	res.send(message);
});


app.post(baseurl + '/sell_resident_to_utilitycompany', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "sellEnergyResidentToUtilityCompany";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
		var response = {
            "success": true,
            "tx_id": message.tx_id,
            "resp": " Successfully sold energy"
        }
        res.send(response);
	
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
	
	
});

app.post(baseurl + '/buy_resident_to_utilitycompany', async function (req, res) {
	logger.debug('====================Update Invoice ==================');
	var peers = "peer0.residents.jeabc.com";
	var chaincodeName = "energymanagement";
	var channelName = "jeadigitalchannel";
	var fcn = "buyEnergyResidentToUtilityCompany";
	var args = req.body.args;
	var username = req.username;
	var orgname = req.orgname;
	if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
		res.send("Invalid input arguments");
	}
	try {
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
		logger.debug(message);
		res.send(message);
		var response = {
            "success": true,
            "tx_id": message.tx_id,
            "resp": " Successfully bought energy"
        }
        res.send(response);
		
	} catch (err) {
		logger.info(err);
		var response = err.toString();
		res.send(response);
	}
	
	
});
app.post(baseurl + '/submit_quote', async function (req, res) {
    console.log('============= SUBMIT NEW QUOTE ==================');
    var args = req.body.args;
    if (!args) {
        return res.send({
            success: false,
            message: 'Invalid input arguments'
        });
    }
    var channelName = "jeadigitalchannel";
    var fcn = "submitQuote";
    var chaincodeName = "energymanagement";
    var peers = "";
    var orgName = "";
    var username = req.username;
    var orgname = req.orgname;

    peers = "peer0.residents.jeabc.com";
    orgName = "Residents";

    if (args.length != 7) {
        res.send({
            success: false,
            message: 'Incorrect argument length'
        });
    }
    if (args[0] == null || args[1] == null || args[2] == null || args[3] == null || args[4] == null || args[5] == null || args[6] == null) {
        res.send("Invalid input arguments");
    }


    if (!chaincodeName) {
        return res.send({
            success: false,
            message: 'Invalid chaincodeName'
        });
    }
    if (!channelName) {
        return res.send({
            success: false,
            message: 'Invalid channelName'
        });
    }
    if (!fcn) {
        return res.send({
            success: false,
            message: 'Invalid input function name'
        });
    }
    try {
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
        logger.debug(message);
		//res.send(message);
		var response = {
            "resp": true,
            "tx_id": message.tx_id,
            "resp": " sucessfully submitted quote"
        }
        res.send(response);
    } catch (err) {
        logger.info(err);
        var response = err.toString();
        res.send(response);
    }
});
app.get(baseurl + '/list_all_customers', async function (req, res) {
    var peer = "peer0.bank.jeabc.com";
    var chaincodeName = "energymanagement";
    var channelName = "jeadigitalchannel";
    var fcn = "listAllCustomers";
    var args = [];


    let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
    logger.debug(message);
    res.send(message);
});

app.post(baseurl + '/userToBank', async function (req, res) {
    logger.debug('====================Update Invoice ==================');
    var peers = "peer0.residents.jeabc.com";
    var chaincodeName = "energymanagement";
    var channelName = "jeadigitalchannel";
    var fcn = "userToBankTransaction";
    var args = req.body.args;
    var username = req.username;
    var orgname = req.orgname;
    if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
        res.send("Invalid input arguments");
    }
    try {
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgname);
        logger.debug(message);
		
		var success = {
            "success": true,
            "tx_id": message.tx_id,
            "resp": " Transaction Successfull"
        }
        res.send(success);
    } catch (err) {
        logger.info(err);
        var response = err.toString();
        res.send(response);
    }
});
