import * as Axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';
import { isObjEmpty } from './objectManager';
const jwkToPem = require('jwk-to-pem');

export interface ClaimVerifyRequest {
  readonly token?: string;
  readonly publicKey: any;
}

export interface ClaimVerifyResult {
  readonly userName?: string;
  readonly email?: string;
  readonly clientId?: string;
  readonly roles?: any;
  readonly isValid: boolean;
  readonly error?: any;
}

interface TokenHeader {
  kid: string;
  alg: string;
}
interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username?: string;
  'cognito:username': string;
  email: string;
  client_id: string;
}

const cognitoPoolId = process.env.userPoolId || '';
const region= cognitoPoolId.split('_')[0];
if (!cognitoPoolId) {
  throw new Error('env var required for cognito pool');
}
const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}`;


let cacheKeys: MapOfKidToPublicKey | undefined;
const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
  if (!cacheKeys) {
    const url = `${cognitoIssuer}/.well-known/jwks.json`;
    const publicKeys = await Axios.default.get<PublicKeys>(url);
    cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
      const pem = jwkToPem(current);
      agg[current.kid] = {instance: current, pem};
      return agg;
    }, {} as MapOfKidToPublicKey);
    return cacheKeys;
  } else {
    return cacheKeys;
  }
};

//const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

function verifyPromised(token: any, pem: any){
  return new Promise(async(resolve, reject) => {
      try {
        const resp = await jsonwebtoken.verify(token, pem);
        resolve(resp)
      } catch (error) {
        reject({})
      }

  })
}

const validateToken = async (request: ClaimVerifyRequest): Promise<ClaimVerifyResult> => {
  let result: ClaimVerifyResult;
  try {
    const token = request.token;
    const tokenSections = (token || '').split('.');
    if (tokenSections.length < 2) {
      throw new Error('requested token is invalid');
    }
    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON) as TokenHeader;
    const keys = request.publicKey;
    const key = keys[header.kid];
    if (key === undefined) {
      throw new Error('claim made for unknown kid');
    }
    const claim = await verifyPromised(token, key.pem) as Claim;
    if(isObjEmpty(claim))throw new Error('claim is expired or invalid');
    const currentSeconds = Math.floor( (new Date()).valueOf() / 1000);
    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error('claim is expired or invalid');
    }
    if (claim.iss !== cognitoIssuer) {
      throw new Error('claim issuer is invalid');
    }
    if (claim.token_use !== 'access' && claim.token_use !== "id") {
      throw new Error('claim use is not access');
    }
    result = {roles: claim['cognito:groups'], isValid: true};
  } catch (error) {
    result = {error: error.message, email: "", isValid: false};
  }
  return result;
};

export {validateToken, getPublicKeys};
