const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const teluguOutput = document.getElementById('telugu-text');
const englishOutput = document.getElementById('english-text');
const statusText = document.getElementById('status');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Corrected this to Telugu (India)
recognition.lang = 'te-IN'; 
recognition.interimResults = false;
recognition.continuous = false;

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.innerText = "Listening... Speak in Telugu.";
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.innerText = "Stopped.";
});

// Added these for better control in Edge/Chrome
recognition.onstart = () => {
    console.log("Recognition started - Voice engine active.");
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Captured Telugu Text:", transcript);
    teluguOutput.value = transcript;
    statusText.innerText = "Translating...";
    
    translateText(transcript);
};

recognition.onerror = (event) => {
    console.error("Speech Error:", event.error);
    statusText.innerText = "Error occurred: " + event.error;
    startBtn.disabled = false;
    stopBtn.disabled = true;
};

async function translateText(text) {
    try {
        // langpair=te|en indicates Telugu to English
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=te|en`);
        const data = await response.json();
        
        if (data.responseData) {
            englishOutput.value = data.responseData.translatedText;
            statusText.innerText = "Done!";
            console.log("Translation Success!");
        } else {
            englishOutput.value = "Translation Error.";
        }
    } catch (error) {
        console.error("Translation API Error:", error);
        statusText.innerText = "Failed to translate.";
    }
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
}