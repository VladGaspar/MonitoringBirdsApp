import {createSlice} from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
import StorageUtils from "../utils/storage";


const userData = StorageUtils.getLocalStorageValue('auth');
const decodedToken = userData?.token ? jwtDecode(userData.token).auth : null;
const role = (decodedToken) ?? null;

const userState = {
    username: userData?.username,
    role: role,
    token: userData?.token,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: userState,
    reducers: {
        login: (state, action) => {
            const authorizationHeader = action.payload.headers.authorization;
            const token = authorizationHeader.slice(7, authorizationHeader.length);
            const data = action.payload.data;
            const role = jwtDecode(token).auth;
            state.username = data.username;
            state.token = token;
            state.firstName = data.firstName;
            state.lastName = data.lastName;
            state.role = role;
            StorageUtils.setLocalStorageValue('auth', {
                ...data,
                token: token,
                role: role,
            });
        },
        logout: state => {
            state.username = undefined;
            state.token = undefined;
            state.email = undefined;
            state.firstName = undefined;
            state.lastName = undefined;
            state.imageLink = undefined;
            state.role = undefined;
            StorageUtils.removeLocalStorageValue('auth');
        },
        updateUserData: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.imageLink = action.payload.imageLink;
            StorageUtils.setLocalStorageValue('auth', {...state, ...action.payload});
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice;
