import { TagCloud } from 'react-tagcloud';
import { IChart, IFilterBase,IFilterTagsCloud } from '../../models';
import {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import { IoIosMenu, IoMdClose, IoMdRefresh } from 'react-icons/io';
import { ChartContext } from '../../context/chartsContext';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { apiUrl } from '../../data/chartsData';

interface ITagData{
    value: string
    count: number
}

interface ITagServerData{
    label: string
    value: number
}

interface IMultiSelectOption{
    value: string
    label: string
}

//const parts: string[] = ["ГЛАГОЛ","СУЩЕСТВИТЕЛЬНОЕ","ПРИЛАГАТЕЛЬНОЕ","МЕСТОИМЕНИЕ","СОЮЗ","НАРЕЧИЕ","ПРЕДЛОГ","ЧАСТИЦА"];
const part: IMultiSelectOption[] = [
        { value: "ГЛАГОЛ", label: "ГЛАГОЛ" },
        { value: "СУЩЕСТВИТЕЛЬНОЕ", label: "СУЩЕСТВИТЕЛЬНОЕ" },
        { value: "ПРИЛАГАТЕЛЬНОЕ", label: "ПРИЛАГАТЕЛЬНОЕ" },
        { value: "МЕСТОИМЕНИЕ", label: "МЕСТОИМЕНИЕ" },
        { value: "СОЮЗ", label: "СОЮЗ" },
        { value: "НАРЕЧИЕ", label: "НАРЕЧИЕ" },
        { value: "ПРЕДЛОГ", label: "ПРЕДЛОГ" },
        { value: "ЧАСТИЦА", label: "ЧАСТИЦА" }
    ]


interface TagComponentProps extends IChart<IFilterTagsCloud> {
    hide: boolean;
    setHide: React.Dispatch<React.SetStateAction<boolean>>;
    refreshTrigger: number;
}

export function TagComponent({ hide, setHide, refreshTrigger, ...chartData }: TagComponentProps){

    const chartctx = useContext(ChartContext)
    
    const [data, setData] = useState<ITagData[]>([]);
    const [parts, setPArts] = useState<any>([]);
    const [filter,setFilter] = useState(chartData.filter);

    const [startDate, setStartDate] = useState<string>(chartData.filter.startDate);
    const [endDate, setEndDate] = useState<string>(chartData.filter.endDate);
    const [limit, setLimit] = useState<number>(chartData.filter.limit);
    const [caller, setCaller] = useState<string>(chartData.filter.caller);
    const [callee, setCallee] = useState<string>(chartData.filter.callee);
    const [spk, setSpk] = useState<string>(chartData.filter.spk);
    const [chartname, setName] = useState<string>(chartData.chartname);


    function updateFilter(){
        var newFilter: IFilterTagsCloud = {
            startDate: startDate,
            endDate: endDate,
            limit:limit,
            caller:caller,
            callee:callee,
            spk:spk,
            part: parts.map((e:ITagServerData) => {return e.value})
        }
        setFilter(newFilter);
        updateChartData(newFilter);
        //chartData.filter = filter;
    };

    function updateChartData(newFilter: IFilterBase){
        let newchartData: IChart<IFilterBase> = structuredClone(chartData);
        newchartData.filter = newFilter;
        newchartData.chartname = chartname;
        chartctx.update(chartData,newchartData);
    }

    const [blur, setBlur] = useState<boolean>(true);
    const mainActiveClassname = blur ? 'blur' : '';
    const ChartContainerClassnames = ['ChartContainer',chartData.type,mainActiveClassname]

    const FormContainerClassnames = ['FiltersForm',"Width100"]

    const updateCallback = (() => {
        setBlur(true);
        axios.post(`${apiUrl}backend/stats/${chartData.datasource}/`,chartData.filter)
        .then((res: any) => {
            let datas: ITagData[] = res.data.map((e:ITagServerData) => {return ({value:e.label,count:e.value})});
            setData(datas);
            setBlur(false);
        })
        .catch()
    });

    useEffect(() => {
        updateCallback();
    }, [filter, refreshTrigger]); // Add refreshTrigger to dependencies

    return(
        <div className="chart">
            { hide && <div className={FormContainerClassnames.join(' ')}>
                        <button onClick={() => {updateFilter(); setHide(prev => !prev);}}>UPDATE</button>
                    <span>Chart name</span>
                    <input type="text" value={chartname} onChange={(e) => {setName(e.target.value);}}/>
                    <span>startDate</span>
                    <ReactDatePicker
                        selected={new Date(startDate)}
                        onChange={(date:Date) => {setStartDate(date.toISOString());}}
                        dateFormat="dd.MM.yyyy"
                        />
                    <span>endDate</span>
                    <ReactDatePicker
                        selected={new Date(endDate)}
                        onChange={(date:Date) => {setEndDate(date.toISOString());}}
                        dateFormat="dd.MM.yyyy"
                        />
                    <span>Part</span>
                    <Select
                        name="filters"
                        placeholder="Filters"
                        value={parts}
                        options={part}
                        isMulti
                        onChange={(e) => {setPArts(e);}}
                        />
                    <span>caller</span>
                    <input type="text" value={caller} onChange={(e) => {setCaller(e.target.value);}}/>
                    <span>callee</span>
                    <input type="text" value={callee} onChange={(e) => {setCallee(e.target.value);}}/>
                    <span>spk</span>
                    <input type="text" value={spk} onChange={(e) => {setSpk(e.target.value);}}/>
                    <span>limit</span>
                    <input type="number" value={limit} onChange={(e) => {setLimit(Number(e.target.value));}}/>
                    
                </div>
            }
            { !hide && <div className={ChartContainerClassnames.join(' ')}>
                <TagCloud
                    minSize={12}
                    maxSize={50}
                    tags={data}
                    onClick = {(e:any) => console.log(e)}
                />
                </div>
            }
        </div>
    )
}
