import { signUpUser, verifyAccount, auth } from '../../helpers/cognito_Function';

interface register {
    username: string,
    email: string,
    password: string,
    nombre: string,
    telefono: string,
    role: string
}

interface verifyFunction {
    username: string,
    code: string
}

export async function register({ username, email, password, nombre, telefono, role, }: register) {    
    let userAttr:Array<any> = [];
    let dominio = email.split("@");

    userAttr.push({ Name: 'email', Value: email });
    userAttr.push({ Name: 'name', Value: nombre });
    userAttr.push({ Name: 'phone_number', Value: telefono });
    userAttr.push({ Name: 'custom:role', Value: role });
    userAttr.push({ Name: 'custom:domain', Value: dominio[1] })
    console.log(userAttr);
    const registerUser = await signUpUser({
        username,
        password,
        role,
        userAttr
    });
    if(registerUser === true) return true;
    else {
        return {
            err: 'Error al registrar el usuario.'
        }   
    }
}

export async function verify ({ username, code }:verifyFunction) {
    const verify = await verifyAccount({username, code});
    if(verify === false) {
        return {
            err: 'No se pudo verificar la cuenta'
        }
    }
    return true;
}

export async function auth_login ({ username, password }) {
    const login = await auth({ username, password });
    if(login.success === true) {
        return {
            success: login.success,
            token: login.token,
            refresh: login.refreshToken
        }
    }
    else {
        return {
            err: 'USUARIO Y CONTRASEÑA INCORRECTOS'
        }
    }
    
}
