import React, {useEffect, useState} from "react";
import {Grid, Paper, makeStyles, Typography} from "@material-ui/core";
import {api} from "../../Services/Api";
import {Events} from "../../Services/Events";
import withStore from "../../Contexts/GlobalStore/withStore";

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    }
}));
const HeaderCards = props => {
    const classes = useStyles();
    const {store, setStore} = props.context;
    const [data, setData] = useState({});

    useEffect(() => {
        fetchData();
        const eventId = Events.on('refresh', () => {
            fetchData();
        });
        return () => {
            Events.remove(eventId);
        }
    }, []);

    const fetchData = async () => {
      const {data, ok} = await api.total();
      if(ok && data[0]) {
          setData(data[0]);
          setStore({type: 'lastUpdated', payload: data[0].lastUpdated})
      }
    };

    return (
        <Grid container spacing={2}>
            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#008ffb', color: 'white'}}>
                    <Typography variant="h6">Affected: {data.totalConfirmed}</Typography>
                </Paper>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#feb019', color: 'white'}}>
                    <Typography variant="h6">Active Case: {data.totalConfirmed - (data.totalRecovered + data.totalDeath)}</Typography>
                </Paper>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#00e396', color: 'white'}}>
                    <Typography variant="h6">Recovered: {data.totalRecovered}</Typography>
                </Paper>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#ff4560', color: 'white'}}>
                    <Typography variant="h6">Death: {data.totalDeath}</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default withStore(HeaderCards);
