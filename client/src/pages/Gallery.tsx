import { useState } from "react";
import { useMediaGallery, useCreateMedia, useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GradientIcon } from "@/components/GradientIcon";
import { TutorialPanel } from "@/components/TutorialPanel";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Share2, Users, Upload, X, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const galleryTutorialSteps = [
  {
    title: "Select a family member",
    description: "Choose who you want to share media with from the dropdown."
  },
  {
    title: "Upload your photos or videos",
    description: "Click the upload area to select photos, videos, or audio files from your device."
  },
  {
    title: "Add a caption",
    description: "Write a short description to remember the moment."
  },
  {
    title: "Browse your shared memories",
    description: "Click on any image to view it full size. Use arrows to navigate through your gallery."
  }
];

export default function Gallery() {
  const { data: relationships, isLoading: relationshipsLoading } = useRelationships();
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: mediaGallery, isLoading: mediaLoading } = useMediaGallery(selectedConnectionId || 0);
  const createMedia = useCreateMedia(selectedConnectionId || 0);

  const [attachedMedia, setAttachedMedia] = useState<{ url: string; type: "photo" | "drawing" | "video" | "audio"; filename: string } | null>(null);
  const [mediaCaption, setMediaCaption] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  const selectedConnection = relationships?.find(r => r.id === selectedConnectionId);
  const connectionName = (selectedConnection as any)?.otherUserName || selectedConnection?.childName || "Connection";

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

  const handleAttachMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      let type: "photo" | "drawing" | "video" | "audio" = "photo";
      if (file.type.startsWith("video")) type = "video";
      else if (file.type.startsWith("audio")) type = "audio";
      
      setAttachedMedia({ url, type, filename: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadMedia = () => {
    if (!attachedMedia || !selectedConnectionId) return;
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <GradientIcon icon={<Share2 className="h-8 w-8" />} />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Media Gallery</h1>
          </div>
          <p className="text-muted-foreground mb-6">Share photos, videos, and memories together</p>

          <TutorialPanel
            featureKey="gallery"
            featureTitle="Media Gallery"
            icon={<HelpCircle className="h-5 w-5" />}
            steps={galleryTutorialSteps}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Media for {connectionName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!attachedMedia ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,video/*,audio/*"
                          onChange={handleAttachMedia}
                          className="hidden"
                          data-testid="input-media-file"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">Click to upload a photo, video, or audio</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {attachedMedia.type === "photo" && (
                          <img src={attachedMedia.url} alt="Preview" className="max-h-40 rounded-md" />
                        )}
                        {attachedMedia.type === "video" && (
                          <video src={attachedMedia.url} className="max-h-40 rounded-md" controls />
                        )}
                        {attachedMedia.type === "audio" && (
                          <audio src={attachedMedia.url} controls />
                        )}
                        <Button variant="ghost" size="icon" onClick={handleRemoveAttached}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Add a caption (optional)..."
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        data-testid="input-media-caption"
                      />
                      <Button onClick={handleUploadMedia} disabled={uploadingMedia} className="w-full btn-gradient" data-testid="button-upload">
                        {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload to Gallery
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mediaGallery.map((media, index) => (
                    <motion.div
                      key={media.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setSelectedMediaIndex(index)}
                    >
                      {media.type === "photo" || media.type === "drawing" ? (
                        <img src={media.url} alt={media.caption || "Gallery item"} className="w-full h-full object-cover" />
                      ) : media.type === "video" ? (
                        <video src={media.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground">Audio</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No media yet. Upload your first photo or video!</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Dialog open={selectedMediaIndex !== null} onOpenChange={() => setSelectedMediaIndex(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedMedia && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80"
                onClick={handlePrevMedia}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80"
                onClick={handleNextMedia}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              <div className="flex flex-col">
                {selectedMedia.type === "photo" || selectedMedia.type === "drawing" ? (
                  <img src={selectedMedia.url} alt={selectedMedia.caption || ""} className="w-full max-h-[70vh] object-contain" />
                ) : selectedMedia.type === "video" ? (
                  <video src={selectedMedia.url} controls className="w-full max-h-[70vh]" />
                ) : (
                  <div className="p-8">
                    <audio src={selectedMedia.url} controls className="w-full" />
                  </div>
                )}
                {selectedMedia.caption && (
                  <div className="p-4 border-t">
                    <p className="text-muted-foreground">{selectedMedia.caption}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedMedia.createdAt ? format(new Date(selectedMedia.createdAt), "MMM d, yyyy") : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
