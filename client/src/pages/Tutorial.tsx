import { useLocation, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaTest } from "@/components/MediaTest";
import { motion } from "framer-motion";
import {
  MessageSquare, BookOpen, Image, Calendar,
  Video, Shield, CheckCircle2, ArrowRight
} from "lucide-react";

interface TutorialStep {
  step: number;
  title: string;
  description: string;
}

interface TutorialContent {
  id: string;
  title: string;
  icon: any;
  color: string;
  steps: TutorialStep[];
  ctaLink: string;
}

const tutorialContent: Record<string, TutorialContent> = {
  messaging: {
    id: "messaging",
    title: "Messaging",
    icon: MessageSquare,
    color: "from-blue-500 to-blue-600",
    steps: [
      {
        step: 1,
        title: "Start a Conversation",
        description: "Click on any connection from your Dashboard to open a chat window.",
      },
      {
        step: 2,
        title: "Send Messages",
        description: "Type your message in the text box and press Enter or click Send.",
      },
      {
        step: 3,
        title: "Stay Connected",
        description: "Messages sync in real-time. You'll see when your loved one is typing and when they've read your message.",
      },
    ],
    ctaLink: "/messages",
  },
  journals: {
    id: "journals",
    title: "Shared Journals",
    icon: BookOpen,
    color: "from-amber-500 to-amber-600",
    steps: [
      {
        step: 1,
        title: "Create an Entry",
        description: "Click 'New Entry' from the Journal section on your Dashboard.",
      },
      {
        step: 2,
        title: "Write Your Thoughts",
        description: "Share your day, feelings, or anything you want your connection to know. Add photos if you'd like.",
      },
      {
        step: 3,
        title: "Share and Reflect",
        description: "Your entries are private between you and your connection. Read and respond to each other's journals.",
      },
    ],
    ctaLink: "/journal",
  },
  gallery: {
    id: "gallery",
    title: "Media Gallery",
    icon: Image,
    color: "from-pink-500 to-pink-600",
    steps: [
      {
        step: 1,
        title: "Upload Photos & Videos",
        description: "Click the upload button to add photos, videos, drawings, or voice messages.",
      },
      {
        step: 2,
        title: "Organize Your Memories",
        description: "Tag media with dates, events, or people. Create albums for special occasions.",
      },
      {
        step: 3,
        title: "Share Moments",
        description: "Your media is instantly available to your connection. Comment on each other's uploads.",
      },
    ],
    ctaLink: "/gallery",
  },
  calendar: {
    id: "calendar",
    title: "Shared Calendar",
    icon: Calendar,
    color: "from-orange-500 to-orange-600",
    steps: [
      {
        step: 1,
        title: "Schedule Events",
        description: "Add video calls, visits, or special dates to your shared calendar.",
      },
      {
        step: 2,
        title: "Set Reminders",
        description: "Get notifications before important events so you never miss a connection.",
      },
      {
        step: 3,
        title: "Plan Together",
        description: "Both you and your connection can add and edit calendar events.",
      },
    ],
    ctaLink: "/calendar",
  },
  video: {
    id: "video",
    title: "Video Calls",
    icon: Video,
    color: "from-green-500 to-green-600",
    steps: [
      {
        step: 1,
        title: "Start a Call",
        description: "Click the Video button from your Dashboard to launch a secure video call.",
      },
      {
        step: 2,
        title: "Test Your Video & Mic",
        description: "Use the pre-call test to check your camera and microphone before inviting anyone in.",
      },
      {
        step: 3,
        title: "Share Your Room ID",
        description: "Copy your unique room ID and share it with your connection so they can join.",
      },
      {
        step: 4,
        title: "Face-to-Face Connection",
        description: "Talk, laugh, and see each other in real-time. No time limits, completely free.",
      },
    ],
    ctaLink: "/video",
  },
  security: {
    id: "security",
    title: "Privacy & Security",
    icon: Shield,
    color: "from-purple-500 to-purple-600",
    steps: [
      {
        step: 1,
        title: "End-to-End Encryption",
        description: "All messages, media, and video calls are encrypted. Only you and your connection can access them.",
      },
      {
        step: 2,
        title: "Private by Default",
        description: "Your data is never sold or shared. No ads, no tracking, no data mining.",
      },
      {
        step: 3,
        title: "Your Control",
        description: "Manage who can connect with you. Delete your data anytime.",
      },
      {
        step: 4,
        title: "Secure Authentication",
        description: "PIN-based login keeps your account safe. Optional two-factor authentication available.",
      },
    ],
    ctaLink: "/profile",
  },
};

export default function Tutorial() {
  const [location] = useLocation();
  const tutorialId = location.split("/tutorials/")[1];
  
  const tutorial = tutorialId ? tutorialContent[tutorialId] : null;

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-[#f5f1e8]">
        <Header />
        <main className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-black text-[#4a453e] mb-4">Tutorial Not Found</h1>
            <p className="text-[#4a453e] opacity-60 mb-8">
              We couldn't find that tutorial. Check out our available guides below.
            </p>
            <Link href="/app">
              <Button className="bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = tutorial.icon;

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Header />
      
      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className={`h-20 w-20 rounded-full bg-gradient-to-r ${tutorial.color} flex items-center justify-center`}>
                <Icon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-[#4a453e] mb-4">{tutorial.title}</h1>
            <p className="text-[#4a453e] opacity-60 font-bold">
              Follow these steps to get started
            </p>
          </motion.div>

          <div className="space-y-6 mb-12">
            {tutorial.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Badge className={`h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-r ${tutorial.color} text-white font-black`}>
                        {step.step}
                      </Badge>
                      <span className="font-black text-[#4a453e]">{step.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#4a453e] opacity-70 font-bold ml-11">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            {tutorial.id === "video" && (
              <MediaTest
                trigger={
                  <Button
                    variant="outline"
                    className="gap-2 px-8 py-6 text-lg font-black"
                    size="lg"
                  >
                    <Video className="h-5 w-5" />
                    Test Camera & Mic
                  </Button>
                }
              />
            )}
            
            {tutorial.id === "video" ? (
              <MediaTest
                trigger={
                  <Button className="bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white px-8 py-6 text-lg font-black">
                    Try It Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                }
              />
            ) : (
              <Link href={tutorial.ctaLink}>
                <Button className="bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white px-8 py-6 text-lg font-black">
                  Try It Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <div className="mt-8">
              <Link href="/app">
                <Button variant="ghost" className="text-[#4a453e] hover:text-[#2458a0]">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
