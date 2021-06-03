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
exports.auth_login = exports.verify = exports.register = void 0;
var cognito_Function_1 = require("../../helpers/cognito_Function");
function register(_a) {
    var username = _a.username, email = _a.email, password = _a.password, nombre = _a.nombre, telefono = _a.telefono, role = _a.role;
    return __awaiter(this, void 0, void 0, function () {
        var userAttr, dominio, registerUser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userAttr = [];
                    dominio = email.split("@");
                    userAttr.push({ Name: 'email', Value: email });
                    userAttr.push({ Name: 'name', Value: nombre });
                    userAttr.push({ Name: 'phone_number', Value: telefono });
                    userAttr.push({ Name: 'custom:role', Value: role });
                    userAttr.push({ Name: 'custom:domain', Value: dominio[1] });
                    console.log(userAttr);
                    return [4 /*yield*/, cognito_Function_1.signUpUser({
                            username: username,
                            password: password,
                            role: role,
                            userAttr: userAttr
                        })];
                case 1:
                    registerUser = _b.sent();
                    if (registerUser === true)
                        return [2 /*return*/, true];
                    else {
                        return [2 /*return*/, {
                                err: 'Error al registrar el usuario.'
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
function verify(_a) {
    var username = _a.username, code = _a.code;
    return __awaiter(this, void 0, void 0, function () {
        var verify;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cognito_Function_1.verifyAccount({ username: username, code: code })];
                case 1:
                    verify = _b.sent();
                    if (verify === false) {
                        return [2 /*return*/, {
                                err: 'No se pudo verificar la cuenta'
                            }];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.verify = verify;
function auth_login(_a) {
    var username = _a.username, password = _a.password;
    return __awaiter(this, void 0, void 0, function () {
        var login;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cognito_Function_1.auth({ username: username, password: password })];
                case 1:
                    login = _b.sent();
                    if (login.success === true) {
                        return [2 /*return*/, {
                                success: login.success,
                                token: login.token,
                                refresh: login.refreshToken
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                err: 'USUARIO Y CONTRASEÑA INCORRECTOS'
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.auth_login = auth_login;
//# sourceMappingURL=functionUser.js.map