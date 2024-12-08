import {jwtDecode} from 'jwt-decode';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../store/authSlice';
import * as authSelectors from "../store/selectors/authSelectors";

export default function useAuth() {
    const dispatch = useDispatch();
    const currentRoles = useSelector(authSelectors.getRole);
    const username = useSelector(authSelectors.getUsername);
    const userToken = useSelector(authSelectors.getToken);

    const hasRole = (role) => {
        return currentRoles === role;
    };

    const hasAnyRole = (roles) => {
        if (!Array.isArray(currentRoles) || !Array.isArray(roles)) {
            return false;
        }
        const intersection = currentRoles.filter(currentRole => roles.includes(currentRole));
        return intersection.length > 0;
    };

    const isTokenValid = () => {
        if (!userToken) {
            return undefined;
        }
        const decodedToken = jwtDecode(userToken);
        const currentTime = new Date();
        return decodedToken.exp * 1000 >= currentTime.getTime();
    };

    const logoutUser = () => {
        dispatch(authActions.logout());
    };

    const getUsername = () => {
        if (username === null || !isTokenValid()) {
            return undefined;
        }

        return username;
    };

    return {
        getUsername,
        isTokenValid,
        logoutUser,
        hasRole,
    };
}
