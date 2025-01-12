import {useState, useEffect } from 'react';
import axios from 'axios';
import Wavesurfer from 'react-wavesurfer.js';
import { apiUrl, apillmUrl } from '../data/chartsData';
import { json } from 'stream/consumers';

interface IFrase {
    text:string
    result:Iword[]
    spk:number
    emotion:string
    emotion_audio:string
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

interface Itag{
    tag:string
    proba: number
    spk: number
}


function CallCardElement(call: Icall){

    const [dataTable, setDataTable] = useState<IFrase[]>([]);
    const [loading, setLoading] = useState(false);
    const [summarization, setSummarization] = useState(false);
    const [transcriptText, setTranscriptText] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [tags, setTags] = useState<Itag[]>([]);


    function deduplicateEntries(entries: Itag[]): Itag[] {
        const uniqueEntriesMap: Map<string, Itag> = new Map();
      
        for (const entry of entries) {
          const key = `${entry.spk}-${entry.tag}`;
          if (!uniqueEntriesMap.has(key) || uniqueEntriesMap.get(key)!.proba < entry.proba) {
            uniqueEntriesMap.set(key, entry);
          }
        }
      
        const uniqueEntriesArray: Itag[] = Array.from(uniqueEntriesMap.values());
        return uniqueEntriesArray;
    }


    useEffect(() => {
        axios.get(`${apiUrl}backend/call_transcript/${call.callid}`)
          .then(res => {setDataTable(res.data);setTranscriptText(""); setSummarization(false); setQuestionText('');})
          .catch(err => console.log(err))

        axios.get(`${apiUrl}backend/call_tags/${call.callid}`)
          .then(res => {setTags(deduplicateEntries(res.data));})
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


      /*function get_summarization() {
        console.log(dataTable);
        var full_text = "";
        dataTable.map(Frase => full_text+="spk"+Frase.spk+": "+Frase.text+"\n")
        full_text += "\n\nСуммаризация диалога\n"
        console.log(full_text);

        const data = {
            text: full_text,
          };

        axios.post(`http://127.0.0.1:8000/predict`,data)
          .then(res => console.log(res))
          .catch(err => console.log(err))
      }*/

      function get_summarization() {
        if ((!summarization && transcriptText.length==0) || questionText!=''){
            if (dataTable.length<5){
                setTranscriptText("Слишком короткий диалог");
                setSummarization(!summarization);
                return
            }
            
            setLoading(true); // Устанавливаем состояние loading в true перед запросом
            setTranscriptText("Loading...");
            console.log(dataTable);
            //var full_text = '<s>Контекст: ' + JSON.stringify( call.item ) + '\nРазговор:\n';
            var full_text = '';
            full_text += questionText + '\n'
            console.log(dataTable.length);
            //dataTable.map((Frase) => (full_text += ( Frase.spk ? call.item['caller']  : call.item['calle'])+ ': ' + Frase.text + '\n'));
            dataTable.map((Frase) => (full_text += ( Frase.spk ? 'Speaker 1'  : 'Speaker 2')+ ': ' + Frase.text + '\n'));
            //dataTable.map((Frase) => (full_text += ' - ' + Frase.text + '\n'));
            if (questionText==''){
                full_text += 'Суммаризация диалога:\n';
            } else {
                full_text += 'Ответ на вопрос:\n';
            }
            console.log(full_text);
        
            const data = {
            text: full_text,
            };
        
            axios
            .post(`${apillmUrl}predictsum`, data)
            .then((res) => {
                console.log(res);
                setLoading(false); // Устанавливаем состояние loading в false после получения ответа от сервера
                setTranscriptText(res.data.message); // Устанавливаем полученный текст в состояние transcriptText
            })
            .catch((err) => {
                setTranscriptText("Функция суммаризации недоступна");
                console.log(err);});
        }
        setSummarization(!summarization);
        
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
                    <div className='callMetaContainer'>

                        <div className='callMeta'>Мета информация{Object.entries(call.item).map(([key, subject], i) => (
                                    <div className="metas">
                                        <span className='keys'>{key}</span>
                                        <span className='values'>{subject} {call.item.name}</span>
                                        </div>
                            ))}
                        </div>
                        <div className='tagContainer'>Тэги
                            <div className='callTags'>
                                {tags.map(Tag =>  <span style={{opacity: Tag.proba}} className={"tag" + Tag.spk} title={(100*Tag.proba).toFixed(2).toString()+" %"}>{Tag.tag}</span> )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='transcription'>
                <button className='sumBTN' onClick={() => {get_summarization();}}>{summarization ? 'Transcription' : 'Summarization'}</button>
                <input disabled className='dialogquestion' type="text" placeholder='Вопрос по диалогу' value={questionText} onChange={(e) => {setQuestionText(e.target.value);}}/>
                    <div className='transcriptionNames'>
                            <span>{call.item['calle']}</span>
                            <span>{call.item['caller']}</span>
                        </div>
                        <div className='transcriptionText'>
                            {summarization ? transcriptText : 
                                dataTable.map(Frase => (
                                    <div 
                                        className={"text " + (Frase.spk ? 'right ' : 'left ') + Frase.emotion + " " + Frase.emotion_audio + "_audio"} 
                                        style={{ 
                                            top: (Frase.result[0].start / 3) + 'em', 
                                            bottom: (Frase.result[0].end / 3) + 'em'
                                        }}
                                        data-emotion={"По Тексту - " + Frase.emotion + " По Аудио - " + Frase.emotion_audio}
                                    >
                                        {formatTime(Frase.result[0].start)}: {Frase.text}
                                    </div>
                                ))
                            }
                        </div>
                </div>            
            </div>
        </div>
    )
}

export default CallCardElement