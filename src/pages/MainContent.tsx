import {useState, useEffect,useContext} from 'react';
import { NavigationContext } from '../context/navContext';
import Table from '../components/Table';
import axios from 'axios';
import CallCardElement from '../components/CallCard';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { apiUrl } from '../data/chartsData';

/*interface ICallsFilter {
    limit: number
    offset: number
    startDate: Date | null
    endDate: Date | null
}*/

export function MainContent(){

    const Inav = useContext(NavigationContext)

    const mainActiveClassname = Inav.navigationOpen ? 'active' : ''
    const mainClassnames = ['main',mainActiveClassname]
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() - ( 3600 * 1000 * 24 * 365)));
    const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);
    const [caller, setCaller] = useState<string>("%");
    const [callee, setCallee] = useState<string>("%");
    


    const [dataTable, setDataTable] = useState([]);
    /*const [callsFilter, setcallsFilter] = useState<ICallsFilter>({
        "limit":limit,
        "offset":offset,
        "startDate":startDate,
        "endDate":endDate
    });*/
    
  useEffect(() => {
    updateData();
  }, [limit,offset]);

  function updateData(){
    let callsFilter = {
        "limit":limit,
        "offset":offset,
        "startDate":startDate,
        "endDate":endDate,
        "caller":caller,
        "callee":callee
    }
    console.log(callsFilter);
    axios.post(`${apiUrl}backend/calls/`,callsFilter)
      .then(res => {
        if (res.data.length > 0){
            setDataTable(res.data);
        } else {
            setOffset(offset-limit);
        }
    })
      .catch(err => console.log(err))
  }

  /*useEffect(() => {
    console.log(startDate);
    console.log(endDate);
    updateData();
  }, [startDate,endDate]);*/


  const column = [
    { heading: 'call_start_ts', value: 'call_start_ts' },
    { heading: 'call_end_ts', value: 'call_end_ts' },
    { heading: 'caller', value: 'caller' },
    { heading: 'calle', value: 'calle' },
    { heading: 'duration', value: 'duration' },
    { heading: 'direction', value: 'direction' },
  ]

  //let callid: string = "72f80a33-0162-42a4-b90b-357c04142c03"
  const [callid, setCallid] = useState("");
  const [item, setItem] = useState([]);
  const setCall = (call:string, item: any) => {setCallid(call); setItem(item);console.log(item); return false;}
  

    return (
        <div className={mainClassnames.join(' ')}>
            <CallCardElement callid={callid} item={item}/>
            <div className="details">
                <div className='FiltersForm'>
                    <button onClick={() => {updateData();setOffset(0);}}>UPDATE</button>
                <span>endDate</span>
                <ReactDatePicker
                     selected={startDate}
                     onChange={(date) => setStartDate(date)}
                     showTimeSelect
                     timeFormat="HH:mm"
                     timeIntervals={15}
                     dateFormat="dd.MM.yyyy HH:mm"
                    />
                <span>StartDate</span>
                <ReactDatePicker
                     selected={endDate}
                     onChange={(date) => setEndDate(date)}
                     showTimeSelect
                     timeFormat="HH:mm"
                     timeIntervals={15}
                     dateFormat="dd.MM.yyyy HH:mm"
                    />
                <span>caller</span>
                <input type="text" value={caller} onChange={(e) => {setCaller(e.target.value);}}/>
                <span>callee</span>
                <input type="text" value={callee} onChange={(e) => {setCallee(e.target.value);}}/>
                </div>
                <div className="recentOrders">
                    <div className="cardHeader">
                        <h2>Звонки: {dataTable.length}</h2>
                        <div className='paginator'>
                            <select name="paginatorlimit" id="paginatorlimit" onChange={e => {setLimit(Number(e.target.value)); setOffset(0);}}>
                                <option value="10">10</option>
                                <option value="100">100</option>
                                <option value="500">500</option>
                                <option value="1000">1000</option>
                            </select>
                            <button onClick={e => {offset >= limit ? setOffset(offset-limit) : setOffset(0);}}>&lt;</button>
                            <button onClick={e => {setOffset(offset+limit);}}>&gt;</button>
                            <span>Страница: {(offset/limit)+1}</span>
                        </div>
                    </div>
                <div className="table-container">
                <Table data={dataTable} column={column} setCallid={setCall}/>
                </div>
                </div>
            </div>
        </div>
    )
}