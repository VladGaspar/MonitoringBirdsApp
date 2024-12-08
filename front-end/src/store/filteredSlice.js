import {createSlice} from '@reduxjs/toolkit';

export const filteredSlice = ({
                                  name = '',
                                  initialState,
                                  reducers,
                              }) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            setPageSize(state, action) {
                state.page.size = action.payload;
                state.page.page = 0;
            },

            setPageNumber(state, action) {
                state.page.page = action.payload;
            },


            setData(state, action) {
                state.data = action.payload;
            },

            setFilter(state, action) {
                state.filter = action.payload;
            },


            ...reducers,
        },
    });
};
