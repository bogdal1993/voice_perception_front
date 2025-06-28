import { useState, useEffect } from 'react';

interface ApiKeyModalProps {
    onSave: (apiUrl: string, apiKey: string, modelId: string, prompt: string) => void;
}

function ApiKeyModal({ onSave }: ApiKeyModalProps) {
    const [apiUrl, setApiUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [modelId, setModelId] = useState('');
    const [prompt, setPrompt] = useState('Верни краткую сводку по диалогу на русском языке:\n');

    // Инициализация состояний из localStorage при монтировании компонента
    useEffect(() => {
        const apiUrlStored = localStorage.getItem('apiUrl') || 'https://api-inference.huggingface.co/v1/';
        const apiKeyStored = localStorage.getItem('apiKey') || '';
        const modelIdStored = localStorage.getItem('modelId') || 'mistralai/Mistral-Nemo-Instruct-2407';
        const promptStored = localStorage.getItem('prompt') || 'Верни краткую сводку по диалогу на русском языке';

        setApiUrl(apiUrlStored);
        setApiKey(apiKeyStored);
        setModelId(modelIdStored);
        setPrompt(promptStored);
    }, []);

    const handleSave = () => {
        if (apiUrl && apiKey && modelId) {
            // Сохранение в localStorage
            localStorage.setItem('apiUrl', apiUrl);
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('modelId', modelId);
            localStorage.setItem('prompt', prompt);

            onSave(apiUrl, apiKey, modelId, prompt);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Введите API URL, API Key, имя модели и промт</h2>
                <input
                    type="text"
                    placeholder="API URL"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Model ID"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                />
                <textarea
                    placeholder="Промт"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button onClick={handleSave}>Сохранить</button>
            </div>
        </div>
    );
}

export default ApiKeyModal;