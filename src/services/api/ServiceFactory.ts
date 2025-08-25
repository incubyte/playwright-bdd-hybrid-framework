import { AuthApiClient } from './AuthApiClient';
import { log } from '../../utils/logger';

export class ServiceFactory {
    private static instance: ServiceFactory;
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
}
