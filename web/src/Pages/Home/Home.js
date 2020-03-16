import {Container, Grid, Fab, Icon, Card, CardContent, CardHeader, Button} from "@material-ui/core";
import UserCard from "../../Components/UserCard";
import React, {useEffect, useState} from "react";
import {api} from "../../Services/Api";
import {Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link'
import {makeStyles} from "@material-ui/core/styles";
import withStore from "../../Contexts/GlobalStore/withStore";
import OverallPieChart from "./OverallPieChart";
import RegionalPieChart from "./RegionalPieChart";
import OverallLineChart from "./OverallLineChart";
import RegionalLineChart from "./RegionalLineChart";
import CountryList from "./CountryList";
import HeaderCards from "./HeaderCards";
import {Events} from "../../Services/Events";


const useStyles = makeStyles(theme => ({
  shuffleButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
  }
}));
const Home = props => {
    const classes = useStyles();
    const {store, setStore} = props.context;
    useEffect(() => {

    }, []);

    const refreshData = () => {
        Events.emit('refresh');
    };

    return (
        <Container style={{marginTop: '24px'}}>
            <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <HeaderCards/>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Card>
                        <CardHeader title="Overall"/>
                        <CardContent>
                            <OverallPieChart/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <OverallLineChart/>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Card>
                        <CardHeader title="Regional Active Cases"/>
                        <CardContent>
                            <RegionalPieChart/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <RegionalLineChart/>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <CountryList/>
                </Grid>
            </Grid>

            <Fab color="primary" aria-label="add" className={classes.shuffleButton} onClick={refreshData}>
                <Icon>refresh</Icon>
            </Fab>
        </Container>
    )
};

export default withStore(Home);
