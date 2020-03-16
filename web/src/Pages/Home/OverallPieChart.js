import React, {useEffect, useState} from "react";
import Chart from 'react-apexcharts';
import {api} from "../../Services/Api";
import {Events} from "../../Services/Events";

const OverallPieChart = props => {
    const [loading, setLoading] = useState(true);
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
        if(ok) {
            const response = data[0];
            setData({
                options: {
                    labels: ['Active Case', 'Death', 'Recovered'],
                    colors: ['#008ffb', '#ff4560', '#00e396'],
                },
                data: [
                    (response.totalConfirmed - (response.totalDeath + response.totalRecovered)),
                    response.totalDeath,
                    response.totalRecovered],
            });
        } else {
            setData({
                options: {},
                data: []
            })
        }
        setLoading(false);
    };
    return (
        <div>
            {!loading && <Chart options={data.options} series={data.data} type='pie' height={250}/>}
        </div>
    )
}

export default OverallPieChart
