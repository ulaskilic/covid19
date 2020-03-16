import {Avatar, Card, CardContent, CardHeader} from "@material-ui/core";
import Moment from "react-moment";
import Typography from "@material-ui/core/Typography";
import React from "react";

const UserCard = props => {
    const {user} = props;
    return (
        <Card style={{minWidth: 275}}>
            <CardHeader title={user.userName}
                        avatar={<Avatar src={user.profilePhoto}/>}
                        subheader={<Moment fromNow>{user.lastActivity}</Moment>}
            />
            <CardContent>
                <Typography variant="body2" component="p" noWrap>Mood: {user.mood}</Typography>
                <Typography variant="body2" component="p" noWrap>Listening: {user.listening}</Typography>
            </CardContent>
        </Card>
    )
};

export default UserCard;
