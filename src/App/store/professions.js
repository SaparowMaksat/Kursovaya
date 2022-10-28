import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/professionService";
import isOutDated from "../utils/isOutDated";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsReq: (state) => {
            state.isLoading = true;
        },
        professionsRec: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now();
            state.isLoading = false;
        },
        professionsReqFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: professionsReducer, actions } = professionsSlice;

const { professionsReq, professionsRec, professionsReqFiled } = actions;

export const loadProfessionsList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().professions;
    if (isOutDated(lastFetch)) {
        dispatch(professionsReq());
        try {
            const { content } = await professionService.get();
            dispatch(professionsRec(content));
        } catch (error) {
            dispatch(professionsReqFiled(error.message));
        }
    }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) =>
    state.professions.isLoading;
export const getProfessionsByIds = (professionsIds) => (state) => {
    if (state.professions.entities) {
        return state.professions.entities.find((p) => p._id === professionsIds);
    }
    return [];
};

export default professionsReducer;
