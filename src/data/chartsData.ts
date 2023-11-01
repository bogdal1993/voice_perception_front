import { IChart, IFilterBase } from "../models";

interface IObjectKeys {
    [key: string]: IChartTypeConfig;
}

interface IChartTypeConfig {
    types: string[]
    basefilter: any
}

export const apiUrl: string = process.env.NODE_ENV === 'production' ? '/api/' : 'http://192.168.0.127/api/';

export const chartData: IChart<any>[] = [
    {type:"PieComponent",span:[1,1],datasource:"emotions",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"TagComponent",span:[1,1],datasource:"emotions",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"LineComponent",span:[1,2],datasource:"emotions",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"LineComponent",span:[1,2],datasource:"counts",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"TagComponent",span:[1,1],datasource:"topwords",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1", limit:200}}    
]

export const chartTypes: IObjectKeys = {
    emotions:{
        types:["PieComponent","TagComponent","LineComponent"],
        basefilter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}
    },
    topwords:{
        types:["TagComponent"],
        basefilter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1", limit:100}
    }
}