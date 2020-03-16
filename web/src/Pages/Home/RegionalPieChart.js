import React, {useEffect, useState} from "react";
import Chart from 'react-apexcharts';
import {api} from "../../Services/Api";
import {Events} from "../../Services/Events";

const RegionalPieChart = props => {
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
        const {data, ok} = await api.totalRegion();
        if (ok) {
            const labels = [];
            const datas = [];
            for (const item of data) {
                labels.push(item.region);
                datas.push(item.totalConfirmed - (item.totalDeath + item.totalRecovered));
            }
            setData({
                options: {
                    labels: labels,
                    responsive: [
                        {
                            breakpoint: 412,
                            options: {
                                legend: {
                                    position: 'top'
                                }
                            }
                        }
                    ]
                },
                data: datas,
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
            {!loading && <Chart options={data.options} series={data.data} type='pie'/>}
        </div>
    )
};

export default RegionalPieChart
