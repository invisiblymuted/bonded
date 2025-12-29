import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMessages, useJournal, useMediaGallery, useCreateMessage, useCreateJournalEntry, useCreateMedia, useRelationships, useEvents, useCreateEvent, useDeleteEvent } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BondedLogo } from "@/components/BondedLogo";
import { Loader2, Send, MessageSquare, BookOpen, Share2, Upload, ImagePlus, X, ArrowLeft, Calendar, Trash2, Gift, Phone, Bell, CalendarDays, Video, PhoneOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GradientIcon } from "@/components/GradientIcon";
import { NotificationBell } from "@/components/NotificationBell";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { JitsiMeeting } from "@jitsi/react-sdk";

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
  const [attachedMedia, setAttachedMedia] = useState<{ url: string; type: "photo" | "drawing" | "video" | "audio"; filename: string } | null>(null);
  const createMedia = useCreateMedia(id);
  const { toast } = useToast();
  const { data: events, isLoading: eventsLoading } = useEvents(id);
  const createEvent = useCreateEvent(id);
  const deleteEvent = useDeleteEvent(id);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("general");
  const [eventReminder, setEventReminder] = useState(true);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  const handlePrevMedia = () => {
    if (selectedMediaIndex !== null && mediaGallery) {
      setSelectedMediaIndex(selectedMediaIndex === 0 ? mediaGallery.length - 1 : selectedMediaIndex - 1);
    }
  };

  const handleNextMedia = () => {
    if (selectedMediaIndex !== null && mediaGallery) {
      setSelectedMediaIndex(selectedMediaIndex === mediaGallery.length - 1 ? 0 : selectedMediaIndex + 1);
    }
  };

  const selectedMedia = selectedMediaIndex !== null && mediaGallery ? mediaGallery[selectedMediaIndex] : null;

  const handleCreateEvent = () => {
    if (eventTitle.trim() && eventDate) {
      createEvent.mutate({
        title: eventTitle,
        description: eventDescription || undefined,
        eventDate: new Date(eventDate).toISOString(),
        eventType,
        reminder: eventReminder,
      });
      setEventTitle("");
      setEventDescription("");
      setEventDate("");
      setEventType("general");
      setEventReminder(true);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday": return <Gift className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "visit": return <CalendarDays className="h-4 w-4" />;
      case "reminder": return <Bell className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

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

  const handleAttachMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      let type: "photo" | "drawing" | "video" | "audio" = "photo";
      if (file.type.startsWith("video")) type = "video";
      else if (file.type.startsWith("audio")) type = "audio";
      else if (file.type.includes("png") || file.type.includes("jpeg") || file.type.includes("gif")) type = "photo";
      
      setAttachedMedia({ url, type, filename: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadMedia = () => {
    if (!attachedMedia) return;
    
    setUploadingMedia(true);
    createMedia.mutate(
      { type: attachedMedia.type, url: attachedMedia.url, filename: attachedMedia.filename, caption: mediaCaption || undefined },
      {
        onSuccess: () => {
          setAttachedMedia(null);
          setMediaCaption("");
          setUploadingMedia(false);
          toast({
            title: "Media uploaded",
            description: "Your media has been added to the gallery.",
          });
        },
        onError: (error) => {
          setUploadingMedia(false);
          toast({
            title: "Upload failed",
            description: error instanceof Error ? error.message : "Failed to upload media. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleRemoveAttached = () => {
    setAttachedMedia(null);
    setMediaCaption("");
  };

  const moods = ["happy", "sad", "excited", "thoughtful", "grateful"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold" data-testid="text-connection-name">{connectionName}</h1>
          </div>
          <p className="text-muted-foreground mb-8">Share moments, memories, and love</p>

          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 w-full mb-8 h-auto p-2 md:grid md:grid-cols-5 md:gap-1 md:p-1">
              <TabsTrigger value="messages" className="gap-2 px-4 py-2 min-w-[100px] md:min-w-0 md:px-2">
                <GradientIcon icon={<MessageSquare className="h-4 w-4" />} />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Msgs</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="gap-2 px-4 py-2 min-w-[100px] md:min-w-0 md:px-2">
                <GradientIcon icon={<BookOpen className="h-4 w-4" />} />
                Journal
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2 px-4 py-2 min-w-[100px] md:min-w-0 md:px-2" data-testid="tab-calendar">
                <GradientIcon icon={<Calendar className="h-4 w-4" />} />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-2 px-4 py-2 min-w-[100px] md:min-w-0 md:px-2">
                <GradientIcon icon={<Share2 className="h-4 w-4" />} />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2 px-4 py-2 min-w-[100px] md:min-w-0 md:px-2" data-testid="tab-video">
                <GradientIcon icon={<Video className="h-4 w-4" />} />
                Video
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
                    <Button onClick={handleSendMessage} disabled={createMessage.isPending} className="btn-gradient">
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
                  
                  <Button onClick={handleCreateJournal} disabled={createJournal.isPending} className="w-full btn-gradient">
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

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GradientIcon icon={<Calendar className="h-5 w-5" />} />
                    Add Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Event title..."
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    data-testid="input-event-title"
                  />
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    data-testid="input-event-date"
                  />
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger data-testid="select-event-type">
                      <SelectValue placeholder="Event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="visit">Visit</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Description (optional)..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    rows={2}
                    data-testid="input-event-description"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="eventReminder"
                      checked={eventReminder}
                      onCheckedChange={(checked) => setEventReminder(checked === true)}
                      data-testid="checkbox-event-reminder"
                    />
                    <label htmlFor="eventReminder" className="text-sm text-muted-foreground cursor-pointer">
                      Send notification reminder
                    </label>
                  </div>
                  <Button onClick={handleCreateEvent} disabled={createEvent.isPending} className="w-full btn-gradient" data-testid="button-create-event">
                    {createEvent.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Event
                  </Button>
                </CardContent>
              </Card>

              {eventsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : events && events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="overflow-visible">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <GradientIcon icon={getEventIcon(event.eventType)} />
                              </div>
                              <div>
                                <h4 className="font-semibold">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {event.eventDate ? format(new Date(event.eventDate), "EEEE, MMM d, yyyy 'at' h:mm a") : ""}
                                </p>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                )}
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  <Badge variant="outline" className="capitalize">{event.eventType}</Badge>
                                  {event.reminder && (
                                    <Badge variant="secondary" className="gap-1">
                                      <Bell className="h-3 w-3" /> Reminder on
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEvent.mutate(event.id)}
                              className="text-muted-foreground hover:text-destructive"
                              data-testid={`button-delete-event-${event.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No events yet. Add your first family event!</p>
              )}
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Share Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!attachedMedia ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">Attach a file</label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*,video/*,audio/*"
                          onChange={handleAttachMedia}
                          className="flex-1 file:bg-primary file:text-primary-foreground file:px-4 file:py-2 file:border-0 file:rounded-md file:cursor-pointer file:mr-4 file:font-medium"
                          data-testid="input-media-file"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Photos, drawings, videos, or audio files</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-32 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {attachedMedia.type === "photo" || attachedMedia.type === "drawing" ? (
                            <img src={attachedMedia.url} alt={attachedMedia.filename} className="w-full h-full object-cover" />
                          ) : attachedMedia.type === "video" ? (
                            <video src={attachedMedia.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Share2 className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium truncate">{attachedMedia.filename}</p>
                          <Badge variant="outline">{attachedMedia.type}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAttached}
                            className="text-destructive"
                            data-testid="button-remove-attached"
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                      <Input
                        placeholder="Add a caption (optional)"
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        disabled={uploadingMedia}
                        data-testid="input-media-caption"
                      />
                      <Button
                        className="btn-gradient w-full"
                        onClick={handleUploadMedia}
                        disabled={uploadingMedia}
                        data-testid="button-upload-media"
                      >
                        {uploadingMedia ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="h-4 w-4 mr-2" /> Upload to Gallery</>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {mediaLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : mediaGallery && mediaGallery.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaGallery.map((m, index) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer hover:ring-2 hover:ring-primary/50"
                        onClick={() => setSelectedMediaIndex(index)}
                        data-testid={`gallery-item-${m.id}`}
                      >
                        {m.type === "photo" || m.type === "drawing" ? (
                          <div className="aspect-square bg-muted overflow-hidden">
                            <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                          </div>
                        ) : m.type === "video" ? (
                          <div className="aspect-square bg-muted overflow-hidden relative">
                            <video src={m.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Video className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            <Share2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        {m.caption && (
                          <div className="p-3 bg-card">
                            <p className="text-sm text-muted-foreground truncate">{m.caption}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <Dialog open={selectedMediaIndex !== null} onOpenChange={(open) => !open && setSelectedMediaIndex(null)}>
                    <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
                      {selectedMedia && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
                            onClick={() => setSelectedMediaIndex(null)}
                            data-testid="button-close-gallery"
                          >
                            <X className="h-5 w-5" />
                          </Button>

                          {mediaGallery.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                                onClick={handlePrevMedia}
                                data-testid="button-prev-media"
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                                onClick={handleNextMedia}
                                data-testid="button-next-media"
                              >
                                <ChevronRight className="h-6 w-6" />
                              </Button>
                            </>
                          )}

                          <div className="flex items-center justify-center min-h-[50vh] max-h-[80vh]">
                            {selectedMedia.type === "photo" || selectedMedia.type === "drawing" ? (
                              <img
                                src={selectedMedia.url}
                                alt={selectedMedia.filename}
                                className="max-w-full max-h-[80vh] object-contain"
                              />
                            ) : selectedMedia.type === "video" ? (
                              <video
                                src={selectedMedia.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-[80vh]"
                              />
                            ) : selectedMedia.type === "audio" ? (
                              <div className="p-8">
                                <audio src={selectedMedia.url} controls autoPlay className="w-full" />
                              </div>
                            ) : (
                              <div className="p-8 text-white">
                                <Share2 className="h-16 w-16 mx-auto mb-4" />
                                <p>{selectedMedia.filename}</p>
                              </div>
                            )}
                          </div>

                          {(selectedMedia.caption || selectedMedia.filename) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              {selectedMedia.caption && (
                                <p className="text-white text-center">{selectedMedia.caption}</p>
                              )}
                              <p className="text-white/60 text-sm text-center mt-1">
                                {selectedMediaIndex !== null && `${selectedMediaIndex + 1} of ${mediaGallery.length}`}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">No media yet. Start sharing!</p>
              )}
            </TabsContent>

            {/* Video Call Tab */}
            <TabsContent value="video" className="space-y-6">
              {!videoCallActive ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GradientIcon icon={<Video className="h-5 w-5" />} />
                      Video Call
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Start a video call with {connectionName}. Both of you will need to be on this page at the same time to connect.
                    </p>
                    <Button
                      className="btn-gradient w-full"
                      onClick={() => setVideoCallActive(true)}
                      data-testid="button-start-video-call"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Video Call
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Video Call with {connectionName}</h3>
                    <Button
                      variant="destructive"
                      onClick={() => setVideoCallActive(false)}
                      data-testid="button-end-video-call"
                    >
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Call
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-border" style={{ height: "500px" }}>
                    <JitsiMeeting
                      domain="meet.jit.si"
                      roomName={`BondedFamily${id}Room${(currentConnection?.parentId || "0").slice(-6)}`}
                      configOverwrite={{
                        startWithAudioMuted: true,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: false,
                        disableModeratorIndicator: true,
                        enableLobbyChat: false,
                        lobbyModeEnabled: false,
                        requireDisplayName: false,
                        enableWelcomePage: false,
                        enableClosePage: false,
                        disableInviteFunctions: true,
                        doNotStoreRoom: true,
                        p2p: { enabled: true },
                      }}
                      interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        SHOW_JITSI_WATERMARK: false,
                        MOBILE_APP_PROMO: false,
                        HIDE_INVITE_MORE_HEADER: true,
                        DISABLE_RINGING: true,
                      }}
                      userInfo={{
                        displayName: user?.firstName || "Family Member",
                        email: user?.email || "",
                      }}
                      getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = "100%";
                        iframeRef.style.width = "100%";
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
