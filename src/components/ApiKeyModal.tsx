import { useState, useEffect } from 'react';

interface ApiKeyModalProps {
    onSave: (apiUrl: string, apiKey: string, modelId: string) => void;
}

function ApiKeyModal({ onSave }: ApiKeyModalProps) {
    const [apiUrl, setApiUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [modelId, setModelId] = useState('');

    // Инициализация состояний из localStorage при монтировании компонента
    useEffect(() => {
        const apiUrlStored = localStorage.getItem('apiUrl') || '';
        const apiKeyStored = localStorage.getItem('apiKey') || '';
        const modelIdStored = localStorage.getItem('modelId') || '';

        setApiUrl(apiUrlStored);
        setApiKey(apiKeyStored);
        setModelId(modelIdStored);
    }, []);

    const handleSave = () => {
        if (apiUrl && apiKey && modelId) {
            // Сохранение в localStorage
            localStorage.setItem('apiUrl', apiUrl);
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('modelId', modelId);

            onSave(apiUrl, apiKey, modelId);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Введите API URL, API Key и имя модели</h2>
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
                <button onClick={handleSave}>Сохранить</button>
            </div>
        </div>
    );
}

export default ApiKeyModal;