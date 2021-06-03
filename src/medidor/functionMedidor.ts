import { DynamoDB } from 'aws-sdk';
const dynamoDB = new DynamoDB.DocumentClient();

interface medidor {
    Tablename: any,
    primaryKey: string,
    primaryKeyValue: string,
    updateValue: {
        medidor: string,
        watts: string | number
    }
}

interface deleteMedidor {
    Tablename: any,
    PrimaryKey: string
}

export async function UpdateData({ Tablename, primaryKey, primaryKeyValue, updateValue }: medidor) {
    console.log("Estamos en updateData", updateValue);
    const params = {
        TableName: Tablename,
        Key: { [primaryKey]: primaryKeyValue },
        UpdateExpression: 'set numero_medidor = :numero_medidor, watts = :watts',
        ExpressionAttributeValues: {
            ':numero_medidor': updateValue.medidor,
            ':watts': updateValue.watts
        }
    }
    const TableUpdate = await dynamoDB.update(params).promise();
    return TableUpdate;
}

export async function deleteData({Tablename, PrimaryKey}: deleteMedidor) {
    const params = {
        TableName: Tablename,
        Key: {
            idMedidor: PrimaryKey
        }
    }
    const TableDelete = await dynamoDB.delete(params).promise();
    return TableDelete;
}