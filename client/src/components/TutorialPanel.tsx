import { useState, useEffect, type ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GradientIcon } from "@/components/GradientIcon";
import { HelpCircle, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialStep {
  title: string;
  description: string;
}

interface TutorialPanelProps {
  featureKey: string;
  featureTitle: string;
  icon: ReactElement;
  steps: TutorialStep[];
}

export function TutorialPanel({ featureKey, featureTitle, icon, steps }: TutorialPanelProps) {
  const storageKey = `tutorial-dismissed-${featureKey}`;
  const [isDismissed, setIsDismissed] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    setIsDismissed(dismissed === "true");
  }, [storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "true");
    setIsDismissed(true);
  };

  const handleShowTutorial = () => {
    localStorage.removeItem(storageKey);
    setIsDismissed(false);
  };

  if (isDismissed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShowTutorial}
        className="gap-2 text-muted-foreground mb-4"
        data-testid="button-show-tutorial"
      >
        <HelpCircle className="h-4 w-4" />
        Show Tutorial
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-500/5 to-primary/5 border-primary/20">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <GradientIcon icon={icon} />
                  <CardTitle className="text-lg">How to use {featureTitle}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="button-toggle-tutorial">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismiss}
                    data-testid="button-dismiss-tutorial"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  className="mt-4 gap-2"
                  data-testid="button-got-it"
                >
                  <Check className="h-4 w-4" />
                  Got it, thanks!
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
