export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <img src="/placeholder.png" alt="FinBoard Logo" className="w-10 h-10" />
              <span className="font-semibold text-lg">FinBoard</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              FinBoard HQ, Virtual Workspace
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Bengaluru, India
            </p>
            <a
              href="#"
              className="text-sm text-primary hover:underline block mb-4"
            >
              Contact Us
            </a>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter">
                <svg
                  className="w-5 h-5 text-muted-foreground hover:text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.9 9.9 0 01-2.828.775..." />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg
                  className="w-5 h-5 text-muted-foreground hover:text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584..." />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg
                  className="w-5 h-5 text-muted-foreground hover:text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761..." />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-medium mb-3">FinBoard</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#">Stocks</a></li>
                <li><a href="#">ETFs</a></li>
                <li><a href="#">Mutual Funds</a></li>
                <li><a href="#">Commodities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#">Help & Support</a></li>
                <li><a href="#">Trust & Safety</a></li>
                <li><a href="#">Media & Press</a></li>
                <li><a href="#">Investor Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Disclosures</a></li>
                <li><a href="#">Bug Bounty</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FinBoard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
