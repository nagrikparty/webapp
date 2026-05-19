import { Link } from "@/i18n/routing";

export default function Footer() {
  return (
    <footer className="bg-stone-200/50 border-t border-black/10 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <FooterLink href="/manifesto" text="Manifesto" />
            <FooterLink href="/transparency" text="Transparency" />
            <FooterLink href="/constitution" text="Constitution" />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <FooterLink href="/media" text="Media" />
            <FooterLink href="/contact" text="Contact" />
            <FooterLink href="/join" text="Join" />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4">
            <FooterLink href="/privacy" text="Privacy Policy" />
            <FooterLink href="/terms" text="Terms & Conditions" />
            <FooterLink href="/transparency" text="Donation Transparency" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-black/10 pt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex flex-col space-y-2 text-black/60 font-english text-sm">
            <span className="text-black font-semibold tracking-wider">NAGRIK PARTY</span>
            <span>B-80, Street 8</span>
            <span>Ghaffar Manzil, Jamia Nagar</span>
            <span>Okhla, New Delhi – 110025</span>
          </div>
          
          <div className="text-right w-full md:w-auto">
            <h2 className="font-hindi text-4xl sm:text-5xl text-black font-semibold tracking-wide">
              काम दिखना चाहिए.
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <Link 
      href={href}
      className="text-black/70 hover:text-black font-english text-sm tracking-wide transition-colors inline-block"
    >
      {text}
    </Link>
  );
}
