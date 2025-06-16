export interface AuthState{
    authToken : string | null
}

export const initialAuthState: AuthState = {
    authToken: sessionStorage.getItem('authToken') ? JSON.parse(sessionStorage.getItem('authToken')!) : null,
}