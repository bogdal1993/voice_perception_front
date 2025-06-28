import { useState, useEffect } from 'react';
import axios from 'axios';
import Wavesurfer from 'react-wavesurfer.js';
import { apiUrl } from '../data/chartsData';
import ApiKeyModal from './ApiKeyModal';
import { OpenAI } from 'openai';

interface IFrase {
    text: string;
    result: Iword[];
    spk: number;
    emotion: string;
    emotion_audio: string;
}

interface Iword {
    start: number;
    end: number;
    conf: number;
    word: string;
}

interface Icall {
    callid: string;
    item: any;
}

interface Itag {
    tag: string;
    proba: number;
    spk: number;
}

function CallCardElement(call: Icall) {
    const [dataTable, setDataTable] = useState<IFrase[]>([]);
    const [loading, setLoading] = useState(false);
    const [summarization, setSummarization] = useState(false);
    const [transcriptText, setTranscriptText] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [tags, setTags] = useState<Itag[]>([]);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [position, setPosition] = useState(0);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(false);

    const getOpenAIClient = () => {
        const apiUrl = localStorage.getItem('apiUrl') || '';
        const apiKey = localStorage.getItem('apiKey') || '';

        return new OpenAI({
            baseURL: apiUrl,
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
    };

    const get_summarization = async (dataTable: IFrase[], questionText: string, setTranscriptText: React.Dispatch<React.SetStateAction<string>>) => {
        const client = getOpenAIClient();
        const modelId = localStorage.getItem('modelId') || ''; // Убедитесь, что modelId задан
        const prompt = localStorage.getItem('prompt') || 'Верни краткую сводку по диалогу на русском языке';
    
        let full_text = ''
        dataTable.map((Frase) => (full_text += (Frase.spk ? 'Собеседник 1' : 'Собеседник 2') + ': ' + Frase.text + '\n'));
        if (questionText === '') {
            full_text += prompt + ':\n';
        } else {
            full_text += 'Ответь на вопрос по диалогу - \n';
            full_text += questionText + ':\n';
        }
    
        try {
            const stream = await client.chat.completions.create({
                model: modelId,
                messages: [
                    { role: "user", content: full_text }
                ],
                temperature: 0.5,
                max_tokens: 2048,
                top_p: 0.7,
                stream: true,
            });
            setSummarization(!summarization);
            let out = "";
            for await (const chunk of stream) {
                if (chunk.choices && chunk.choices.length > 0) {
                    const newContent = chunk.choices[0].delta.content;
                    out += newContent;
                    console.log(newContent);
                    setTranscriptText(out); // Обновляем состояние по мере получения новых данных
                }
            }
        } catch (err) {
            console.error("Ошибка при запросе к OpenAI API:", err);
            setTranscriptText("Ошибка при запросе к OpenAI API");
        }
    };

    const generateDialogText = (dataTable: IFrase[]): string => {
        let dialogText = '';
        dataTable.forEach((Frase) => {
            dialogText += `${Frase.spk ? call.item['calle'] : call.item['caller']}: ${Frase.text}\n`;
        });
        return dialogText;
    };

    const handleDownloadDialog = () => {
        const dialogText = generateDialogText(dataTable);
        const blob = new Blob([dialogText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dialog_${call.callid}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGetSummarization = async () => {
        if ((!summarization && transcriptText.length === 0) || questionText !== '') {
            if (dataTable.length < 5) {
                setTranscriptText("Слишком короткий диалог");
                setSummarization(!summarization);
                return;
            }

            setLoading(true);
            setTranscriptText("Loading...");

            try {
                await get_summarization(dataTable, questionText, setTranscriptText);
            } catch (err) {
                setTranscriptText("Функция суммаризации недоступна");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        setSummarization(!summarization);
    };

    const handleSaveApiKey = (apiUrl: string, apiKey: string, modelId: string, prompt: string) => {
        localStorage.setItem('apiUrl', apiUrl);
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('modelId', modelId);
        localStorage.setItem('prompt', prompt);
        setShowApiKeyModal(false);
    };

    const handleOpenSettings = () => {
        setShowApiKeyModal(true);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return [
            h,
            m > 9 ? m : (h ? '0' + m : m || '0'),
            s > 9 ? s : '0' + s
        ].filter(Boolean).join(':');
    };

    const deduplicateEntries = (entries: Itag[]): Itag[] => {
        const uniqueEntriesMap: Map<string, Itag> = new Map();

        for (const entry of entries) {
            const key = `${entry.spk}-${entry.tag}`;
            if (!uniqueEntriesMap.has(key) || uniqueEntriesMap.get(key)!.proba < entry.proba) {
                uniqueEntriesMap.set(key, entry);
            }
        }

        const uniqueEntriesArray: Itag[] = Array.from(uniqueEntriesMap.values());
        return uniqueEntriesArray;
    };

    useEffect(() => {
        const apiUrlStored = localStorage.getItem('apiUrl');
        const apiKeyStored = localStorage.getItem('apiKey');
        const modelIdStored = localStorage.getItem('modelId');
        const promptStored = localStorage.getItem('prompt');

        if (!apiUrlStored || !apiKeyStored || !modelIdStored || !promptStored) {
            setShowApiKeyModal(true);
        }

        axios.get(`${apiUrl}backend/call_transcript/${call.callid}`)
            .then(res => { setDataTable(res.data); setTranscriptText(""); setSummarization(false); setQuestionText(''); })
            .catch(err => console.log(err));

        axios.get(`${apiUrl}backend/call_tags/${call.callid}`)
            .then(res => { setTags(deduplicateEntries(res.data)); })
            .catch(err => console.log(err));
    }, [call.callid]);

    const handlePositionChange = (position: number) => { };
    const onReadyHandler = () => { setPlaying(true); }

    return (
        <div className='callcard'>
            {showApiKeyModal && <ApiKeyModal onSave={handleSaveApiKey} />}
            <div className='Card'>
                <div className='player'>
                    <button className='playBTN' onClick={() => setPlaying(prev => !prev)}>{playing ? '||' : '▶'}</button>
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
                            <div className="metas" key={key}>
                                <span className='keys'>{key}</span>
                                <span className='values'>{subject} {call.item.name}</span>
                            </div>
                        ))}
                        </div>
                        <div className='tagContainer'>Тэги
                            <div className='callTags'>
                                {tags.map(Tag => <span key={`${Tag.spk}-${Tag.tag}`} style={{ opacity: Tag.proba }} className={"tag" + Tag.spk} title={(100 * Tag.proba).toFixed(2).toString() + " %"}>{Tag.tag}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='transcription'>
                    <div className="summarization-controls">
                        <button className='sumBTN' onClick={handleGetSummarization}>
                            {summarization ? 'Transcription' : 'Summarization'}
                        </button>
                        <button className='settingsBTN' onClick={handleOpenSettings}>
                            ⚙️
                        </button>
                        <button className='downloadBTN' onClick={handleDownloadDialog}>
                            📥
                        </button>
                    </div>
                    <input 
                        className='dialogquestion' 
                        type="text" 
                        placeholder='Вопрос по диалогу' 
                        value={questionText} 
                        onChange={(e) => { setQuestionText(e.target.value); }} 
                    />
                    <div className='transcriptionNames'>
                        <span>{call.item['caller']}</span>
                        <span>{call.item['calle']}</span>
                    </div>
                    <div className='transcriptionText'>
                        {summarization ? transcriptText :
                            dataTable.map(Frase => (
                                <div
                                    key={Frase.result[0].start}
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
    );
}

export default CallCardElement;
