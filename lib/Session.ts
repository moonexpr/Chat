import {connection} from 'websocket';
import * as config from "./Configuration";


const TokenGenerator = require('token-generator')({
	salt: config.default.token_salt,
	timestampMap: config.default.token_map,
});

export class Session {
	client: connection;
	token: string;

	constructor(client: connection) {
		this.client = client;
		this.token = TokenGenerator.generate();
	}

	public isValidToken(token: string): boolean {
		// return TokenGenerator.isValid(token);
		return token === this.getToken();
	}

	public getToken = (): string => this.token;
	public getClient = (): connection => this.client;
}