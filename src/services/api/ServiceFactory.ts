import { AuthApiClient } from './AuthApiClient';

export class ServiceFactory {
    private static instance: ServiceFactory;
    private serviceInstances: Map<string, any> = new Map();

    private constructor() {}

    public static getInstance(): ServiceFactory {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory();
        }
        return ServiceFactory.instance;
    }

    public async getAuthApiClient(): Promise<AuthApiClient> {
        if (!this.serviceInstances.has('authApiClient')) {
            const client = new AuthApiClient();
            await client.init();
            this.serviceInstances.set('authApiClient', client);
        }
        return this.serviceInstances.get('authApiClient');
    }
}
