import axiosInstance from '../utils/axiosSetup';
import {apiPaths} from './apiPaths';


export const birdsApi = {
    getSpecies: (page, query) => axiosInstance.get(apiPaths.species, {
        params: {page, query},
    }),
    getObservationData: (params) => {
        return axiosInstance.get(apiPaths.observationData, {
            params,
            paramsSerializer: {
                indexes: null
            }
        });
    },
};
