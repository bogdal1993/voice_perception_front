import { createContext, useState, useEffect } from "react";
import { chartData } from "../data/chartsData";
import { IChart } from "../models";

const LS_CHART_KEY = 'LS_CHART_KEY';

interface IChartContext {
    data: IChart<any>[];
    add: (chart: IChart<any>) => void;
    deleteChart: (chart: IChart<any>) => void;
    update: (chartold: IChart<any>, chartnew: IChart<any>) => void;
    setAllCharts: (charts: IChart<any>[]) => void; // New function to update all charts
    remove: (chartname: string) => void;
    duplicate: (chartname: string) => void;
}

export const ChartContext = createContext<IChartContext>({
    data: [],
    add: (chart: IChart<any>) => { console.log(chart) },
    deleteChart: (chart: IChart<any>) => { console.log(chart) },
    update: (chartold: IChart<any>, chartnew: IChart<any>) => { console.log(chartold); console.log(chartnew) },
    setAllCharts: (charts: IChart<any>[]) => { console.log(charts) }, // Default implementation
    remove: (chartname: string) => { console.log(chartname) },
    duplicate: (chartname: string) => { console.log(chartname) }
});

const isObject = (obj: any) => obj === Object(obj);
function deepEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}

export const ChartState = ({ children }: { children: React.ReactNode }) => {

    const [data, setChart] = useState<IChart<any>[]>([]);

    // Load initial data from localStorage once
    useEffect(() => {
        try {
            const savedCharts = localStorage.getItem(LS_CHART_KEY);
            if (savedCharts) {
                setChart(JSON.parse(savedCharts));
            } else {
                // If no saved charts, initialize with default chartData
                // Ensure initial span values are set for default charts
                const initialChartsWithSpan = chartData.map((chart, index) => ({
                    ...chart,
                    span: {
                        x: (index % 4) * 2, // Simple initial x position
                        y: Math.floor(index / 4) * 2, // Simple initial y position
                        w: chart.span?.w || 2, // Default width
                        h: chart.span?.h || 2, // Default height
                        minW: 1,
                        maxW: 4,
                        minH: 1,
                        maxH: 5,
                    }
                }));
                setChart(initialChartsWithSpan);
            }
        } catch (error) {
            console.error("Failed to load charts from local storage", error);
            setChart(chartData.map((chart, index) => ({ // Fallback to default chartData on error
                ...chart,
                span: {
                    x: (index % 4) * 2,
                    y: Math.floor(index / 4) * 2,
                    w: chart.span?.w || 2,
                    h: chart.span?.h || 2,
                    minW: 1,
                    maxW: 4,
                    minH: 1,
                    maxH: 5,
                }
            })));
        }
    }, []);

    const add = (chart: IChart<any>) => {
        let clone: IChart<any>[] = structuredClone(data);
        // Assign initial span values for new charts
        const newChartWithSpan = {
            ...chart,
            span: {
                x: (clone.length % 4) * 2, // Simple initial x position
                y: Math.floor(clone.length / 4) * 2, // Simple initial y position
                w: chart.span?.w || 2, // Default width for grid item
                h: chart.span?.h || 2, // Default height for grid item
                minW: 1,
                maxW: 4,
                minH: 1,
                maxH: 5,
            }
        };
        clone.push(newChartWithSpan);
        updateChartData(clone);
    };

    const deleteChart = (chart: IChart<any>) => {
        let clone: IChart<any>[] = data.filter(f => !deepEqual(f, chart));
        updateChartData(clone);
    };

    const remove = (chartname: string) => {
        let clone: IChart<any>[] = data.filter(chart => chart.chartname !== chartname);
        updateChartData(clone);
    };

    const duplicate = (chartname: string) => {
        const chartToDuplicate = data.find(chart => chart.chartname === chartname);
        if (chartToDuplicate) {
            let uniqueChartname = `${chartToDuplicate.chartname}-copy`;
            let counter = 1;
            while (data.some(chart => chart.chartname === uniqueChartname)) {
                uniqueChartname = `${chartToDuplicate.chartname}-copy-${counter}`;
                counter++;
            }
            const duplicatedChart: IChart<any> = {
                ...chartToDuplicate,
                chartname: uniqueChartname,
                span: {
                    ...chartToDuplicate.span,
                    x: (chartToDuplicate.span?.x || 0) + 1, // Offset duplicated chart
                    y: (chartToDuplicate.span?.y || 0) + 1,
                }
            };
            add(duplicatedChart); // Use the existing add function to add the new chart
        }
    };

    const update = (chartold: IChart<any>, chartnew: IChart<any>) => {
        let clone: IChart<any>[] = structuredClone(data);
        let objIndex = clone.findIndex((obj => deepEqual(obj, chartold)));
        if (objIndex !== -1) {
            clone[objIndex] = chartnew;
            updateChartData(clone);
        }
    };

    const setAllCharts = (charts: IChart<any>[]) => {
        updateChartData(charts);
    };

    const updateChartData = (chartnew: IChart<any>[]) => {
        localStorage.setItem(LS_CHART_KEY, JSON.stringify(chartnew));
        setChart(chartnew);
    };

    return (
        <ChartContext.Provider value={{ data, add, deleteChart, update, setAllCharts, remove, duplicate }}>
            {children}
        </ChartContext.Provider>
    );
}
