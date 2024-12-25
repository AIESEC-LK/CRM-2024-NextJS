class AuthService {
    private static TOKEN_KEY = 'jwt_token';
    private static USER_ID = 'user_details';
    private static USER_LC_ID = 'user_details';
  
    static saveToken(token: string): void {
      localStorage.setItem(AuthService.TOKEN_KEY, token);
    }
  
    static saveUserId(user: object): void {
      localStorage.setItem(AuthService.USER_ID, JSON.stringify(user));
    }

    static saveUserLCId(user: object): void {
        localStorage.setItem(AuthService.USER_LC_ID, JSON.stringify(user));
      }
  
    static getToken(): string | null {
      return localStorage.getItem(AuthService.TOKEN_KEY);
    }
  
    static getUserDetails(): object | null {
      const userDetails = localStorage.getItem(AuthService.USER_ID);
      return userDetails ? JSON.parse(userDetails) : null;
    }
  
    static clear(): void {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.USER_ID);
    }
  }
  
  export default AuthService;
  