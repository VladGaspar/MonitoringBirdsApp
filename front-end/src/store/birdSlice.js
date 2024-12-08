import {filteredSlice} from './filteredSlice'


const initialState = {
    page: {
        page: 0,
        size: 10,
    },
    sort: {},
    filter: {},
    data: [],
    modal: {},
}

export const birdSlice = filteredSlice({
    name: 'bird-slice',
    initialState,
})

export const birdAction = birdSlice.actions
