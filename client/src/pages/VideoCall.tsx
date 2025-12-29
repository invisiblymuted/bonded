import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientIcon } from "@/components/GradientIcon";
import { TutorialPanel } from "@/components/TutorialPanel";
import { Loader2, Video, Users, PhoneOff, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useSearch } from "wouter";
import { apiRequest } from "@/lib/queryClient";

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
  const searchString = useSearch();

  // Read connection ID from URL query param
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const connectionParam = params.get("connection");
    if (connectionParam && relationships) {
      const connectionId = parseInt(connectionParam);
      const exists = relationships.find(r => r.id === connectionId);
      if (exists) {
        setSelectedConnectionId(connectionId);
      }
    }
  }, [searchString, relationships]);

  const selectedConnection = relationships?.find(r => r.id === selectedConnectionId);
  const connectionName = (selectedConnection as any)?.otherUserName || selectedConnection?.childName || "Connection";

  const generateRoomName = () => {
    if (!selectedConnectionId || !user?.id) return "";
    const ids = [user.id, selectedConnectionId.toString()].sort();
    return `bonded-family-${ids.join("-")}`;
  };

  const startVideoCall = async () => {
    if (!selectedConnectionId) return;
    try {
      await apiRequest("POST", `/api/relationships/${selectedConnectionId}/video-call`);
    } catch (error) {
      console.error("Failed to notify about video call:", error);
    }
    setVideoCallActive(true);
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
                      <Button
                        onClick={startVideoCall}
                        className="btn-gradient gap-2"
                        size="lg"
                        data-testid="button-start-call"
                      >
                        <Video className="h-5 w-5" />
                        Start Video Call
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Share the same room link with {connectionName} so they can join
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
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
                        onClick={() => setVideoCallActive(false)}
                        className="gap-2"
                        data-testid="button-end-call"
                      >
                        <PhoneOff className="h-4 w-4" />
                        End Call
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <JitsiMeeting
                        domain="meet.jit.si"
                        roomName={generateRoomName()}
                        configOverwrite={{
                          startWithAudioMuted: false,
                          startWithVideoMuted: false,
                          prejoinPageEnabled: false,
                          disableDeepLinking: true,
                          enableLobbyChat: false,
                          hideLobbyButton: true,
                          requireDisplayName: false,
                          disableModeratorIndicator: true,
                          enableInsecureRoomNameWarning: false,
                          notifications: [],
                          toolbarButtons: [
                            'microphone',
                            'camera',
                            'closedcaptions',
                            'desktop',
                            'fullscreen',
                            'hangup',
                            'chat',
                            'settings',
                            'videoquality',
                            'filmstrip',
                            'tileview',
                          ],
                          p2p: {
                            enabled: true,
                          },
                          disableTileEnlargement: true,
                        }}
                        interfaceConfigOverwrite={{
                          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                          SHOW_JITSI_WATERMARK: false,
                          SHOW_WATERMARK_FOR_GUESTS: false,
                          SHOW_BRAND_WATERMARK: false,
                          SHOW_POWERED_BY: false,
                          DEFAULT_BACKGROUND: '#1a1a1a',
                          TOOLBAR_ALWAYS_VISIBLE: true,
                          MOBILE_APP_PROMO: false,
                          HIDE_INVITE_MORE_HEADER: true,
                        }}
                        userInfo={{
                          displayName: user?.firstName || 'Family Member',
                          email: user?.email || '',
                        }}
                        getIFrameRef={(iframeRef) => {
                          iframeRef.style.height = '100%';
                          iframeRef.style.width = '100%';
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
