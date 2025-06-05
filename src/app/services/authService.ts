export interface IUserDetails {
    UserId: number;
    UserLCId: string;
}

export class AuthService {
    private static TOKEN_KEY = 'jwt_token';
    private static USER_KEY = 'user_details';

    static saveToken(token: string): void {
        localStorage.setItem(AuthService.TOKEN_KEY, token);
    }

    static saveUserDetails(user: IUserDetails): void {
        localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    }

    static getToken(): string | null {
        return localStorage.getItem(AuthService.TOKEN_KEY);
    }

    static getUserDetails(): IUserDetails | null {
        const userDetails = localStorage.getItem(AuthService.USER_KEY);
        return userDetails ? JSON.parse(userDetails) : null;
    }

    static getUserLcId(): string {
        const userDetails = localStorage.getItem(AuthService.USER_KEY);
        if (!userDetails) {
            return '';
        }
        return (JSON.parse(userDetails)).UserLCId;
    }

    static clear(): void {
        localStorage.removeItem(AuthService.TOKEN_KEY);
        localStorage.removeItem(AuthService.USER_KEY);
    }
}
