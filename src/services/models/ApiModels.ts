export interface LoginResponse {
    token?: string;
    message?: string;
    authenticated?: boolean;
    user?: {
        id?: number;
        username?: string;
        email?: string;
    };
}
