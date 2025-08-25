import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { log } from '../../utils/logger';

export class BaseApiClient {
    protected apiContext!: APIRequestContext;
    protected baseURL: string;

    constructor(baseURL?: string) {
        this.baseURL = baseURL || process.env.API_BASE_URL || 'https://the-internet.herokuapp.com';
        log.debug(`BaseApiClient initialized with baseURL: ${this.baseURL}`);
    }

    async init() {
        log.debug('Initializing API context');
        this.apiContext = await request.newContext({
            baseURL: this.baseURL,
        });
        log.info(`API context initialized for ${this.baseURL}`);
        return this;
    }

    async get(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            log.debug('API context not initialized for GET request, initializing now');
            await this.init();
        }
        log.debug(`GET request to ${url}`, options);
        const response = await this.apiContext.get(url, options);
        log.debug(`GET response from ${url}: status ${response.status()}`);
        return response;
    }

    async post(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            log.debug('API context not initialized for POST request, initializing now');
            await this.init();
        }
        log.debug(`POST request to ${url}`, options);
        const response = await this.apiContext.post(url, options);
        log.debug(`POST response from ${url}: status ${response.status()}`);
        return response;
    }

    async put(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            log.debug('API context not initialized for PUT request, initializing now');
            await this.init();
        }
        log.debug(`PUT request to ${url}`, options);
        const response = await this.apiContext.put(url, options);
        log.debug(`PUT response from ${url}: status ${response.status()}`);
        return response;
    }

    async delete(url: string, options?: any): Promise<APIResponse> {
        if (!this.apiContext) {
            log.debug('API context not initialized for DELETE request, initializing now');
            await this.init();
        }
        log.debug(`DELETE request to ${url}`, options);
        const response = await this.apiContext.delete(url, options);
        log.debug(`DELETE response from ${url}: status ${response.status()}`);
        return response;
    }

    async handleResponse(response: APIResponse): Promise<any> {
        if (!response.ok()) {
            const errorMessage = `API request failed with status ${response.status()}: ${await response.text()}`;
            log.error(errorMessage);
            throw new Error(errorMessage);
        }

        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
            const jsonData = await response.json();
            log.debug('Parsed JSON response', jsonData);
            return jsonData;
        }

        const textData = await response.text();
        log.debug('Parsed text response', textData);
        return textData;
    }

    async dispose() {
        if (this.apiContext) {
            log.debug('Disposing API context');
            await this.apiContext.dispose();
            log.info('API context disposed');
        }
    }
}
