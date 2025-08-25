import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { LoginResponse } from '../models/ApiModels';
import { log } from '../../utils/logger';

export class AuthApiClient extends BaseApiClient {

    async loginDemo(): Promise<APIResponse> {
        const username = process.env.TEST_USERNAME || 'tomsmith';
        const password = process.env.TEST_PASSWORD || 'SuperSecretPassword!';

        log.info(`Attempting login with username: ${username}`);
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
                    log.info('Login successful, JSON response received');
                    log.debug('Login response data', json);

                    return {
                        authenticated: true,
                        message: 'Login successful',
                        token: json.token || 'mock-token',
                        user: json.user || { username: process.env.TEST_USERNAME }
                    };
                } catch (e) {
                    const text = await response.text();
                    log.warn('Login successful, but could not parse JSON response', e);
                    log.debug('Raw response text:', text);

                    return {
                        authenticated: true,
                        message: 'Login successful',
                        token: 'mock-token'
                    };
                }
            } else {
                log.warn(`Login failed with status ${response.status()}`);
                return {
                    authenticated: false,
                    message: `Login failed with status ${response.status()}`
                };
            }
        } catch (error) {
            log.error('Error processing login response', error);
            return {
                authenticated: false,
                message: `Error processing login response: ${error}`
            };
        }
    }
}
