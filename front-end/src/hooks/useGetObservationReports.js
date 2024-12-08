import {useState} from 'react';
import {userApi} from "../api/userApi";

const useGetUsersReportDownloadLink = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [downloadLink, setDownloadLink] = useState();


    function loadDownloadLink() {
        setIsLoading(true);
        userApi
            .getReportDownload()
            .then(response => setDownloadLink(response.data))
            .catch(() => setHasError(true))
            .finally(() => setIsLoading(false));
    }

    return {downloadLink, hasError, isLoading, loadDownloadLink};
};

export default useGetUsersReportDownloadLink;
