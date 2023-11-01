import {useState, useEffect,useContext,KeyboardEventHandler} from 'react';
import { NavigationContext } from '../context/navContext';
import Table from '../components/Table';
import axios from 'axios';
import CallCardElement from '../components/CallCard';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { apiUrl } from '../data/chartsData';
import CreatableSelect from 'react-select'

/*interface ICallsFilter {
    limit: number
    offset: number
    startDate: Date | null
    endDate: Date | null
}*/

interface Option {
    readonly label: string;
    readonly value: string;
  }
  
  const createOption = (label: string) => ({
    label,
    value: label,
  });

export function TextSearch(){

    const Inav = useContext(NavigationContext)

    const mainActiveClassname = Inav.navigationOpen ? 'active' : ''
    const mainClassnames = ['main',mainActiveClassname]
    const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - ( 3600 * 1000 * 24 * 365)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);
    const [caller, setCaller] = useState<string>("%");
    const [callee, setCallee] = useState<string>("%");

    const [words1, setWords1] = useState<readonly Option[]>([]);
    const [inputWords1, setInputWords1] = useState('');

    const [words2, setWords2] = useState<readonly Option[]>([]);
    const [inputWords2, setInputWords2] = useState('');
    


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
    //if (offset<0){setOffset(0)}
    let callsFilter = {
        "limit":limit,
        "offset":offset,
        "startDate":startDate,
        "endDate":endDate,
        "caller":caller,
        "callee":callee,
        "words1":words1,
        "words2":words2,
    }
    console.log(callsFilter);
    axios.post(`${apiUrl}backend/textsearch/`,callsFilter)
      .then(res => {
        if (res.data.length > 0){
            setDataTable(res.data);
        } else {
            if (offset-limit>=0) setOffset(offset-limit);
        }
    })
      .catch(err => console.log(err))
  }

  /*useEffect(() => {
    console.log(startDate);
    console.log(endDate);
    updateData();
  }, [startDate,endDate]);*/

  const components = {
    DropdownIndicator: null,
  };

  const column = [
    { heading: 'call_start_ts', value: 'call_start_ts' },
    { heading: 'call_end_ts', value: 'call_end_ts' },
    { heading: 'caller', value: 'caller' },
    { heading: 'calle', value: 'calle' },
    { heading: 'duration', value: 'duration' },
    { heading: 'direction', value: 'direction' },
    { heading: 'text', value: 'text' },
  ]

  //let callid: string = "72f80a33-0162-42a4-b90b-357c04142c03"
  const [callid, setCallid] = useState("72f80a33-0162-42a4-b90b-357c04142c03");
  const [item, setItem] = useState([]);
  const setCall = (call:string, item: any) => {setCallid(call); setItem(item);console.log(item); return false;}

  

  const handleKeyDown1: KeyboardEventHandler = (event) => {
    if (!inputWords1) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setWords1((prev) => [...prev, createOption(inputWords1)]);
        setInputWords1('');
        event.preventDefault();
    }
  };

  const handleKeyDown2: KeyboardEventHandler = (event) => {
    if (!inputWords2) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setWords2((prev) => [...prev, createOption(inputWords2)]);
        setInputWords2('');
        event.preventDefault();
    }
  };

    return (
        <div className={mainClassnames.join(' ')}>
            <CallCardElement callid={callid} item={item}/>
            <div className="details">
                <div className='FiltersForm'>
                    <button onClick={() => {updateData();setOffset(0);}}>UPDATE</button>
                    <span>StartDate</span>
                    <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd.MM.yyyy HH:mm"
                        />
                    <span>endDate</span>
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
                    <span>Caller text</span>
                    <CreatableSelect
                        components={components}
                        inputValue={inputWords1}
                        isClearable
                        isMulti
                        menuIsOpen={false}
                        onChange={(newValue) => setWords1(newValue)}
                        onInputChange={(newValue) => setInputWords1(newValue)}
                        onKeyDown={handleKeyDown1}
                        placeholder="Type something and press enter..."
                        value={words1}
                    />

                    <span>Callee text</span>
                    <CreatableSelect
                        components={components}
                        inputValue={inputWords2}
                        isClearable
                        isMulti
                        menuIsOpen={false}
                        onChange={(newValue) => setWords2(newValue)}
                        onInputChange={(newValue) => setInputWords2(newValue)}
                        onKeyDown={handleKeyDown2}
                        placeholder="Type something and press enter..."
                        value={words2}
                    />

                    
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