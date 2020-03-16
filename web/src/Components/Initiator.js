import React, {useEffect} from "react";
import withStore from "../Contexts/GlobalStore/withStore";
import {Backdrop, CircularProgress} from '@material-ui/core'
import {api} from "../Services/Api";

const Initiator = props => {
    const {store, setStore} = props.context;

    useEffect(() => {
        init()
    }, []);

    const init = async () => {
    };

    return (
        <Backdrop open={store.loading} style={{zIndex: 999}}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default withStore(Initiator)
