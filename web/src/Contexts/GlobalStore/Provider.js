import React, {createContext, useReducer} from "react";

const Context = createContext({});

const Provider = ({reducer, initialState, children}) => {
    return (
        <Context.Provider value={useReducer(reducer, initialState)}>
            {children}
        </Context.Provider>
    )
};


export {Context, Provider}
