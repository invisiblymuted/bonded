import { useState } from "react";
import { useJournal, useCreateJournalEntry, useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientIcon } from "@/components/GradientIcon";
import { Loader2, BookOpen, Users, ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Journal() {
  const { data: relationships, isLoading: relationshipsLoading } = useRelationships();
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);

  const { data: journal, isLoading: journalLoading } = useJournal(selectedConnectionId || 0);
  const createJournal = useCreateJournalEntry(selectedConnectionId || 0);

  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState("happy");
  const [journalMedia, setJournalMedia] = useState<{ url: string; type: string; filename: string } | null>(null);

  const moods = ["happy", "sad", "excited", "thoughtful", "grateful"];

  const selectedConnection = relationships?.find(r => r.id === selectedConnectionId);
  const connectionName = (selectedConnection as any)?.otherUserName || selectedConnection?.childName || "Connection";

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

  const handleCreateJournal = () => {
    if (journalTitle.trim() && journalContent.trim() && selectedConnectionId) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <GradientIcon icon={<BookOpen className="h-8 w-8" />} />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Shared Journal</h1>
          </div>
          <p className="text-muted-foreground mb-8">Write and share your thoughts together</p>

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Write a Journal Entry for {connectionName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title..."
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    data-testid="input-journal-title"
                  />
                  <Textarea
                    placeholder="Share your thoughts, feelings, and memories..."
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    rows={6}
                    data-testid="input-journal-content"
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
                          data-testid={`button-mood-${mood}`}
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
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
                  
                  <Button onClick={handleCreateJournal} disabled={createJournal.isPending} className="w-full btn-gradient" data-testid="button-post-entry">
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
                              <div className="flex gap-2 mt-2 flex-wrap">
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
