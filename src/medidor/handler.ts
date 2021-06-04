import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'query-string';
const dynamoDB = new DynamoDB.DocumentClient();
const tableMedidor: any = process.env.tableMedidor;
import { UpdateData, deleteData } from './functionMedidor';


export async function getMedidor() {
    try {
        let medidorDB = {
            TableName: tableMedidor
        }
        const dataDB = await dynamoDB.scan(medidorDB).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Medidores encontrados",
                data: dataDB.Items
            })
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 404,
            body: JSON.stringify({
                err: {
                    message: e
                }
            })
        }
    }
}

export async function getMedidorById(event) {
    let { medidor } = event.queryStringParameters;
    try {
        let medidorId = {
            TableName: tableMedidor,
            Key: {
                idMedidor: medidor
            }
        }
        const medidorDB = await dynamoDB.get(medidorId).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Medidor encontrado",
                data: medidorDB.Item
            })
        }

    } catch (e) {
        console.log(e);
        return {
            statusCode: 404,
            body: JSON.stringify({
                err: {
                    message: e
                }
            })
        }
    }
}

export async function createMedidor(event) {
    const body = JSON.parse(event.body);
    try {
        let newMedidor = {
            TableName: tableMedidor,
            Item: {
                idMedidor: uuidv4(),
                numero_medidor: body.numero_medidor,
                watts: body.watts,
                date: Date.now()
            }
        }
        await dynamoDB.put(newMedidor).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Medidor guardador.',
                data: newMedidor.Item
            })
        };

    } catch (e) {
        console.log(e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                err: {
                    message: e
                }
            })
        }
    }
}

export async function upMedidor(event) {
    let ID = event.pathParameters.ID;
    const { medidor, watts } = JSON.parse(event.body);
    try {
        const medidorUpdate = await UpdateData({
            Tablename: tableMedidor,
            primaryKey: 'idMedidor',
            primaryKeyValue: ID,
            updateValue: {
                medidor,
                watts
            }
        });
        console.log(medidorUpdate);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Medidor Actualizado'
            })
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                err: {
                    message: 'Error al actualizar el medidor'
                }
            })
        }
    }
}

export async function deleteMedidor(event) {
    let ID = event.pathParameters.ID;
    try {
        let eventDelete = await deleteData({
            Tablename: tableMedidor,
            PrimaryKey: ID
        });
        console.log(eventDelete);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Medidor eliminado'
            })
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                err: {
                    message: 'Error al eliminar el medidor'
                }
            })
        }
    }
}