import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMessages, useCreateMessage, useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientIcon } from "@/components/GradientIcon";
import { TutorialPanel } from "@/components/TutorialPanel";
import { Loader2, Send, MessageSquare, Users, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const messageTutorialSteps = [
  {
    title: "Select a family member",
    description: "Choose who you want to message from the dropdown menu below."
  },
  {
    title: "Type your message",
    description: "Write your message in the text box at the bottom of the chat."
  },
  {
    title: "Send and stay connected",
    description: "Press the send button or hit Enter to send. Your messages appear instantly!"
  },
  {
    title: "View conversation history",
    description: "All your past messages are saved and visible in the chat window."
  }
];

export default function Messages() {
  const { user } = useAuth();
  const { data: relationships, isLoading: relationshipsLoading } = useRelationships();
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConnectionId || 0);
  const createMessage = useCreateMessage(selectedConnectionId || 0);

  const selectedConnection = relationships?.find(r => r.id === selectedConnectionId);
  const connectionName = (selectedConnection as any)?.otherUserName || selectedConnection?.childName || "Connection";

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConnectionId) {
      createMessage.mutate(messageText);
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <GradientIcon icon={<MessageSquare className="h-8 w-8" />} />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Messages</h1>
          </div>
          <p className="text-muted-foreground mb-6">Send instant messages to stay connected</p>

          <TutorialPanel
            featureKey="messages"
            featureTitle="Messages"
            icon={<HelpCircle className="h-5 w-5" />}
            steps={messageTutorialSteps}
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
                  onValueChange={(value) => setSelectedConnectionId(parseInt(value))}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>Chat with {connectionName}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.senderId === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.createdAt ? format(new Date(msg.createdAt), "HH:mm") : ""}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</p>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      data-testid="input-message"
                    />
                    <Button onClick={handleSendMessage} disabled={createMessage.isPending} className="btn-gradient" data-testid="button-send">
                      {createMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
