import { useState, useRef, useEffect } from 'react';
import { Mic, Video, Square, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { MediaAttachment } from '../types';

interface MediaRecorderProps {
  type: 'audio' | 'video';
  onClose: () => void;
  onSend: (media: MediaAttachment) => void;
}

export function MediaRecorder({ type, onClose, onSend }: MediaRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const constraints = type === 'video'
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm',
        });
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Could not access camera/microphone. Please allow permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const media: MediaAttachment = {
        type,
        url,
        name: `${type}_message_${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`,
        size: recordedBlob.size,
        duration: recordingTime,
      };
      onSend(media);
      onClose();
    }
  };

  const handleRetake = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-rose-950/50 to-pink-950/30 border border-rose-300/20 rounded-3xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-rose-100">
            Record {type === 'video' ? 'Video' : 'Audio'} Message
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-rose-200" />
          </Button>
        </div>

        {/* Preview */}
        <div className="relative bg-black/50 rounded-2xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
          {type === 'video' && (
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          {type === 'audio' && (
            <div className="text-center">
              <Mic className="w-16 h-16 text-rose-300 mx-auto mb-2" />
              <p className="text-rose-200/70 text-sm">Audio Recording</p>
            </div>
          )}
          {recordedBlob && type === 'video' && (
            <video
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="w-full h-full object-cover"
            />
          )}
          {recordedBlob && type === 'audio' && (
            <audio
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="w-full"
            />
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !recordedBlob && (
            <Button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-300 to-pink-400 hover:from-rose-400 hover:to-pink-500 text-black shadow-lg shadow-rose-300/30"
            >
              {type === 'video' ? (
                <Video className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
          )}
          
          {isRecording && (
            <Button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
            >
              <Square className="w-6 h-6" />
            </Button>
          )}

          {recordedBlob && (
            <>
              <Button
                onClick={handleRetake}
                variant="outline"
                className="border-rose-300/30 text-rose-200 hover:bg-rose-300/10"
              >
                Retake
              </Button>
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-rose-300 to-pink-400 hover:from-rose-400 hover:to-pink-500 text-black shadow-lg shadow-rose-300/30"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}