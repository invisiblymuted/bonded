import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientIcon } from "@/components/GradientIcon";
import { TutorialPanel } from "@/components/TutorialPanel";
import { MediaTest } from "@/components/MediaTest";
import { Loader2, Video, Users, PhoneOff, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const videoTutorialSteps = [
  {
    title: "Select a family member",
    description: "Choose who you want to video call from the dropdown."
  },
  {
    title: "Start the video call",
    description: "Click the 'Start Video Call' button to open the video room."
  },
  {
    title: "Share the room",
    description: "Your family member needs to join the same room - they can access it from their Video page too."
  },
  {
    title: "Allow camera and microphone",
    description: "When prompted, allow access to your camera and microphone for the call."
  },
  {
    title: "End the call",
    description: "Click 'End Call' when you're done to close the video session."
  }
];

export default function VideoCall() {
  const { user } = useAuth();
  const { data: relationships, isLoading: relationshipsLoading } = useRelationships();
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const searchString = useSearch();
  const { toast } = useToast();

  // Read connection ID from URL query param and auto-join if room URL provided
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const connectionParam = params.get("connection");
    const roomParam = params.get("room");
    
    if (connectionParam && relationships) {
      const connectionId = parseInt(connectionParam);
      const exists = relationships.find(r => r.id === connectionId);
      if (exists) {
        setSelectedConnectionId(connectionId);
        // If room URL provided (from notification), auto-join
        if (roomParam) {
          setRoomUrl(decodeURIComponent(roomParam));
          setVideoCallActive(true);
        }
      }
    }
  }, [searchString, relationships]);

  const selectedConnection = relationships?.find(r => r.id === selectedConnectionId);
  const connectionName = (selectedConnection as any)?.otherUserName || selectedConnection?.childName || "Connection";

  const startVideoCall = async () => {
    if (!selectedConnectionId) return;
    setIsStartingCall(true);
    try {
      const response = await apiRequest("POST", `/api/relationships/${selectedConnectionId}/video-call`);
      const data = await response.json();
      
      if (data.roomUrl) {
        setRoomUrl(data.roomUrl);
        setVideoCallActive(true);
        toast({
          title: "Call Started",
          description: `${connectionName} has been notified to join!`,
        });
      } else {
        throw new Error("No room URL returned");
      }
    } catch (error) {
      console.error("Failed to start video call:", error);
      toast({
        title: "Failed to start call",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsStartingCall(false);
    }
  };

  const endVideoCall = () => {
    setVideoCallActive(false);
    setRoomUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <GradientIcon icon={<Video className="h-8 w-8" />} />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Video Calls</h1>
          </div>
          <p className="text-muted-foreground mb-6">Connect face-to-face with your family</p>

          <TutorialPanel
            featureKey="video"
            featureTitle="Video Calls"
            icon={<HelpCircle className="h-5 w-5" />}
            steps={videoTutorialSteps}
          />

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Choose a Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relationshipsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : relationships && relationships.length > 0 ? (
                <Select
                  value={selectedConnectionId?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedConnectionId(parseInt(value));
                    setVideoCallActive(false);
                  }}
                >
                  <SelectTrigger data-testid="select-connection">
                    <SelectValue placeholder="Select a family member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel.id} value={rel.id.toString()}>
                        {(rel as any).otherUserName || rel.childName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No connections yet. Create a connection from the Dashboard first.
                </p>
              )}
            </CardContent>
          </Card>

          {selectedConnectionId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {!videoCallActive ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Video className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Ready to call {connectionName}?</h3>
                        <p className="text-muted-foreground mt-1">
                          Start a video call and see each other face-to-face
                        </p>
                      </div>
                      <MediaTest
                        trigger={
                          <Button
                            variant="outline"
                            className="gap-2"
                            size="lg"
                          >
                            <Video className="h-5 w-5" />
                            Test Camera & Mic
                          </Button>
                        }
                      />
                      <Button
                        onClick={startVideoCall}
                        className="btn-gradient gap-2"
                        size="lg"
                        disabled={isStartingCall}
                        data-testid="button-start-call"
                      >
                        {isStartingCall ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Video className="h-5 w-5" />
                        )}
                        {isStartingCall ? "Starting..." : "Start Video Call"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {connectionName} will be notified when you start the call
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : roomUrl ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <GradientIcon icon={<Video className="h-5 w-5" />} />
                        Video Call with {connectionName}
                      </CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={endVideoCall}
                        className="gap-2"
                        data-testid="button-end-call"
                      >
                        <PhoneOff className="h-4 w-4" />
                        End Call
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <div className="w-full rounded-lg overflow-hidden bg-black" style={{ minHeight: '60vh', height: 'calc(100vh - 280px)' }}>
                      <iframe
                        src={`${roomUrl}?displayName=${encodeURIComponent(user?.firstName || 'Family')}&skipMediaPermissionPrompt`}
                        allow="camera; microphone; fullscreen; display-capture; autoplay; speaker"
                        className="w-full h-full border-0"
                        style={{ minHeight: '60vh' }}
                        title="Video Call"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
