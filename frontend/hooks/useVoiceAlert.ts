import { useCallback, useRef, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const useVoiceAlert = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      stop();

      const response = await fetch(`${BACKEND_URL}/api/tts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, severity: "high" }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();
    } catch (error) {
      console.warn("ElevenLabs TTS failed, using browser speech fallback:", error);
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } catch (speechError) {
        console.error("Browser speech also failed:", speechError);
        setIsSpeaking(false);
      }
    }
  }, []);

  const speakWithSeverity = useCallback(async (text: string, severity: "low" | "medium" | "high" | "critical") => {
    try {
      setIsSpeaking(true);
      stop();

      const response = await fetch(`${BACKEND_URL}/api/tts/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, severity }),
      });

      if (!response.ok) throw new Error(`TTS stream error: ${response.status}`);

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();
    } catch (error) {
      console.warn("Stream TTS failed, falling back to simple speak:", error);
      return speak(text);
    }
  }, [speak]);

  const analyzeAndSpeak = useCallback(async (transactionData: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tts/analyze-and-speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionData }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const result = await response.json();

      if (result.warningText && result.audio) {
        setIsSpeaking(true);
        stop();

        const binaryStr = atob(result.audio);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);

        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.play().catch(() => setIsSpeaking(false));
      }

      return result;
    } catch (error) {
      console.error("Analyze and speak error:", error);
      return null;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    try { speechSynthesis.cancel(); } catch {}
    setIsSpeaking(false);
  }, []);

  return { speak, speakWithSeverity, analyzeAndSpeak, stop, isSpeaking };
};
