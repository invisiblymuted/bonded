import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMessages, useJournal, useMediaGallery, useCreateMessage, useCreateJournalEntry, useCreateMedia, useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BondedLogo } from "@/components/BondedLogo";
import { Loader2, Send, MessageSquare, BookOpen, Share2, Upload, ImagePlus, X, ArrowLeft } from "lucide-react";
import { GradientIcon } from "@/components/GradientIcon";
import { NotificationBell } from "@/components/NotificationBell";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Connection() {
  const [match, params] = useRoute("/connection/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { data: relationships } = useRelationships();
  const currentConnection = relationships?.find(r => r.id === id);
  const connectionName = (currentConnection as any)?.otherUserName || currentConnection?.childName || "Connection";
  const { data: messages, isLoading: messagesLoading } = useMessages(id);
  const { data: journal, isLoading: journalLoading } = useJournal(id);
  const { data: mediaGallery, isLoading: mediaLoading } = useMediaGallery(id);
  const createMessage = useCreateMessage(id);
  const createJournal = useCreateJournalEntry(id);

  const [messageText, setMessageText] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState("happy");
  const [journalMedia, setJournalMedia] = useState<{ url: string; type: string; filename: string } | null>(null);
  const [mediaCaption, setMediaCaption] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const createMedia = useCreateMedia(id);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      createMessage.mutate(messageText);
      setMessageText("");
    }
  };

  const handleCreateJournal = () => {
    if (journalTitle.trim() && journalContent.trim()) {
      createJournal.mutate({ 
        title: journalTitle, 
        content: journalContent, 
        mood: journalMood,
        mediaUrl: journalMedia?.url,
        mediaType: journalMedia?.type
      });
      setJournalTitle("");
      setJournalContent("");
      setJournalMood("happy");
      setJournalMedia(null);
    }
  };

  const handleJournalMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      let type = "photo";
      if (file.type.startsWith("video")) type = "video";
      else if (file.type.startsWith("audio")) type = "audio";
      
      setJournalMedia({ url, type, filename: file.name });
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    
    setUploadingMedia(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      let type: "photo" | "drawing" | "video" | "audio" = "photo";
      if (file.type.startsWith("video")) type = "video";
      else if (file.type.startsWith("audio")) type = "audio";
      else if (file.type.includes("png") || file.type.includes("jpeg") || file.type.includes("gif")) type = "photo";
      
      createMedia.mutate({ type, url, filename: file.name, caption: mediaCaption || undefined });
      setMediaCaption("");
      setUploadingMedia(false);
      e.currentTarget.value = "";
    };
    reader.readAsDataURL(file);
  };

  const moods = ["happy", "sad", "excited", "thoughtful", "grateful"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BondedLogo className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl" data-testid="text-connection-name">{connectionName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="link-dashboard">
                Dashboard
              </Button>
            </Link>
            <NotificationBell />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">{connectionName}</h1>
          <p className="text-muted-foreground mb-8">Share moments, memories, and love</p>

          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="messages" className="gap-2">
                <GradientIcon icon={<MessageSquare className="h-4 w-4" />} />
                Messages
              </TabsTrigger>
              <TabsTrigger value="journal" className="gap-2">
                <GradientIcon icon={<BookOpen className="h-4 w-4" />} />
                Journal
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-2">
                <GradientIcon icon={<Share2 className="h-4 w-4" />} />
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
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="text-sm text-muted-foreground">How are you feeling?</span>
                    <div className="flex gap-2 flex-wrap">
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
                  
                  {/* Media attachment */}
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,video/*,audio/*"
                          onChange={handleJournalMediaUpload}
                          className="hidden"
                          data-testid="input-journal-media"
                        />
                        <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
                          <span><ImagePlus className="h-4 w-4" /> Add Photo/Video</span>
                        </Button>
                      </label>
                      {journalMedia && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{journalMedia.filename}</span>
                          <Button variant="ghost" size="icon" onClick={() => setJournalMedia(null)} className="h-6 w-6">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {journalMedia && journalMedia.type === "photo" && (
                      <img src={journalMedia.url} alt="Preview" className="max-h-32 rounded-md" />
                    )}
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
                                  {entry.createdAt ? format(new Date(entry.createdAt), "MMM d, yyyy") : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                          {entry.mediaUrl && entry.mediaType === "photo" && (
                            <img src={entry.mediaUrl} alt="Journal attachment" className="rounded-md max-h-64 object-cover" />
                          )}
                          {entry.mediaUrl && entry.mediaType === "video" && (
                            <video src={entry.mediaUrl} controls className="rounded-md max-h-64 w-full" />
                          )}
                          {entry.mediaUrl && entry.mediaType === "audio" && (
                            <audio src={entry.mediaUrl} controls className="w-full" />
                          )}
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
              <Card>
                <CardHeader>
                  <CardTitle>Share Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Choose a file</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={handleMediaUpload}
                        disabled={uploadingMedia}
                        className="flex-1 file:bg-primary file:text-primary-foreground file:px-4 file:py-2 file:border-0 file:rounded-md file:cursor-pointer file:mr-4 file:font-medium"
                        data-testid="input-media-file"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Photos, drawings, videos, or audio files</p>
                  </div>
                  <Input
                    placeholder="Add a caption (optional)"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    disabled={uploadingMedia}
                    data-testid="input-media-caption"
                  />
                </CardContent>
              </Card>

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
