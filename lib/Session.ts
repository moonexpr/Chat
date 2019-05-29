import {connection} from 'websocket';
import config from '../index';
import * as token from 'token';

export class Session {
	client: connection;
	token: string;

	constructor(client: connection) {
		this.client = client;
		// this.token = token.generate(`${client.remoteAddress} ${config.token_hash}`);
		this.token = token.generate('test', {
			'secret': config.token_hash,
		});
	}

	public isValidToken(tk: string): boolean {
		return token.verify(tk, this.token);
	}

	public getToken = (): string => this.token;
	public getClient = (): connection => this.client;
}