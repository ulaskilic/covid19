import React, {useEffect} from "react";
import withStore from "../Contexts/GlobalStore/withStore";
import {Backdrop, CircularProgress} from '@material-ui/core'
import {useHistory} from 'react-router-dom';
const Initiator = props => {
    const {store, setStore} = props.context;
    const history = useHistory();
    useEffect(() => {
        init()
    }, []);

    useEffect(() => {
        window.gtag('config', 'UA-160830716-1',{'page_path': history.location.pathname})
    }, [history.location.pathname]);

    const init = async () => {
    };

    return (
        <Backdrop open={store.loading} style={{zIndex: 999}}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default withStore(Initiator)
