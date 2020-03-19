const initialState = {
    appBar: 'Covid19 Stats',
    loading: false,
    lastUpdated: null,
};

const reducer = (state, action) => {
    return {...state, [action.type]: action.payload};
};

export {initialState, reducer};
