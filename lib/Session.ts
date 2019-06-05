import {connection} from 'websocket';
import * as config  from "./Configuration";

const TokenGenerator = require('token-generator')({
    salt: config.default.token_salt,
    timestampMap: config.default.token_map,
});

export const IdentityDefault:Identity = {
    firstname: '',
    middlename: '',
    lastname: '',
    fullname: '',
    email: '',
    netid: '',
};

/**
 * Server-side interface of a user's chat session/
 */
export class Session
{
    client: connection;
    identity: Identity | undefined;
    token: string;

    constructor(client: connection)
    {
        this.client = client;
        this.token = TokenGenerator.generate();
    }

    public isValidToken(token: string): boolean
    {
        // return TokenGenerator.isValid(token);
        return token === this.getToken();
    }

    public setIdentity(identity: Identity): void
    {
        this.identity = identity;
    }

    public getIdentity(): Identity | undefined
    {
        return this.identity;
    }

    public getToken = (): string => this.token;
    public getClient = (): connection => this.client;
}
