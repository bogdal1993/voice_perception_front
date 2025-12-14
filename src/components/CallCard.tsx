import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// Removed Wavesurfer import
import { apiUrl } from '../data/chartsData';
import ApiKeyModal from './ApiKeyModal';
import { OpenAI } from 'openai';
import { formatDateTime, formatDuration } from '../utils/dateUtils';
import ReactMarkdown from 'react-markdown';

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
    autoplay: boolean;
    setAutoplay: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [audioDuration, setAudioDuration] = useState(0);
    const [isThinking, setIsThinking] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const loadCallData = () => {
        // Only load data when user interacts with the call card
        axios.get(`${apiUrl}backend/call_transcript/${call.callid}`)
            .then(res => { setDataTable(res.data); setTranscriptText(""); setSummarization(false); setQuestionText(''); })
            .catch(err => console.log(err));

        axios.get(`${apiUrl}backend/call_tags/${call.callid}`)
            .then(res => { setTags(deduplicateEntries(res.data)); })
            .catch(err => console.log(err));
    };

    const handleClickPlay = () => {
        setPlaying(prev => !prev);
    };

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
    
        setIsThinking(true);
        setTranscriptText("Думаю...");
        
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
                    let newContent = chunk.choices[0].delta.content;
                    if (newContent) {
                        out += newContent;
                        // Remove content within  and
                        let filteredOut = out.replace(/<think>[\s\S]*?<\/think>/g, '');
                        console.log(newContent);
                        setTranscriptText(filteredOut); // Обновляем состояние по мере получения новых данных
                    }
                }
            }
            setIsThinking(false);
        } catch (err) {
            console.error("Ошибка при запросе к OpenAI API:", err);
            setTranscriptText("Ошибка при запросе к OpenAI API");
            setIsThinking(false);
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
        if (summarization && transcriptText && !transcriptText.startsWith("Ошибка при запросе к OpenAI API") && !transcriptText.startsWith("Функция суммаризации недоступна") && transcriptText !== "Слишком короткий диалог") {
            // Download summary with prompt if summarization is active and completed successfully
            const prompt = localStorage.getItem('prompt') || 'Верни краткую сводку по диалогу на русском языке';
            let fullContent = '';
            
            if (questionText) {
                // If there's a question, format as question-answer
                fullContent = `Промпт (вопрос по диалогу): ${questionText}\n\nОтвет:\n${transcriptText}`;
            } else {
                // If there's no question, use the default prompt
                fullContent = `Промпт: ${prompt}\n\nОтвет:\n${transcriptText}`;
            }
            
            const blob = new Blob([fullContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            // Generate UUID for summary file
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            a.href = url;
            a.download = `summary_${uuid}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // Download transcription if summarization is not active or failed
            const dialogText = generateDialogText(dataTable);
            const blob = new Blob([dialogText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dialog_${call.callid}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleDownloadAudio = async () => {
        try {
            const audioUrl = `${apiUrl}file/file/${call.callid}`;
            
            // Формируем имя файла: Caller + Calle + время звонка + направление звонка
            const caller = call.item.caller || 'unknown';
            const callee = call.item.calle || 'unknown';
            const callTime = call.item.call_start_ts ? formatDateTime(call.item.call_start_ts) : 'unknown';
            const direction = call.item.direction || 'unknown';
            
            // Очищаем время от символов, которые недопустимы в именах файлов
            const cleanCallTime = callTime.replace(/[:.]/g, '-').replace(/\s/g, '_');
            const fileName = `${caller}_${callee}_${cleanCallTime}_${direction}.mp3`;
            
            // Используем fetch для получения аудио файла
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            
            // Создаем URL для скачивания
            const downloadUrl = URL.createObjectURL(blob);
            
            // Создаем временный элемент для скачивания
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            // Удаляем временный элемент и освобождаем URL
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            }, 100);
        } catch (error) {
            console.error('Error downloading audio file:', error);
        }
    };

    const handleGetSummarization = async () => {
        if ((!summarization && transcriptText.length === 0) || questionText !== '') {
            if (dataTable.length < 5) {
                setTranscriptText("Слишком короткий диалог");
                setSummarization(!summarization);
                return;
            }

            setLoading(true);
            setTranscriptText("Думаю...");

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

    // Check for API key settings on initial render
    useEffect(() => {
        const apiUrlStored = localStorage.getItem('apiUrl');
        const apiKeyStored = localStorage.getItem('apiKey');
        const modelIdStored = localStorage.getItem('modelId');
        const promptStored = localStorage.getItem('prompt');

        if (!apiUrlStored || !apiKeyStored || !modelIdStored || !promptStored) {
            setShowApiKeyModal(true);
        }
    }, []);

    // Load data and handle autoplay when the callid changes
    useEffect(() => {
        if (call.callid) {
            loadCallData();
            if (call.autoplay) {
                setPlaying(true);
                call.setAutoplay(false); // Reset autoplay flag
            } else {
                setPlaying(false); // Stop playing if a new call is selected without autoplay
            }
        }
    }, [call.callid]);

    const handlePositionChange = (position: number) => { };
    const onReadyHandler = () => {
        // Only auto-play if this happens after user interaction
        // For now, we'll just update the audio duration when ready
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
    }
    
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setPosition(audioRef.current.currentTime);
        }
    };
    
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
    };
    
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Load data if not already loaded
        if (dataTable.length === 0) {
            loadCallData();
        }
        if (audioRef.current && audioDuration > 0) {
            const progressBar = e.currentTarget;
            const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
            const progressBarWidth = progressBar.clientWidth;
            const newTime = (clickPosition / progressBarWidth) * audioDuration;
            audioRef.current.currentTime = newTime;
            setPosition(newTime);
        }
    };
    
    useEffect(() => {
        if (audioRef.current) {
            if (playing) {
                // Only attempt to play if not already playing
                if (audioRef.current.paused) {
                    audioRef.current.play().catch(e => console.error("Error playing audio:", e));
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [playing]);

    return (
        <div className='callcard'>
            {showApiKeyModal && <ApiKeyModal onSave={handleSaveApiKey} />}
            <div className='Card'>
                <div className='player player-container'>
                    <button className='playBTN play-button' onClick={handleClickPlay}>{playing ? '||' : '▶'}</button>
                    <div className="audio-progress-container audio-progress-wrapper" onClick={handleProgressClick}>
                        <div className="audio-progress-track">
                            <div className="audio-progress-bar audio-progress-fill" style={{ width: `${(position / audioDuration) * 100 || 0}%` }}></div>
                        </div>
                        <div className="audio-progress-labels">
                            {audioDuration > 0 && Array.from({ length: Math.floor(audioDuration / 30) + 1 }, (_, i) => {
                                const time = i * 30;
                                if (time <= audioDuration) {
                                    return (
                                        <div
                                            key={i}
                                            className="time-marker"
                                            style={{ left: `${(time / audioDuration) * 100}%` }}
                                        >
                                            {formatTime(time)}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <audio
                            ref={audioRef}
                            src={`${apiUrl}file/file/${call.callid}`}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={() => setPlaying(false)}
                            className="audio-element"
                        />
                    </div>
                    <button className='playBTN play-button' onClick={handleDownloadAudio}>⬇️</button>
                    <div className='callMetaContainer'>
                        <div className='callMeta'>Мета информация{Object.entries(call.item).filter(([key, _]) => key !== 'call_uuid').map(([key, subject], i) => (
                            <div className="metas" key={key}>
                                <span className='keys'>{key}</span>
                                <span className='values'>
                                  {key === 'call_start_ts' ? formatDateTime(subject as string) :
                                   key === 'duration' ? formatDuration(subject as number) :
                                   key === 'direction' ? (subject === 'inbound' ? 'in' : subject === 'outbound' ? 'out' : subject) :
                                   subject} {call.item.name}
                                </span>
                            </div>
                        ))}
                        </div>
                        <div className='tagContainer'>Тэги
                            <div className='callTags'>
                                {tags.map(Tag => <span key={`${Tag.spk}-${Tag.tag}`} className={"tag" + Tag.spk + " tag-opacity"} style={{ '--tag-opacity': Tag.proba } as React.CSSProperties} title={(100 * Tag.proba).toFixed(2).toString() + " %"}>{Tag.tag}</span>)}
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
                        {summarization && isThinking ?
                            <div className="thinking-indicator">
                                Думаю...
                            </div>
                        : summarization ?
                            <div className="markdown-content">
                                <ReactMarkdown>{transcriptText.replace(/<think>[\s\S]*?<\/think>/g, '')}</ReactMarkdown>
                            </div>
                        :
                            dataTable.map((Frase, index) => (
                                <div
                                    key={`${Frase.result[0].start}-${index}`}
                                    className={"text " + (Frase.spk ? 'right ' : 'left ') + Frase.emotion + " " + Frase.emotion_audio + "_audio transcription-text-position"}
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
