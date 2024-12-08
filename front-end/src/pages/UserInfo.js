import React from 'react';
import {useLoadUserInfo} from "../hooks/useLoadUserInfo";
import {Loader} from "../components/Loader";
import UserInfo from "../components/UserInfo";

const AccountInfo = () => {
    const {userData, ...loaderProps} = useLoadUserInfo();

    return (
        <div className="w-full h-full">
            <Loader message={'listing.common.error'} {...loaderProps}>
                <UserInfo userData={userData}/>
            </Loader>
        </div>
    );
};

export default AccountInfo;
