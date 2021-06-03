require('dotenv').config()
import { CognitoIdentityServiceProvider } from 'aws-sdk';
const crypto = require('crypto');
const clientId:any = process.env.AWS_ID_Client_App;
const secretHash:any = process.env.AWS_Secret_App;
const userPoolId:any = process.env.userPoolId;


interface signUp {
    username: string,
    password: string,
    role: string,
    userAttr: Array<any>
};

interface verify {
    username: string,
    code: string
};

interface auth {
    username: string,
    password: string
};

type GroupParams = {
    UserPoolId: string
    GroupName: string,
};

type UserParams = {
    UserPoolId: string,
    Username: string,
    GroupName: string
};

const config = {
    region: 'us-east-1'
}

const cognitoIdentity = new CognitoIdentityServiceProvider(config);

export async function signUpUser({ username, password, role, userAttr }: signUp): Promise<boolean> {

    const groupParams: GroupParams = {
        UserPoolId: userPoolId,
        GroupName: ''
    };
    const userParams: UserParams = {
        UserPoolId: userPoolId,
        Username: username,
        GroupName: ''
    };

    const validRole = ValidRole(role);
    if(validRole) {
        groupParams.GroupName = role,
        userParams.GroupName = role;
    };
    
    const params = {
        ClientId: clientId,
        Password: password,
        Username: username,
        SecretHash: generateHash(username),
        UserAttributes: userAttr
    };

    try {
        const data = await cognitoIdentity.signUp(params).promise();
        console.log(data);
    } catch (e) {
        console.log(e);
    }

    try {
        await cognitoIdentity.getGroup(groupParams).promise();
    } catch (e) {
        await cognitoIdentity.createGroup(groupParams).promise();
    }

    try {
        const createGroup = await cognitoIdentity.adminAddUserToGroup(userParams).promise();
        console.log(createGroup);
    } catch (e) {
        console.log(e);
    }

    return true;
}

export async function verifyAccount ({ username, code }: verify): Promise<boolean> {
    const params = {
        ClientId: clientId,
        Username: username,
        ConfirmationCode: code,
        SecretHash: generateHash(username)
    }
    try {
        const data = await cognitoIdentity.confirmSignUp(params).promise();
        console.log(data);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function auth ({ username, password }: auth) {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            'USERNAME': username,
            'PASSWORD': password,
            'SECRET_HASH': generateHash(username)
        },   
    };
    try {
        const data = await cognitoIdentity.initiateAuth(params).promise();
        console.log(data);
        let res = {
            success: true,
            token: data.AuthenticationResult?.AccessToken,
            refreshToken: data.AuthenticationResult?.RefreshToken
        }
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
}

function generateHash (username:string):string {
    return crypto.createHmac('SHA256', secretHash)
        .update(username + clientId)
        .digest('base64')
}

function ValidRole (role:string): Boolean {
    const ValidRoles:Array<string> = ['ADMIN', 'CAPTURADOR', 'REPORTES'];
    const Validation:Boolean = ValidRoles.includes(role);
    return Validation;

}



