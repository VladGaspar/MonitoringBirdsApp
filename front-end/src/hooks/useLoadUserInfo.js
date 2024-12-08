import {useEffect, useState} from 'react';
import {userApi} from "../api/userApi";

export function useLoadUserInfo() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [userData, setUserData] = useState();

    const fetchUserInfo = () => {
        setIsLoading(true);
        userApi.getUserInfo()
            .then(response => setUserData(response.data))
            .catch(() => setHasError(true))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return {userData, hasError, isLoading};
}
