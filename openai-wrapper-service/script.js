document.getElementById('api-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const apiKey = document.getElementById('apiKey').value;
    const prompt = document.getElementById('prompt').value;
    const responseElement = document.getElementById('response');
    
    if (!apiKey || !prompt) {
        alert('Please enter both API key and prompt.');
        return;
    }
    
    try {
const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
        top_p: 1.0,
        n: 1,
        stop: ['\n']
    })
});
        
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            responseElement.textContent = data.choices[0].text;
        } else {
            responseElement.textContent = 'No response received from OpenAI API.';
        }
    } catch (error) {
        console.error('Error:', error);
        responseElement.textContent = 'An error occurred while fetching the response from OpenAI API.';
    }
});
