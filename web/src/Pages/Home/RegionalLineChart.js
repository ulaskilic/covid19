import React, {useEffect, useState} from "react";
import {api} from "../../Services/Api";
import Chart from "react-apexcharts";
import * as _ from 'lodash';
import {Events} from "../../Services/Events";

const RegionalLineChart = props => {
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
        const {data, ok} = await api.totalRegionTimeSeries();
        if (ok) {
            const xAxisLabels = [...new Set(data.map(i => i.lastUpdated))];
            const groupedByRegions = _.groupBy(data, 'region');
            const regions = Object.keys(groupedByRegions);
            const finalData = [];
            for (const region of regions) {
                finalData.push({
                    name: region,
                    data: _.map(groupedByRegions[region], i => i.totalConfirmed - (i.totalDeath + i.totalRecovered))
                });
            }
            setData({
                data: finalData,
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
                    tooltip: {
                        x: {
                            format: 'yy/MM/dd'
                        },
                    }
                }
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
            {!loading && <Chart options={data.options} series={data.data} type='line' height={350}/>}
        </div>
    );
};

export default RegionalLineChart;
