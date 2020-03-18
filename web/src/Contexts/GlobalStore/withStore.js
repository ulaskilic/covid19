import React, {useContext} from "react";
import {Context} from "./Provider";
import {restClient} from "../../Utils/client";

const withStore = WrappedComponent => {
    return props => {
        const [store, setStore] = useContext(Context);

        const queryParam = (q = {}) => {
            return Object.keys(q).length ? `?${Object.keys(q).map(k => `${k}=${q[k]}`).join('&')}` : ''
        };

        const request = async (method, url) => {
            setStore({type: 'loading', payload: true});
            const response = await restClient[method.toLowerCase()](url);
            setStore({type: 'loading', payload: false});
            return response;
        };

        const api = {
            details: async (query = {}) => request('get', `covid${queryParam(query)}`),
            detailsTimeSeries: async (query = {}) => request('get', `covid/series${queryParam(query)}`),
        };

        return (
            <WrappedComponent {...props} context={{store, setStore}} api={api}>
                {props.children}
            </WrappedComponent>
        )
    }
};

export default withStore;
