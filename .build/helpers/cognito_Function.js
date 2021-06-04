"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.verifyAccount = exports.signUpUser = void 0;
require('dotenv').config();
var aws_sdk_1 = require("aws-sdk");
var crypto = require('crypto');
var clientId = process.env.AWS_ID_Client_App;
var secretHash = process.env.AWS_Secret_App;
var userPoolId = process.env.userPoolId;
;
;
;
var config = {
    region: 'us-east-1'
};
var cognitoIdentity = new aws_sdk_1.CognitoIdentityServiceProvider(config);
function signUpUser(_a) {
    var username = _a.username, password = _a.password, role = _a.role, userAttr = _a.userAttr;
    return __awaiter(this, void 0, void 0, function () {
        var groupParams, userParams, validRole, params, data, e_1, e_2, createGroup, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    groupParams = {
                        UserPoolId: userPoolId,
                        GroupName: ''
                    };
                    userParams = {
                        UserPoolId: userPoolId,
                        Username: username,
                        GroupName: ''
                    };
                    validRole = ValidRole(role);
                    if (validRole) {
                        groupParams.GroupName = role,
                            userParams.GroupName = role;
                    }
                    ;
                    params = {
                        ClientId: clientId,
                        Password: password,
                        Username: username,
                        //SecretHash: generateHash(username),
                        UserAttributes: userAttr
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cognitoIdentity.signUp(params).promise()];
                case 2:
                    data = _b.sent();
                    console.log(data);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4:
                    _b.trys.push([4, 6, , 8]);
                    return [4 /*yield*/, cognitoIdentity.getGroup(groupParams).promise()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6:
                    e_2 = _b.sent();
                    return [4 /*yield*/, cognitoIdentity.createGroup(groupParams).promise()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, cognitoIdentity.adminAddUserToGroup(userParams).promise()];
                case 9:
                    createGroup = _b.sent();
                    console.log(createGroup);
                    return [3 /*break*/, 11];
                case 10:
                    e_3 = _b.sent();
                    console.log(e_3);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, true];
            }
        });
    });
}
exports.signUpUser = signUpUser;
function verifyAccount(_a) {
    var username = _a.username, code = _a.code;
    return __awaiter(this, void 0, void 0, function () {
        var params, data, e_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    params = {
                        ClientId: clientId,
                        Username: username,
                        ConfirmationCode: code,
                        SecretHash: generateHash(username)
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cognitoIdentity.confirmSignUp(params).promise()];
                case 2:
                    data = _b.sent();
                    console.log(data);
                    return [2 /*return*/, true];
                case 3:
                    e_4 = _b.sent();
                    console.log(e_4);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.verifyAccount = verifyAccount;
function auth(_a) {
    var _b, _c;
    var username = _a.username, password = _a.password;
    return __awaiter(this, void 0, void 0, function () {
        var params, data, res, e_5;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    params = {
                        AuthFlow: 'USER_PASSWORD_AUTH',
                        ClientId: clientId,
                        AuthParameters: {
                            'USERNAME': username,
                            'PASSWORD': password,
                            'SECRET_HASH': generateHash(username)
                        },
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cognitoIdentity.initiateAuth(params).promise()];
                case 2:
                    data = _d.sent();
                    console.log(data);
                    res = {
                        success: true,
                        token: (_b = data.AuthenticationResult) === null || _b === void 0 ? void 0 : _b.AccessToken,
                        refreshToken: (_c = data.AuthenticationResult) === null || _c === void 0 ? void 0 : _c.RefreshToken
                    };
                    return [2 /*return*/, res];
                case 3:
                    e_5 = _d.sent();
                    console.log(e_5);
                    return [2 /*return*/, e_5];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.auth = auth;
function generateHash(username) {
    return crypto.createHmac('SHA256', secretHash)
        .update(username + clientId)
        .digest('base64');
}
function ValidRole(role) {
    var ValidRoles = ['ADMIN', 'CAPTURADOR', 'REPORTES'];
    var Validation = ValidRoles.includes(role);
    return Validation;
}
//# sourceMappingURL=cognito_Function.js.map