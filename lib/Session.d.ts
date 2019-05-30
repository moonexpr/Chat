import { connection } from 'websocket';
export declare class Session {
    client: connection;
    token: string;
    constructor(client: connection);
    private getOriginalSecret;
    isValidToken(tk: string): boolean;
    getToken: () => string;
    getClient: () => connection;
}
