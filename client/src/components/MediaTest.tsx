import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Mic, X, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaTestProps {
  trigger: React.ReactNode;
}

export function MediaTest({ trigger }: MediaTestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  const startTest = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setHasVideo(stream.getVideoTracks().length > 0);
      setHasAudio(stream.getAudioTracks().length > 0);

      // Set up audio level monitoring
      if (stream.getAudioTracks().length > 0) {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        microphone.connect(analyser);
        analyser.fftSize = 256;

        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
          animationRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }
    } catch (err: any) {
      setError(err?.message || "Could not access camera/microphone");
      console.error("Media test error:", err);
    }
  };

  const stopTest = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setHasVideo(false);
    setHasAudio(false);
    setAudioLevel(0);
  };

  const handleClose = () => {
    stopTest();
    setIsOpen(false);
    setError(null);
  };

  useEffect(() => {
    if (isOpen) {
      startTest();
    } else {
      stopTest();
    }
    return () => stopTest();
  }, [isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Test Camera & Microphone
            </DialogTitle>
            <DialogDescription>
              Check your camera and microphone before joining a call
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                  <p className="text-xs text-red-500 mt-2">
                    Please allow camera and microphone access in your browser settings.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      {hasVideo ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                      Camera
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      {hasAudio ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                      Microphone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Speak to test your microphone
                      </p>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-100"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {hasVideo && hasAudio && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ready to Call
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
