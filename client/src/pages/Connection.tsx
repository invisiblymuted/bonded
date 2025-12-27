import { useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMessages, useJournal, useMediaGallery, useCreateMessage, useCreateJournalEntry } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare, BookOpen, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Connection() {
  const [match, params] = useRoute("/connection/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { data: messages, isLoading: messagesLoading } = useMessages(id);
  const { data: journal, isLoading: journalLoading } = useJournal(id);
  const { data: mediaGallery, isLoading: mediaLoading } = useMediaGallery(id);
  const createMessage = useCreateMessage(id);
  const createJournal = useCreateJournalEntry(id);

  const [messageText, setMessageText] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState("happy");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      createMessage.mutate(messageText);
      setMessageText("");
    }
  };

  const handleCreateJournal = () => {
    if (journalTitle.trim() && journalContent.trim()) {
      createJournal.mutate({ title: journalTitle, content: journalContent, mood: journalMood });
      setJournalTitle("");
      setJournalContent("");
      setJournalMood("happy");
    }
  };

  const moods = ["happy", "sad", "excited", "thoughtful", "grateful"];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Bonded</span>
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Connection</h1>
          <p className="text-muted-foreground mb-8">Share moments, memories, and love</p>

          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="journal" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Journal
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-2">
                <Share2 className="h-4 w-4" />
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <Card className="border border-border/50">
                <CardContent className="pt-6">
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
                              {format(new Date(msg.createdAt), "HH:mm")}
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
                    />
                    <Button onClick={handleSendMessage} disabled={createMessage.isPending}>
                      {createMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Write a Journal Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title..."
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Share your thoughts, feelings, and memories..."
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    rows={6}
                  />
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">How are you feeling?</span>
                    <div className="flex gap-2">
                      {moods.map((mood) => (
                        <Button
                          key={mood}
                          variant={journalMood === mood ? "default" : "outline"}
                          size="sm"
                          onClick={() => setJournalMood(mood)}
                          className="capitalize"
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreateJournal} disabled={createJournal.isPending} className="w-full">
                    {createJournal.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Post Entry
                  </Button>
                </CardContent>
              </Card>

              {journalLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : journal && journal.length > 0 ? (
                <div className="space-y-4">
                  {journal.map((entry) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <CardTitle className="text-xl">{entry.title}</CardTitle>
                              <div className="flex gap-2 mt-2">
                                {entry.mood && <Badge variant="outline" className="capitalize">{entry.mood}</Badge>}
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(entry.createdAt), "MMM d, yyyy")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No entries yet. Start your journal!</p>
              )}
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              {mediaLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : mediaGallery && mediaGallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaGallery.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
                    >
                      {m.type === "photo" || m.type === "drawing" ? (
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <Share2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      {m.caption && (
                        <div className="p-3 bg-card">
                          <p className="text-sm text-muted-foreground">{m.caption}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No media yet. Start sharing!</p>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
