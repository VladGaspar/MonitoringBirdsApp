import React from 'react';
import {Route, Routes} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {RootPage} from '../layout/RootPage';
import {appRoutes} from './appRoutes';
import BirdListingPage from "../pages/BirdPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import ComparePage from "../pages/ComparePage";
import {PrivateRoutes} from "./PrivateRoutes";

import {ErrorDisplay} from "../pages/ErrorDisplay";
import Register from "../pages/Register";
import Login from "../pages/Login";
import UserInfo from "../pages/UserInfo";


const ROLE_VALUES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}


export const AppRoutes = () => {
    const {isTokenValid} = useAuth();

    const user = ROLE_VALUES.USER;


    return (
        <Routes>
            <Route path={appRoutes.home} element={<RootPage/>}>
                <Route index element={<BirdListingPage/>}/>
                {!isTokenValid() && <Route path={appRoutes.account.login} element={<Login/>}/>}
                {!isTokenValid() && <Route path={appRoutes.account.register} element={<Register/>}/>}
                <Route path={appRoutes.observations} element={<BirdListingPage/>}/>
                <Route path={appRoutes.leaderboard} element={<LeaderboardPage/>}/>

                <Route element={<PrivateRoutes neededRoles={[user]}/>}>
                    <Route path={appRoutes.compare} element={<ComparePage/>}/>
                    <Route path={appRoutes.account.accountInfo} element={<UserInfo/>}/>
                </Route>

                <Route path={appRoutes.error} element={<ErrorDisplay/>}/>
                <Route path={appRoutes.notFound} element={<ErrorDisplay/>}/>
            </Route>
        </Routes>
    );
};
