import { useState, useRef } from 'react';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const synthesizeSpeech = async (text) => {
    if (!text) return;

    const client = new PollyClient({
      region: 'us-east-1',
      credentials: {},
    });

    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Seoyeon',
    };

    try {
      const { AudioStream } = await client.send(
        new SynthesizeSpeechCommand(params)
      );
      if (AudioStream) {
        const webStream = AudioStream.transformToWebStream();
        const response = new Response(webStream);
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);
        } else {
          audioRef.current.src = audioUrl;
        }

        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error synthesizing speech:', err);
    }
  };

  return { isPlaying, synthesizeSpeech };
};
