import { Children, createContext, useState } from "react";
import { chartData } from "../data/chartsData";
import { IChart } from "../models";

const LS_CHART_KEY = 'LS_CHART_KEY';

interface IChartContext {
    data: IChart<any>[]
    add: (chart:IChart<any>) => void
    deleteChart: (chart:IChart<any>) => void
    update: (chartold:IChart<any>,chartnew:IChart<any>) => void
}

export const ChartContext = createContext<IChartContext>({
    data: [],
    add: (chart:IChart<any>) => {console.log(chart)},
    deleteChart: (chart:IChart<any>) => {console.log(chart)},
    update: (chartold:IChart<any>,chartnew:IChart<any>) => {console.log(chartold);console.log(chartnew)}
})
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

export const ChartState = ({ children }: {children: React.ReactNode})  => {

    const [data, setChart] = useState<IChart<any>[]>(JSON.parse(localStorage.getItem(LS_CHART_KEY) ?? JSON.stringify([])))
    const add = (chart:IChart<any>) => {
        let clone: IChart<any>[] = structuredClone(data);
        clone.push(chart);
        updateChartData(clone);
    }
    const deleteChart = (chart:IChart<any>) => {
        let clone: IChart<any>[] = data.filter(f => !deepEqual(f,chart));
        updateChartData(clone);
    }
    const update = (chartold:IChart<any>,chartnew:IChart<any>) => {
        console.log(chartold);
        console.log(chartnew);
        let clone: IChart<any>[] = structuredClone(data);
        let objIndex = clone.findIndex((obj => deepEqual(obj,chartold)));
        console.log(objIndex);
        clone[objIndex] = chartnew;
        updateChartData(clone);
    }

    const updateChartData = (chartnew:IChart<any>[]) => {
        console.log(chartnew);
        localStorage.setItem(LS_CHART_KEY, JSON.stringify(chartnew));
        setChart(chartnew);
    }

    return (
        <ChartContext.Provider  value={{ data, add, deleteChart, update }}>
            { children }
        </ChartContext.Provider>
    )
}