import {useContext,useState} from 'react';
import { NavigationContext } from '../context/navContext';
import { ChartComponent } from '../components/ChartComponent';
import { ChartContext, ChartState } from '../context/chartsContext';
import { IoIosAdd } from 'react-icons/io';
import { chartData } from '../data/chartsData';
import { IChart } from '../models';



export function ChartContent(){
    const Inav = useContext(NavigationContext)
    const mainActiveClassname = Inav.navigationOpen ? 'active' : ''
    const mainClassnames = ['main',mainActiveClassname]
    const [hide, setHide] = useState<boolean>(false);
    const chartctx = useContext(ChartContext)

    const [chartname, setName] = useState<string>("");
    const [charttype, setCharttype] = useState<string>("-1");
    const FormContainerClassnames = ['FiltersForm',"Width100"]

    function addChart(i:string){
        console.log(i);
        if (i=="-1"){
            return;
        } else {
            let newChart: IChart<any> = chartData[Number(i)];
            newChart.chartname = chartname;
            console.log(newChart);
            chartctx.add(newChart);
            setHide(false);
        }
    }

    return(
        <div className={mainClassnames.join(' ')}>
            
                <div className='chartsGrid'>
                    {chartctx.data.map((chart, i) =>  <ChartComponent key = {i} type={chart.type} datasource={chart.datasource} filter={chart.filter} chartname={chart.chartname} span={chart.span}/>)}
                    <div className="chart">
                        { !hide &&
                        <div className='addChart' onClick={() => setHide(prev => !prev)}>
                            <IoIosAdd/>
                        </div>
                        }
                        { hide && <div className={FormContainerClassnames.join(' ')}>
                                <button onClick={() => addChart(charttype)}>ADD</button>
                            <span>Chart name</span>
                            <input type="text" value={chartname} onChange={(e) => {setName(e.target.value);}}/>
                            <span>Select type</span>
                            <select name="charttype" id="charttype" onChange={(e) => setCharttype(e.target.value)}>
                                <option value="-1"></option>
                                {chartData.map((chart, i) => <option value={i}>{chart.datasource} {chart.type}</option>)}
                            </select>
                        </div>
                    }
                    </div>
                </div>
        </div>
    )
}