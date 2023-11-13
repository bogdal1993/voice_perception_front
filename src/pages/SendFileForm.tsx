import { useState, useContext } from 'react';
import axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import { NavigationContext } from '../context/navContext';
import "react-datepicker/dist/react-datepicker.css";
import { apiUrl } from '../data/chartsData'


const FileForm: React.FC = () => {

  const Inav = useContext(NavigationContext)

    const mainActiveClassname = Inav.navigationOpen ? 'active' : ''
    const mainClassnames = ['main',mainActiveClassname]

  const [callStartTs, setCallStartTs] = useState<Date>(new Date());
  const [callEndTs, setCallEndTs] = useState<Date>(new Date());
  const [caller, setCaller] = useState<string>("");
  const [calle, setCalle] = useState<string>("");
  const [direction, setDirection] = useState<string>("outbound");
  const [duration, setDuration] = useState<number>(0);
  const [saveFile, setSaveFile] = useState<boolean>(true);
  const [media, setMedia] = useState<File | null>(null);

  const handleDateChange = (value: Date, setter: React.Dispatch<React.SetStateAction<Date>>) => {
    setter(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("call_start_ts", callStartTs.toISOString().replace("T", " "));
    formData.append("call_end_ts", callEndTs.toISOString().replace("T", " "));
    formData.append("caller", caller);
    formData.append("calle", calle);
    formData.append("duration", duration.toString());
    formData.append("direction", direction);
    formData.append("save_file", saveFile.toString());

    if (media) {
      formData.append("media", media);
    }

    try {
      await axios.post(`${apiUrl}file/files/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={mainClassnames.join(' ')}>
    <form id="SendFileForm" onSubmit={handleSubmit}>
      <label>
        Call Start Timestamp:
        <ReactDatePicker showTimeSelect
                        timeFormat="HH:mm"
                        selected={callStartTs} 
                        dateFormat="dd.MM.yyyy HH:mm"
                        onChange={(value: Date) => handleDateChange(value, setCallStartTs)} />
      </label>
      <label>
        Call End Timestamp:
        <ReactDatePicker showTimeSelect
                        timeFormat="HH:mm"
                        selected={callEndTs} 
                        dateFormat="dd.MM.yyyy HH:mm"
                        onChange={(value: Date) => handleDateChange(value, setCallEndTs)} />
      </label>
      <label>
        Caller:
        <input type="text" value={caller} onChange={(e) => setCaller(e.target.value)} required />
      </label>
      <label>
        Callee:
        <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} required />
      </label>
      <label>
        Duration:
        <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} required />
      </label>
      <label>
        Save File:
        <input type="checkbox" checked={saveFile} onChange={(e) => setSaveFile(e.target.checked)} />
      </label>
      <label htmlFor='direction'>Direction
        <select name='direction' value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value='outbound'>Outbound</option>
          <option value='inbound'>Inbound</option>
        </select>
      </label>
      <label>
        Media:
        <input type="file" onChange={(e) => setMedia(e.target.files?.[0] || null)} required />
      </label>
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default FileForm;