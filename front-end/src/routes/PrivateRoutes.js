import {Navigate, Outlet} from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import {appRoutes} from "./appRoutes";

export const PrivateRoutes = ({neededRoles}) => {
    const {hasRole, isTokenValid} = useAuth();
    const isAuthenticated = isTokenValid();

    let hasNeededRole = true;

    if (neededRoles !== undefined) {
        hasNeededRole = neededRoles?.some(role => {
            return hasRole(role);
        });
    }

    if (isAuthenticated === undefined) {
        return <Navigate to={appRoutes.home}/>;
    }

    if (isAuthenticated && !hasNeededRole) {
        return <Navigate to={appRoutes.error}/>;
    }

    if (isAuthenticated && hasNeededRole) {
        return <Outlet/>;
    }

    return <Navigate to={appRoutes.account.expiredSession}/>;
};
