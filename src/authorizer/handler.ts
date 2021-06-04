import { validateToken, getPublicKeys } from '../../helpers/verifyToken';
import { PolicyIamManager } from '../../helpers/policyIamManager';

//aqui debe ir la obtención de las llaves publicas
let publicKey: any = null;

export async function authorizer(event: any, context: any, callback: any) {
    console.log("hola mundo que tal a todos")
    console.log(event.methodArn);
    

    if (!publicKey) {
        console.log("entro en el obtener publi keys")
        publicKey = await getPublicKeys();
    }

    const policyIamManager = new PolicyIamManager();

    // const token = await  authorizerMagager.getToken(event.authorizationToken.split(" ")[1]);
    const token = await validateToken({ token: event.authorizationToken.split(" ")[1], publicKey })
    console.log("hola que talr")
    if (!token.isValid) return { err: "Token no valido" }
    console.log("Estoy aqui", event.methodArn)
    let role = token.roles[0];
        switch (role) {
            case 'ADMIN':
                callback(null, policyIamManager.getPolicy('user', "Allow", event.methodArn));
                break;
            case 'CAPTURADOR':
                callback(null, policyIamManager.getPolicy('user', "Allow", event.methodArn));
                break;
            case 'REPORTES':
                callback(null, policyIamManager.getPolicy('user', "Allow", event.methodArn));
            default:
                return {
                    statusCode: 401,
                    body: JSON.stringify({
                        message: {
                            err: 'Usuario no authenticado'
                        }
                    })
                }
        }
    
};