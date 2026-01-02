import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { MessageSquare, Share2, Loader2, Heart, Users, Volume2, Plus } from "lucide-react";
import { GradientIcon } from "@/components/GradientIcon";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

function ConnectionsWidget({ relationships, isLoading }: { relationships: any[]; isLoading: boolean }) {
  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relationships.map((rel, i) => (
        <motion.div key={rel.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Link href={`/connection/${rel.targetId}`}>
            <Card className="h-full border shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {rel.otherUserName}
                  </CardTitle>
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /><span>Chat</span></div>
                  <div className="flex items-center gap-1.5"><Share2 className="h-4 w-4" /><span>Moments</span></div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: rawRelationships, isLoading } = useQuery<any[]>({
    queryKey: [`/api/relationships/1`],
  });

  const connections = rawRelationships && rawRelationships.length > 0 
    ? rawRelationships.map(rel => ({
        ...rel,
        otherUserName: rel.targetId === 2 ? "Jackson" : 
                       rel.targetId === 3 ? "Jude" : "Connection"
      }))
    : [
        { id: 102, targetId: 2, otherUserName: "Jackson" },
        { id: 103, targetId: 3, otherUserName: "Jude" },
      ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, Daddy!</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <Users className="h-5 w-5 text-blue-600" />
            My Connections
          </h2>
          <ConnectionsWidget relationships={connections} isLoading={isLoading} />
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Link href="/video">
          <Button className="rounded-full h-14 w-14 shadow-lg bg-blue-600 text-white p-0 flex items-center justify-center">
            <Volume2 className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
