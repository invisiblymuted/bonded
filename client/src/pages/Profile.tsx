import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/GradientIcon";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Copy, Check, User, Mail, Calendar, Sparkles, ArrowLeft } from "lucide-react";
import { BondedLogo } from "@/components/BondedLogo";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, differenceInDays } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Get user from localStorage as fallback for development
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("bonded_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const currentUser = user || getStoredUser();

  if (!currentUser) {
    return (
      <div className="min-h-[100dvh] bg-[#f5f1e8] flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex flex-col pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/signup" className="block">
                <Card className="h-full bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all cursor-pointer">
                  <CardContent className="h-full flex flex-col items-center justify-center py-12 gap-4">
                    <BondedLogo className="w-16 h-16" />
                    <CardTitle className="text-2xl font-black text-[#4a453e]">Join</CardTitle>
                    <CardDescription className="text-sm text-[#4a453e] opacity-70">Create your Bonded profile.</CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/login" className="block">
                <Card className="h-full bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all cursor-pointer">
                  <CardContent className="h-full flex flex-col items-center justify-center py-12 gap-4">
                    <BondedLogo className="w-16 h-16" />
                    <CardTitle className="text-2xl font-black text-[#4a453e]">Already Bonded?</CardTitle>
                    <CardDescription className="text-sm text-[#4a453e] opacity-70">Log in with your PIN.</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  const initials = `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editFirst, setEditFirst] = useState(currentUser.firstName || "");
  const [editLast, setEditLast] = useState(currentUser.lastName || "");
  const [editImage, setEditImage] = useState(currentUser.profileImageUrl || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Resize/compress image in-browser to avoid huge base64 payloads
    const resizeImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => {
          img.onload = () => {
            const ratio = Math.min(1, maxWidth / img.width);
            const w = Math.round(img.width * ratio);
            const h = Math.round(img.height * ratio);
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas unsupported'));
            ctx.drawImage(img, 0, 0, w, h);
            const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const dataUrl = canvas.toDataURL(mime, quality);
            resolve(dataUrl);
          };
          img.onerror = (err) => reject(err);
          img.src = String(reader.result || '');
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    };

    setUploading(true);
    resizeImage(file).then(async (dataUrl) => {
      try {
        // If Cloudinary env is configured, upload the resized image there
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (cloudName && uploadPreset) {
          // convert dataUrl to blob
          const blobRes = await fetch(dataUrl);
          const blob = await blobRes.blob();
          const form = new FormData();
          form.append('file', blob, 'upload.jpg');
          form.append('upload_preset', uploadPreset as string);

          const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: form,
          });

          if (!resp.ok) throw new Error('Cloudinary upload failed');
          const json = await resp.json();
          setEditImage(json.secure_url || json.url || dataUrl);
        } else {
          // No cloud configured — fall back to data URL
          setEditImage(dataUrl);
        }
      } catch (err) {
        console.error('Image upload failed', err);
        alert('Image upload failed');
        // fallback to local data URL so the user can still save manually
        setEditImage(dataUrl);
      } finally {
        setUploading(false);
      }
    }).catch((err) => {
      console.error('Image resize failed', err);
      alert('Failed to process image');
      setUploading(false);
    });
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(currentUser.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-500/5 via-primary/5 to-background flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex flex-col pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl py-10 flex-1">
          <Link href="/app">
            <Button variant="ghost" className="mb-4 gap-2" data-testid="button-back-dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={currentUser.profileImageUrl || undefined} alt={currentUser.firstName || 'Profile'} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex justify-center mb-2">
                  <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                <CardTitle className="text-2xl" data-testid="text-profile-name">
                  {currentUser.firstName} {currentUser.lastName}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {editMode && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm block">Your Name</label>
                      <input className="w-full p-2 border rounded" value={editFirst} onChange={(e) => setEditFirst(e.target.value)} />
                    </div>
                    
                    <div>
                      <label className="text-sm block">Profile image URL or upload</label>
                      <input className="w-full p-2 border rounded mb-2" value={editImage} onChange={(e) => setEditImage(e.target.value)} />
                      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
                      {editImage && (
                        <div className="mt-2 flex items-center gap-2">
                          <img src={editImage} alt="preview" className="h-16 w-16 rounded-full object-cover border" />
                          <span className="text-sm text-muted-foreground">Preview</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button className="btn-gradient" onClick={async () => {
                        try {
                          const res = await fetch('/api/user', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ firstName: editFirst, lastName: editLast, profileImageUrl: editImage })
                          });
                          if (!res.ok) throw new Error(await res.text());
                          const updated = await res.json();
                          localStorage.setItem('bonded_user', JSON.stringify(updated));
                          queryClient.setQueryData(['/api/user'], updated);
                          setEditMode(false);
                        } catch (err) {
                          // eslint-disable-next-line no-console
                          console.error('Update failed', err);
                          alert('Failed to update profile');
                        }
                      }}>Save</Button>
                      <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <GradientIcon icon={<User className="h-5 w-5" />} />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Your User ID</p>
                      <p className="font-mono text-sm" data-testid="text-profile-user-id">{currentUser.id}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyUserId} className="gap-1" data-testid="button-copy-profile-id">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <GradientIcon icon={<Mail className="h-5 w-5" />} />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm" data-testid="text-profile-email">{currentUser.email}</p>
                    </div>
                  </div>

                  {currentUser.createdAt && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                      <GradientIcon icon={<Calendar className="h-5 w-5" />} />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Member Since</p>
                        <p className="text-sm" data-testid="text-profile-joined">
                          {format(new Date(currentUser.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Share your User ID with family members so they can connect with you on Bonded.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
