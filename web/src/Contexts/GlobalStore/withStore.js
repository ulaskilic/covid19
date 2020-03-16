import React, {useContext} from "react";
import {Context} from "./Provider";

const withStore = WrappedComponent => {
    return props => {
        const [store, setStore] = useContext(Context);
        return (
            <WrappedComponent {...props} context={{store, setStore}}>
                {props.children}
            </WrappedComponent>
        )
    }
};

export default withStore;
