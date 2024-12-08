import React, {useEffect, useRef, useState} from 'react';
import {FaUserCircle} from 'react-icons/fa';
import {useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {logoBirdLife, logoSor} from '../images/images'
import useAuth from '../hooks/useAuth';
import {appRoutes} from '../routes/appRoutes';
import * as authSelectors from "../store/selectors/authSelectors";
import {cn} from '../utils/tailwindMerge';
import {UnauthenticatedLinks} from "./UnauthenticatedLinks";
import NavBarElement from "./NavBarElement";

export const NavBar = () => {
    const {logoutUser, isTokenValid} = useAuth();
    const authSlice = useSelector(authSelectors.getUserData);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const avatarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current === null || avatarRef.current === null) {
                return;
            }
            if (!popupRef.current.contains(event.target) && !avatarRef.current.contains(event.target)) {
                setIsPopupOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="flex h-[4rem] bg-cyan-600 drop-shadow-lg shadow-lg relative z-10">
            <div className="flex w-full justify-between items-center px-2 my-auto">
                <div className="flex">
                    <NavLink to={appRoutes.home}>
                        <div className="flex flex-row bg-white rounded-md p-1">
                            <img src={logoSor} alt="PitechPlus" className="mx-3 w-12"/>
                            <img src={logoBirdLife} alt="PitechPlus" className="mx-3 w-12"/>
                        </div>
                    </NavLink>
                </div>
                <ul className="flex flex-wrap place-items-end items-center">
                    {<NavBarElement to={appRoutes.observations}><p>OBSERVAȚII</p></NavBarElement>}
                    {<NavBarElement to={appRoutes.leaderboard}><p>CLASAMENT</p></NavBarElement>}
                    {isTokenValid() && <NavBarElement to={appRoutes.compare}><p>COMPARAȚIE</p></NavBarElement>}
                </ul>
                <div className={'flex relative'}>
                    {isTokenValid() && (
                        <div
                            ref={avatarRef}
                            className={'flex flex-row items-center cursor-pointer  p-1 rounded-xl'}
                            onClick={() => setIsPopupOpen(!isPopupOpen)}
                        >
                            <div className={'text-white font-bold mx-2 hover:text-stone-200'}>{authSlice.username}</div>
                            {authSlice?.imageLink ? (
                                <img src={authSlice?.imageLink} alt={'Profile pic'}
                                     className={'w-12 h-12 rounded-[50%]'}/>
                            ) : (
                                <FaUserCircle size={45} color={'white'}/>
                            )}
                        </div>
                    )}
                    {!isTokenValid() && <UnauthenticatedLinks/>}
                    {isTokenValid() && (
                        <div
                            ref={popupRef}
                            className={cn(
                                'w-56 absolute z-10 -top-2 -left-12 bg-slate-100 shadow-inner drop-shadow-lg my-4 divide-y divide-slate-400 rounded-xl cursor-default',
                                {hidden: !isPopupOpen}
                            )}
                        >
                            <div className="px-4 py-3">
                                <p className="text-sm font-semibold text-slate-900">
                                    {authSlice?.firstName} {authSlice?.lastName}
                                </p>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <NavLink
                                        onClick={() => setIsPopupOpen(false)}
                                        to={appRoutes.account.accountInfo}
                                        className="block font-bold px-4 py-2 text-sm text-slate-800 hover:bg-primary hover:text-white"
                                    >
                                        {'Contul Meu'}
                                    </NavLink>
                                </li>
                                <li>
                                    <div
                                        onClick={() => {
                                            setIsPopupOpen(!isPopupOpen);
                                            logoutUser();
                                        }}
                                        className="block font-bold px-4 py-2 text-sm text-slate-800 hover:bg-primary hover:text-white"
                                    >
                                        {'Log Out'}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
