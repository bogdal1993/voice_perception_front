import { IChart, IFilterBase } from "../models";

interface IObjectKeys {
    [key: string]: IChartTypeConfig;
}

interface IChartTypeConfig {
    types: string[]
    basefilter: any
}

export const apiUrl: string = process.env.NODE_ENV === 'production' ? '/api/' : 'http://127.0.0.1/api/';
export const apillmUrl: string = process.env.NODE_ENV === 'production' ? '/llm/' : 'http://127.0.0.1:8005/llm/';

export const chartData: IChart<any>[] = [
    {type:"PieComponent",span:[1,1],datasource:"emotions",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"TagComponent",span:[1,1],datasource:"emotions",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"LineComponent",span:[1,2],datasource:"emotions",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"PieComponent",span:[1,1],datasource:"tagscount",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"TagComponent",span:[1,1],datasource:"tagscount",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"LineComponent",span:[1,2],datasource:"tagscount",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"PieComponent",span:[1,1],datasource:"tagspercent",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"TagComponent",span:[1,1],datasource:"tagspercent",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"LineComponent",span:[1,2],datasource:"tagspercent",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"LineComponent",span:[1,2],datasource:"counts",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}},
    {type:"TagComponent",span:[1,1],datasource:"topwords",chartname:"",filter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1", limit:200}}    
]

/*export const chartTypes: IObjectKeys = {
    emotions:{
        types:["PieComponent","TagComponent","LineComponent"],
        basefilter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1"}
    },
    topwords:{
        types:["TagComponent"],
        basefilter:{startDate: new Date().toISOString(),endDate: new Date().toISOString(),caller: "%",callee: "%",spk:"1", limit:100}
    }
}*/