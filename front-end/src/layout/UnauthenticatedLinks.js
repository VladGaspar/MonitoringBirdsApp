import React from 'react';
import {NavLink} from 'react-router-dom';
import {appRoutes} from '../routes/appRoutes';
import {cn} from '../utils/tailwindMerge';

export const UnauthenticatedLinks = () => {
    return (
        <div className={'flex'}>
            <NavLink
                end
                to={appRoutes.home}
                className={({isActive}) =>
                    cn(
                        'flex my-1 font-bold text-lg hover:text-gray-300 hover:bg-primary rounded-2xl px-2 mx-1 text-white',
                        isActive && 'bg-primary text-gray-300'
                    )
                }
            >
                <p>{'Acasă'}</p>
            </NavLink>
            <NavLink
                end
                to={appRoutes.account.login}
                className={({isActive}) =>
                    cn(
                        'flex my-1 font-bold text-lg hover:text-gray-300 hover:bg-primary rounded-2xl px-2 mx-1 text-white',
                        isActive && 'bg-primary text-gray-300'
                    )
                }
            >
                <p>{'Login'}</p>
            </NavLink>
            <NavLink
                end
                to={appRoutes.account.register}
                className={({isActive}) =>
                    cn(
                        'flex my-1 font-bold text-lg hover:text-gray-300 hover:bg-primary rounded-2xl px-2 mx-1 text-white',
                        isActive && 'bg-primary text-gray-300'
                    )
                }
            >
                <p>{'Îregistrează-te'}</p>
            </NavLink>
        </div>
    );
};
