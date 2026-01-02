import { useState } from "react";
import { useEvents, useCreateEvent, useDeleteEvent, useRelationships } from "@/hooks/use-relationships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GradientIcon } from "@/components/GradientIcon";
import { TutorialPanel } from "@/components/TutorialPanel";
import { Loader2, Calendar as CalendarIcon, Users, Trash2, Gift, Phone, Bell, CalendarDays, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const calendarTutorialSteps = [
  {
    title: "Select a family member",
    description: "Choose who you want to share calendar events with from the dropdown."
  },
  {
    title: "Create an event",
    description: "Add a title, date, and time for birthdays, visits, calls, or reminders."
  },
  {
    title: "Choose an event type",
    description: "Select the type of event (birthday, visit, call, reminder, or general)."
  },
  {
    title: "Enable reminders",
    description: "Turn on notifications so you never miss an important date."
  },
  {
    title: "Manage your events",
    description: "View upcoming events and delete old ones when they're no longer needed."
  }
];

export default function Calendar() {
  const { data: relationships, isLoading: relationshipsLoading } = useRelationships();
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);

  const { data: events, isLoading: eventsLoading } = useEvents(selectedConnectionId || 0);
  const createEvent = useCreateEvent(selectedConnectionId || 0);
  const deleteEvent = useDeleteEvent(selectedConnectionId || 0);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("general");
  const [eventReminder, setEventReminder] = useState(true);

  const selectedConnection = relationships?.find(r => r.id === selectedConnectionId);
  const connectionName = (selectedConnection as any)?.otherUserName || selectedConnection?.childName || "Connection";

  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday": return <Gift className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "visit": return <CalendarDays className="h-4 w-4" />;
      case "reminder": return <Bell className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const handleCreateEvent = () => {
    if (eventTitle.trim() && eventDate && selectedConnectionId) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <GradientIcon icon={<CalendarIcon className="h-8 w-8" />} />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Shared Calendar</h1>
          </div>
          <p className="text-muted-foreground mb-6">Plan events and never miss important dates</p>

          <TutorialPanel
            featureKey="calendar"
            featureTitle="Shared Calendar"
            icon={<HelpCircle className="h-5 w-5" />}
            steps={calendarTutorialSteps}
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
                  <CardTitle className="flex items-center gap-2">
                    <GradientIcon icon={<CalendarIcon className="h-5 w-5" />} />
                    Add Event with {connectionName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="event-title" className="text-sm font-medium mb-2 block">
                      Event Title
                    </label>
                    <Input
                      id="event-title"
                      placeholder="Event title..."
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      data-testid="input-event-title"
                    />
                  </div>
                  <div>
                    <label htmlFor="event-date" className="text-sm font-medium mb-2 block">
                      Event Date & Time
                    </label>
                    <Input
                      id="event-date"
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      data-testid="input-event-date"
                    />
                  </div>
                  <div>
                    <label htmlFor="event-type" className="text-sm font-medium mb-2 block">
                      Event Type
                    </label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger id="event-type" data-testid="select-event-type">
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
                  </div>
                  <div>
                    <label htmlFor="event-description" className="text-sm font-medium mb-2 block">
                      Description (Optional)
                    </label>
                    <Textarea
                      id="event-description"
                      placeholder="Description (optional)..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      rows={2}
                      data-testid="input-event-description"
                    />
                  </div>
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
                <p className="text-center text-muted-foreground py-8">No events yet. Add your first event!</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
