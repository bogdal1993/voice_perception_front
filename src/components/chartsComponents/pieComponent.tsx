import {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { IChart, IFilterBase } from '../../models';
import { IoIosMenu, IoMdClose, IoMdRefresh } from 'react-icons/io';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ChartContext } from '../../context/chartsContext';
import { apiUrl } from '../../data/chartsData';

/*interface IPieData{
    labels: string[]
    datasets: any[]
}*/

interface IEmotionsDS{
    label: string
    value: number
}

interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string[];
}

interface IPieData {
    labels: string[];
    datasets: Dataset[];
}

interface IObjectKeys {
    [key: string]: string | number;
  }

//const emocolors: IObjectKeys = {'negative':'#fa5e66', 'neutral':'#5ea7fa', 'positive':'#5efa8d', 'skip':'#a8a8a8', 'speech':'#eeeeee'};

// Функция для генерации случайных пастельных цветов
const generatePastelColor = () => {
    const min = 150; // Минимальное значение для пастельных оттенков
    const max = 255; // Максимальное значение для пастельных оттенков
    const r = Math.floor(Math.random() * (max - min + 1) + min);
    const g = Math.floor(Math.random() * (max - min + 1) + min);
    const b = Math.floor(Math.random() * (max - min + 1) + min);
    return `rgb(${r},${g},${b})`;
  };
  
  // Создание массива из 100 случайных пастельных цветов
  const pastelColorsArray: string[] = Array.from({ length: 100 }, generatePastelColor);
  

export function PieComponent(chartData: IChart<IFilterBase>){

    const chartctx = useContext(ChartContext)
    
    const [data, setData] = useState<IPieData>({
        labels: [],
        datasets: [
          {
            label: "Число фраз",
            data: [],
            backgroundColor: []
          }
        ]
      });
    const [filter,setFilter] = useState(chartData.filter);

    const [startDate, setStartDate] = useState<string>(chartData.filter.startDate);
    const [endDate, setEndDate] = useState<string>(chartData.filter.endDate);
    //const [limit, setLimit] = useState<number>(chartData.filter.limit);
    const [caller, setCaller] = useState<string>(chartData.filter.caller);
    const [callee, setCallee] = useState<string>(chartData.filter.callee);
    const [spk, setSpk] = useState<string>(chartData.filter.spk);
    const [chartname, setName] = useState<string>(chartData.chartname);


    function updateFilter(){
        var newFilter: IFilterBase = {
            startDate: startDate,
            endDate: endDate,
            //limit:limit,
            caller:caller,
            callee:callee,
            spk:spk
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
    const [hide, setHide] = useState<boolean>(false);
    const ChartContainerClassnames = ['ChartContainer',chartData.type,mainActiveClassname]

    const FormContainerClassnames = ['FiltersForm',"Width100"]

    const updateCallback = (() => {
        setBlur(true);
        axios.post(`${apiUrl}backend/stats/${chartData.datasource}`,filter)
        .then((res) => {
            let updatedValue = {
                labels:res.data.map((e:IEmotionsDS) => e.label),
                datasets:[
                    {
                        label: "Число фраз",
                        data: res.data.map((e:IEmotionsDS) => e.value),
                        backgroundColor: pastelColorsArray//res.data.map((e:IEmotionsDS) => randomRGB())
                        //['rgba(200, 200, 200, 0.75)'] //res.data.map((e:IEmotionsDS) => emocolors[e.label])
                    }
                ]
            };
            setData(oldData => ({
                 ...oldData,
                 ...updatedValue
               }));
            setBlur(false);
        })
        .catch()
    })

    useEffect(() => {
        updateCallback();
    }, [filter]);

    return(
        <div className="chart">
            <div className="chartHeader">
                <span>{chartname.slice(0,30)}{chartname.length > 30 && '...'}</span>
                <div className='chartAction'>
                <IoIosMenu onClick={() => {console.log(chartData.filter); setHide(prev => !prev)}}></IoIosMenu>
                <IoMdRefresh onClick={() => {updateFilter()}}></IoMdRefresh>
                <IoMdClose onClick={() => chartctx.deleteChart(chartData)}></IoMdClose>
                </div>
            </div>
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
                    <span>caller</span>
                    <input type="text" value={caller} onChange={(e) => {setCaller(e.target.value);}}/>
                    <span>callee</span>
                    <input type="text" value={callee} onChange={(e) => {setCallee(e.target.value);}}/>
                    <span>spk</span>
                    <input type="text" value={spk} onChange={(e) => {setSpk(e.target.value);}}/>
                </div>
            }
            { !hide && <div className={ChartContainerClassnames.join(' ')}>
                    <Pie data={data} />
                </div>
            }
        </div>
    )
}