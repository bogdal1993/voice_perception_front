import {useState, useEffect } from 'react';
import axios from 'axios';
import Wavesurfer from 'react-wavesurfer.js';
import { apiUrl } from '../data/chartsData';

interface IFrase {
    text:string
    result:Iword[]
    spk:number
    emotion:string
}

interface Iword {
    start:number
    end:number
    conf:number
    word:string
}

interface Icall{
    callid:string
    item: any
}

function CallCardElement(call: Icall){

    const [dataTable, setDataTable] = useState<IFrase[]>([]);

    useEffect(() => {
        axios.get(`${apiUrl}backend/call_transcript/${call.callid}`)
          .then(res => setDataTable(res.data))
          .catch(err => console.log(err))
      }, [call.callid]);

      function formatTime(seconds: number) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return [
          h,
          m > 9 ? m : (h ? '0' + m : m || '0'),
          s > 9 ? s : '0' + s
        ].filter(Boolean).join(':');
      }


      const [position, setPosition] = useState(0);
      const [muted, setMuted] = useState(false);
      const [playing, setPlaying] = useState(false);
    
      const handlePositionChange = (position:number) => { };
      const onReadyHandler = () => {setPlaying(true);}

    return (
        <div className='callcard'>
            <div className='Card'>
                <div className='player'>
                    <button className='playBTN' onClick={() => setPlaying(prev => !prev)}>{playing ? '||':'▶'}</button>
                    <Wavesurfer
                        src={`${apiUrl}file/file/${call.callid}`}
                        position={position}
                        onPositionChange={handlePositionChange}
                        onReady={onReadyHandler}
                        onFinish={() => setPlaying(false)}
                        playing={playing}
                        muted={muted}
                        splitChannels={true}
                        />
                    <div className='callMeta'>{Object.entries(call.item).map(([key, subject], i) => (
                                <div className="metas">
                                    <span className='keys'>{key}</span>
                                    <span className='values'>{subject} {call.item.name}</span>
                                    </div>
                        ))}
                    </div>
                </div>
                <div className='transcription'>
                    <div className='transcriptionNames'>
                            <span>{call.item['caller']}</span>
                            <span>{call.item['calle']}</span>
                        </div>
                    <div className='transcriptionText'>
                        
                        {dataTable.map(Frase =>  <div className={"text " + (Frase.spk ? 'right ':'left ') + Frase.emotion} style={{ 
                            top:(Frase.result[0].start)+'em', 
                            bottom:(Frase.result[0].end)+'em'
                            }}> {formatTime(Frase.result[0].start)}: {Frase.text}</div>)}
                    </div>
                </div>            

            </div>
        </div>
    )
}

export default CallCardElement