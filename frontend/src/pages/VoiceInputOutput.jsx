import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, OctagonPause } from "lucide-react";
import axios from "axios";
// import * as Lucide from "lucide-react";

export default function VoiceInputOutput() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  const handleStart = () => {
    setIsRecording(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsRecording(false);
      sendToAI(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // If speech recognition is active, we might need to explicitly stop it
    if (window.webkitSpeechRecognition && window.webkitSpeechRecognition.prototype.stop) {
      const recognition = new window.webkitSpeechRecognition(); // Create a new instance to control
      recognition.stop();
    }
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    if (speechSynthesis && speechUtterance) {
      speechSynthesis.cancel();
    }
  };

  const speak = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    setSpeechUtterance(utterance); // Store the utterance object
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const sendToAI = async (text) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/ask`,
        { message: text },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      speak(res.data.reply);

    } catch (error) {
      console.error("Error sending to AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Voice Input Section */}
        <div className="text-center">
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className={`relative p-6 rounded-full transition-all duration-300 bg-red-100 text-red-600 hover:bg-red-200`}
            >
              <MicOff className="h-8 w-8 animate-pulse" />
              <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500`} />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className={`relative p-6 rounded-full transition-all duration-300 bg-blue-100 text-blue-600 hover:bg-blue-200`}
            >
              <Mic className="h-8 w-8" />
              <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500`} />
            </button>
          )}
          <p className="mt-4 text-sm text-gray-600">
            {isRecording ? "Listening..." : "Click to start speaking"}
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">You said:</p>
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </div>
        )}

        {/* Speaking Indicator and Stop Button */}
        {isSpeaking && (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <Volume2 className="h-5 w-5" />
              <div className="flex gap-1">
                <span className="w-1 h-4 bg-green-600 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
                <span className="w-1 h-4 bg-green-600 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                <span className="w-1 h-4 bg-green-600 rounded-full animate-[bounce_1s_infinite_300ms]"></span>
              </div>
            </div>
            <button
              onClick={handleStopSpeaking}
              className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
            >
              <OctagonPause className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}