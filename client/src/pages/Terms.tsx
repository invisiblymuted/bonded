import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BondedLogo } from "@/components/BondedLogo";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <BondedLogo className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-blue-800">Bonded</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Welcome to Bonded</h2>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your use of Bonded, a platform designed to help separated families 
                stay connected. By using Bonded, you agree to these Terms. Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Using Bonded</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground">Who Can Use Bonded</h3>
                  <p>
                    Bonded is available to anyone who creates an account. Children under 13 may use Bonded only with 
                    parental consent and supervision. Parents are responsible for their children's use of the platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Account Responsibilities</h3>
                  <p>
                    You are responsible for maintaining the security of your account and all activities that occur under it. 
                    Please use a strong password and keep your login credentials confidential.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Acceptable Use</h2>
              <p className="text-muted-foreground mb-3">When using Bonded, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the platform for its intended purpose of family connection</li>
                <li>Treat other users with respect and kindness</li>
                <li>Only connect with family members you know and trust</li>
                <li>Not share harmful, illegal, or inappropriate content</li>
                <li>Not attempt to access other users' accounts or data</li>
                <li>Not use the platform for commercial purposes without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Content You Create</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  You retain ownership of the content you create on Bonded (messages, photos, journal entries, etc.). 
                  By posting content, you grant us permission to store, display, and transmit that content to provide 
                  our services to you and your connected family members.
                </p>
                <p>
                  You are responsible for the content you share. Please do not share content that infringes on others' 
                  rights or violates any laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Family Connections</h2>
              <p className="text-muted-foreground">
                Bonded uses a connection system to link family members. Both parties must agree to connect. 
                You can remove a connection at any time, which will prevent further communication through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to keep Bonded available at all times, but we cannot guarantee uninterrupted service. 
                We may occasionally need to perform maintenance or updates that temporarily affect availability. 
                We are not liable for any disruptions to service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Privacy</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our <Link href="/privacy" className="bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent hover:underline">Privacy Policy</Link> to 
                understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Termination</h2>
              <p className="text-muted-foreground">
                You may close your account at any time. We may suspend or terminate accounts that violate these Terms 
                or engage in harmful behavior. Upon termination, your data will be deleted in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. We will notify you of significant changes through the platform 
                or via email. Continued use of Bonded after changes take effect constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Bonded is provided "as is" without warranties of any kind. To the maximum extent permitted by law, 
                we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms, please contact us at legal@bonded.app
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
