import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/authService";
import localStorageService from "../services/localStorageService";
import userService from "../services/userService";
import getRandomInt from "../utils/getRandomInt";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersReq: (state) => {
            state.isLoading = true;
        },
        usersRec: (state, action) => {
            state.entities = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        usersReqFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authReqSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authReqFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.isLoggedIn = false;
            state.auth = null;
            state.dataLoaded = false;
        },
        userUpdateSuccessed: (state, action) => {
            state.entities[
                state.entities.findIndex((u) => u._id === action.payload._id)
            ] = action.payload;
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const {
    usersReq,
    usersRec,
    usersReqFiled,
    authReqSuccess,
    authReqFailed,
    userCreated,
    userLoggedOut,
    userUpdateSuccessed
} = actions;

const authReq = createAction("users/authReq");
const userCreateReq = createAction("users/userCreateReq");
const createUserFailed = createAction("users/createUserFailed");
const userUpdateFailed = createAction("users/userUpdateFailed");
const userUpdateRequested = createAction("users/userUpdateRequested");

export const logIn =
    ({ payload, redirect }) =>
    async (dispatch) => {
        const { email, password } = payload;
        dispatch(authReq());
        try {
            const data = await authService.logIn({ email, password });
            dispatch(authReqSuccess({ userId: data.localId }));
            localStorageService.setTokens(data);
            history.push(redirect);
        } catch (error) {
            dispatch(authReqFailed(error.message));
        }
    };

export const signUp =
    ({ email, password, ...rest }) =>
    async (dispatch) => {
        dispatch(authReq());
        try {
            const data = await authService.register({ email, password });
            localStorageService.setTokens(data);
            dispatch(authReqSuccess({ userId: data.localId }));
            dispatch(
                createUsers({
                    _id: data.localId,
                    email,
                    rate: getRandomInt(1, 5),
                    completedMeetings: getRandomInt(0, 200),
                    image: `https://avatars.dicebear.com/api/avataaars/qweqasdas.svg/${(
                        Math.random() + 1
                    )
                        .toString(36)
                        .substring(7)}.svg`,
                    ...rest
                })
            );
        } catch (error) {
            dispatch(authReqFailed(error.message));
        }
    };
export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
    history.push("/");
};
function createUsers(payload) {
    return async function (dispatch) {
        dispatch(userCreateReq());
        try {
            const { content } = await userService.create(payload);
            dispatch(userCreated(content));
            history.push("/users");
        } catch (error) {
            dispatch(createUserFailed(error.message));
        }
    };
}

export const loadUsersList = () => async (dispatch, getState) => {
    dispatch(usersReq());
    try {
        const { content } = await userService.get();
        dispatch(usersRec(content));
    } catch (error) {
        dispatch(usersReqFiled(error.message));
    }
};

export const updateUser = (payload) => async (dispatch) => {
    dispatch(userUpdateRequested());
    try {
        const { content } = await userService.update(payload);
        dispatch(userUpdateSuccessed(content));
        history.push(`/users/${content._id}`);
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

export const getUsersList = () => (state) => state.users.entities;
export const getCurrentUserData = () => (state) => {
    return state.users.entities
        ? state.users.entities.find((u) => u._id === state.users.auth.userId)
        : null;
};
export const getUsersById = (userId) => (state) => {
    if (state.users.entities) {
        return state.users.entities.find((u) => u._id === userId);
    }
};

export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getCurrentUserId = () => (state) => state.users.auth.userId;

export default usersReducer;
