import { APIRequestContext, APIResponse, request } from '@playwright/test';

export class BaseApiClient {
    protected apiContext!: APIRequestContext;
    protected baseURL: string;

    constructor(baseURL?: string) {
        this.baseURL = baseURL || process.env.API_BASE_URL || 'https://the-internet.herokuapp.com';
    }

    async init() {
        this.apiContext = await request.newContext({
            baseURL: this.baseURL,
        });
        return this;
    }

    async get(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            await this.init();
        }
        return await this.apiContext.get(url, options);
    }

    async post(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            await this.init();
        }
        return await this.apiContext.post(url, options);
    }

    async put(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            await this.init();
        }
        return await this.apiContext.put(url, options);
    }

    async delete(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            await this.init();
        }
        return await this.apiContext.delete(url, options);
    }

    async handleResponse(response: APIResponse): Promise<any> {
        if (!response.ok()) {
            throw new Error(`API request failed with status ${response.status()}: ${await response.text()}`);
        }

        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    }

    async dispose() {
        if (this.apiContext) {
            await this.apiContext.dispose();
        }
    }
}
