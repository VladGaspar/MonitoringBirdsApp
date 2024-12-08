import React from 'react';
import {NavLink} from 'react-router-dom';
import {appRoutes} from '../routes/appRoutes';


const NavBarElement = ({children, to, onClick}) => {
    return (
        <li className="mx-4 text-white font-semibold hover:text-stone-200">
            <NavLink onClick={onClick} to={to || appRoutes.home}>
                {children}
            </NavLink>
        </li>
    );
};

export default NavBarElement;
