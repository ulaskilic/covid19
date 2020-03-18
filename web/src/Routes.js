import React from "react";
import {Switch, Route} from 'react-router-dom';
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/Error/NotFound";
import Country from "./Pages/Home/Country";

const Routes = props => {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/country/:countryName" component={Country}/>
            {/*<Route path="/region/:regionName" component={NotFound}/>*/}
        </Switch>
    )
};

export default Routes;
