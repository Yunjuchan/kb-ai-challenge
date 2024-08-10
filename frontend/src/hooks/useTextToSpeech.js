import { useState, useRef } from 'react';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const synthesizeSpeech = async (text) => {
    if (!text) return null;

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
        return URL.createObjectURL(audioBlob); // 오디오 URL 반환
      }
    } catch (err) {
      console.error('Error synthesizing speech:', err);
    }

    return null;
  };

  return { isPlaying, synthesizeSpeech };
};
