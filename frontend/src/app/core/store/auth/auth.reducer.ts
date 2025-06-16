import { createReducer, on } from "@ngrx/store";
import { initialAuthState } from "./auth.state";
import { loginSucess, logout } from "./auth.actions";

export const authReducer = createReducer(
    initialAuthState,
    on(loginSucess, (state, { authToken }) => ({...state, authToken: authToken ?? null})),
    on(logout, (state) => ({...state, authToken: null}))
);