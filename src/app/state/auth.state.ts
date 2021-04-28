import { User } from "../usermodel/user.model";

export interface AuthState{
    user: User | null;
}

export const initialState : AuthState = {
    user: null
};    