class AuthService {
    private static TOKEN_KEY = 'jwt_token';
    private static USER_KEY = 'user_details';
  
    static saveToken(token: string): void {
      localStorage.setItem(AuthService.TOKEN_KEY, token);
    }
  
    static saveUserDetails(user: object): void {
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    }
  
    static getToken(): string | null {
      return localStorage.getItem(AuthService.TOKEN_KEY);
    }
  
    static getUserDetails(): object | null {
      const userDetails = localStorage.getItem(AuthService.USER_KEY);
      return userDetails ? JSON.parse(userDetails) : null;
    }
  
    static clear(): void {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.USER_KEY);
    }
  }
  
  export default AuthService;
  