import { register, verify, auth_login  } from './functionUser'


export async function createUser(event) {
    let { nombre, username, email, password, telefono, role } = JSON.parse(event.body);
    const eventRegister = await register({ nombre, username, email, password, telefono, role });
    if (eventRegister === true) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Usuario registrado',
            })
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            err: {
                message: eventRegister.err
            }
        })
    }
}

export async function verifyUser(event) {
    let { username, code } = JSON.parse(event.body);
    const eventVerify = await verify({
        username,
        code
    });
    console.log(eventVerify);
    if (eventVerify === true) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Cuenta verificada'
            })
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            err: {
                message: eventVerify.err
            }
        })
    }
}

export async function login (event) {
    let { username, password } = JSON.parse(event.body);
    const eventLogin = await auth_login({
        username,
        password,
    });
    if(eventLogin.success === true) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login Correcto',
                token: eventLogin.token,
                refreshToken: eventLogin.refresh
            })
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            err: {
                message: eventLogin.err
            }
        })
    }
}