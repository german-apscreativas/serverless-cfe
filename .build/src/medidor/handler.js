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
exports.deleteMedidor = exports.upMedidor = exports.createMedidor = exports.getMedidorById = exports.getMedidor = void 0;
var aws_sdk_1 = require("aws-sdk");
var uuid_1 = require("uuid");
var dynamoDB = new aws_sdk_1.DynamoDB.DocumentClient();
var tableMedidor = process.env.tableMedidor;
var functionMedidor_1 = require("./functionMedidor");
function getMedidor() {
    return __awaiter(this, void 0, void 0, function () {
        var medidorDB, dataDB, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    medidorDB = {
                        TableName: tableMedidor
                    };
                    return [4 /*yield*/, dynamoDB.scan(medidorDB).promise()];
                case 1:
                    dataDB = _a.sent();
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: "Medidores encontrados",
                                data: dataDB.Items
                            })
                        }];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({
                                err: {
                                    message: e_1
                                }
                            })
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getMedidor = getMedidor;
function getMedidorById(event) {
    return __awaiter(this, void 0, void 0, function () {
        var medidor, medidorId, medidorDB, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    medidor = event.queryStringParameters.medidor;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    medidorId = {
                        TableName: tableMedidor,
                        Key: {
                            idMedidor: medidor
                        }
                    };
                    return [4 /*yield*/, dynamoDB.get(medidorId).promise()];
                case 2:
                    medidorDB = _a.sent();
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: "Medidor encontrado",
                                data: medidorDB.Item
                            })
                        }];
                case 3:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({
                                err: {
                                    message: e_2
                                }
                            })
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getMedidorById = getMedidorById;
function createMedidor(event) {
    return __awaiter(this, void 0, void 0, function () {
        var body, newMedidor, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = JSON.parse(event.body);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    newMedidor = {
                        TableName: tableMedidor,
                        Item: {
                            idMedidor: uuid_1.v4(),
                            numero_medidor: body.numero_medidor,
                            watts: body.watts,
                            date: Date.now()
                        }
                    };
                    return [4 /*yield*/, dynamoDB.put(newMedidor).promise()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: 'Medidor guardador.',
                                data: newMedidor.Item
                            })
                        }];
                case 3:
                    e_3 = _a.sent();
                    console.log(e_3);
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({
                                err: {
                                    message: e_3
                                }
                            })
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createMedidor = createMedidor;
function upMedidor(event) {
    return __awaiter(this, void 0, void 0, function () {
        var ID, _a, medidor, watts, medidorUpdate, e_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ID = event.pathParameters.ID;
                    _a = JSON.parse(event.body), medidor = _a.medidor, watts = _a.watts;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, functionMedidor_1.UpdateData({
                            Tablename: tableMedidor,
                            primaryKey: 'idMedidor',
                            primaryKeyValue: ID,
                            updateValue: {
                                medidor: medidor,
                                watts: watts
                            }
                        })];
                case 2:
                    medidorUpdate = _b.sent();
                    console.log(medidorUpdate);
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: 'Medidor Actualizado'
                            })
                        }];
                case 3:
                    e_4 = _b.sent();
                    console.log(e_4);
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({
                                err: {
                                    message: 'Error al actualizar el medidor'
                                }
                            })
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.upMedidor = upMedidor;
function deleteMedidor(event) {
    return __awaiter(this, void 0, void 0, function () {
        var ID, eventDelete, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ID = event.pathParameters.ID;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, functionMedidor_1.deleteData({
                            Tablename: tableMedidor,
                            PrimaryKey: ID
                        })];
                case 2:
                    eventDelete = _a.sent();
                    console.log(eventDelete);
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: 'Medidor eliminado'
                            })
                        }];
                case 3:
                    e_5 = _a.sent();
                    console.log(e_5);
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({
                                err: {
                                    message: 'Error al eliminar el medidor'
                                }
                            })
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteMedidor = deleteMedidor;
//# sourceMappingURL=handler.js.map