import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { LoginResponse } from '../models/ApiModels';

export class AuthApiClient extends BaseApiClient {

    async loginDemo(): Promise<APIResponse> {
        const username = process.env.TEST_USERNAME || 'tomsmith';
        const password = process.env.TEST_PASSWORD || 'SuperSecretPassword!';

        return await this.post('/authenticate', {
            form: {
                username,
                password
            }
        });
    }

    async handleLoginResponse(response: APIResponse): Promise<LoginResponse> {
        try {
            if (response.ok()) {
                try {
                    const json = await response.json();
                    return {
                        authenticated: true,
                        message: 'Login successful',
                        token: json.token || 'mock-token',
                        user: json.user || { username: process.env.TEST_USERNAME }
                    };
                } catch (e) {
                    const text = await response.text();
                    return {
                        authenticated: true,
                        message: 'Login successful',
                        token: 'mock-token'
                    };
                }
            } else {
                return {
                    authenticated: false,
                    message: `Login failed with status ${response.status()}`
                };
            }
        } catch (error) {
            return {
                authenticated: false,
                message: `Error processing login response: ${error}`
            };
        }
    }
}
