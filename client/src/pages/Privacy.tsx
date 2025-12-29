import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BondedLogo } from "@/components/BondedLogo";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <BondedLogo className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Bonded</span>
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
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Our Commitment to Your Privacy</h2>
              <p className="text-muted-foreground">
                At Bonded, we believe that maintaining family connections should never come at the cost of your privacy. 
                This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground">Account Information</h3>
                  <p>When you create an account, we collect your name, email address, and profile picture to personalize your experience.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Content You Create</h3>
                  <p>Messages, journal entries, photos, videos, and other content you share are stored to enable your family connections.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Usage Information</h3>
                  <p>We collect basic usage data to improve our service, including login times and feature usage patterns.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain the Bonded platform</li>
                <li>To enable communication between connected family members</li>
                <li>To send you important notifications about your account</li>
                <li>To improve our services and develop new features</li>
                <li>To ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Protect Your Data</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>We implement industry-standard security measures including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Secure data transmission using HTTPS encryption</li>
                  <li>Secure database storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited employee access to user data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Sharing</h2>
              <p className="text-muted-foreground">
                <strong className="text-foreground">We do not sell your personal data.</strong> We only share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Family members you've explicitly connected with on the platform</li>
                <li>Service providers who help us operate Bonded (under strict confidentiality agreements)</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Bonded is designed to be safe for families including children. We comply with applicable children's privacy laws 
                and require parental consent for users under 13. Parents can review and delete their children's information at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or your data, please contact us at privacy@bonded.app
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
