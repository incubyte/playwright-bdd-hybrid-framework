import { AuthApiClient } from './AuthApiClient';
import { log } from '../../utils/logger';

export class ServiceFactory {
    private static instance: ServiceFactory | undefined;
    private serviceInstances: Map<string, any> = new Map();

    private constructor() {
        log.debug('ServiceFactory instance created');
    }

    public static getInstance(): ServiceFactory {
        if (!ServiceFactory.instance) {
            log.debug('Creating new ServiceFactory instance');
            ServiceFactory.instance = new ServiceFactory();
        }
        log.debug('Returning existing ServiceFactory instance');
        return ServiceFactory.instance;
    }

    public async getAuthApiClient(): Promise<AuthApiClient> {
        if (!this.serviceInstances.has('authApiClient')) {
            log.debug('Creating new AuthApiClient instance');
            const client = new AuthApiClient();
            await client.init();
            this.serviceInstances.set('authApiClient', client);
            log.info('AuthApiClient instance created and initialized');
        } else {
            log.debug('Returning existing AuthApiClient instance');
        }
        return this.serviceInstances.get('authApiClient');
    }

    public async dispose(): Promise<void> {
        try {
            log.debug('Disposing ServiceFactory resources');

            for (const [key, client] of this.serviceInstances.entries()) {
                log.debug(`Disposing client: ${key}`);
                if (client && typeof client.close === 'function') {
                    await client.close();
                }
            }

            this.serviceInstances.clear();
            ServiceFactory.instance = undefined;

            log.debug('ServiceFactory resources disposed successfully');
        } catch (error) {
            log.error('Error disposing ServiceFactory resources:', error);
            throw error;
        }
    }
}
