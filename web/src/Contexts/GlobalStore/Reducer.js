const initialState = {
    loading: false,
    lastUpdated: null,
};

const reducer = (state, action) => {
    return {...state, [action.type]: action.payload};
};

export {initialState, reducer};
