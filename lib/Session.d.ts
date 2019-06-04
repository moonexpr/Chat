import {connection} from 'websocket';

export declare class Session
{
    client: connection;
    token: string;
    getToken: () => string;
    getClient: () => connection;
    private getOriginalSecret;

    constructor(client: connection);

    isValidToken(tk: string): boolean;
}
