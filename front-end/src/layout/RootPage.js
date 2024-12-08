import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {appRoutes} from '../routes/appRoutes';
import {NavBar} from './NavBar';


export const RootPage = () => {
    const navigate = useNavigate();
    const {isTokenValid, logoutUser} = useAuth();

    useEffect(() => {
        if (isTokenValid() === false) {
            logoutUser();

            navigate(appRoutes.account.login);
        }
    }, []);


    return (
        <div className={'flex h-full w-full'}>
            <div
                className={'ease-in-out duration-300 w-[calc(100%-16rem)] h-full grow'}
            >
                <NavBar/>
                <div className={'h-[calc(100vh-4rem)] w-full flex relative z-0'}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};
