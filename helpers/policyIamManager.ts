export class PolicyIamManager {

    // Help function to generate an IAM policy
    getPolicy(principalId: any, effect: string, resource: any) {
        const authResponse:any = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        const  policyDocument: any = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        const statementOne: any = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": true
    };
    return authResponse;
    }
}