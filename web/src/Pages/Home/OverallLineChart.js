import React, {useEffect, useState} from "react";
import {api} from "../../Services/Api";
import Chart from "react-apexcharts";
import {Events} from "../../Services/Events";

const OverallLineChart = props => {
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
        const {data, ok} = await api.totalTimeSeries();
        if (ok) {
            const xAxisLabels = [...new Set(data.map(i => i.lastUpdated))];
            const series = {
                affected: {
                    name: 'Affected',
                    data: []
                },
                activeCase: {
                    name: 'Active Case',
                    data: [],
                },
                recovered: {
                    name: 'Recovered',
                    data: []
                },
                death: {
                    name: 'Death',
                    data: []
                }
            };
            for (const item of data) {
                series.affected.data.push(item.totalConfirmed);
                series.activeCase.data.push(item.totalConfirmed - (item.totalDeath + item.totalRecovered));
                series.recovered.data.push(item.totalRecovered);
                series.death.data.push(item.totalDeath);
            }
            setData({
                data: [series.affected, series.activeCase, series.recovered, series.death],
                options: {
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: xAxisLabels
                    },
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    // affected, active case, recovered, death
                    colors: ['#008ffb', '#feb019', '#00e396', '#ff4560'],
                    tooltip: {
                        x: {
                            format: 'yy/MM/dd'
                        },
                    }
                }
            });
        } else {
            setData({
                data: [],
                options: {}
            })
        }

        setLoading(false);
    };
    return (
        <div>
            {!loading && <Chart options={data.options} series={data.data} type='line' height={350}/>}
        </div>
    );
};

export default OverallLineChart;
