import { createAction, props } from "@ngrx/store";

export interface AuthPayload { // Define a specific type for the payload
  authToken: string;
}

export const loginSucess = createAction('[Auth] Login Success', props<AuthPayload>());
export const logout = createAction('[Auth] Logout');