import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useMemo, useState} from 'react'
import * as birdSelector from "../store/selectors/birdSelector";
import {birdAction} from "../store/birdSlice";
import {birdsApi} from "../api/birdsApi";

export default function useLoadBirds() {
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState()
    const birdSlice = useSelector(birdSelector.getBirds)
    const dispatch = useDispatch()

    const preparedQuery = useMemo(() => {
        return {
            species: birdSlice.filter.species,
            observations: birdSlice.filter.observations,
            date: birdSlice.filter.date,
            year: birdSlice.filter.year ?? 2024,
            comparisonYear: birdSlice.filter.comparisonYear,
            periodType: birdSlice.filter.periodType
        }
    }, [birdSlice.filter])

    function fetchObservationData() {
        setIsLoading(true)
        birdsApi
            .getObservationData(preparedQuery)
            .then(response => {
                dispatch(birdAction.setData(response.data))
            })
            .catch(() => setHasError(true))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchObservationData()
    }, [JSON.stringify(preparedQuery)])

    return {birdSlice, hasError, isLoading}
}
