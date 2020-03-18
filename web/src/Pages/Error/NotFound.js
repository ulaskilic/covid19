import {Card, CardHeader, Container, Grid} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    margin: {
        marginTop: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    },
}));

const NotFound = props => {
    const classes = useStyles();
    const params = useParams();
    return (
        <Container style={{marginTop: '24px'}}>
            <Grid container justify="center">
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Card>
                        <CardHeader title="Page not found"/>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
};

export default NotFound;
