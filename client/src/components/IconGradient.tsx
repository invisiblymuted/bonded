export default function IconGradient() {
  // Provides a document-level gradient definition and a small CSS rule
  // that targets common icon containers so SVG icons use the brand
  // green->blue gradient for their stroke.
  return (
    <>
      <svg width="0" height="0" className="absolute IconGradient" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2458a0" />
            <stop offset="45%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        /* Apply brand gradient to inline SVG icons used as UI symbols.
           Make them stroked (not solid) so icons appear as line icons. This
           targets common icon containers only so filled SVG logos are
           unaffected. */
        /* Icon stroke rules removed to avoid altering navigation / UI icons.
           Icons should use their own classes or inline props when a gradient
           stroke is desired. */

          /* Reusable text gradient class for large headings and prominent text.
            Use by adding the .brand-gradient-text class to any element. */
        .brand-gradient-text {
          background-image: linear-gradient(90deg, #2458a0 0%, #6b7280 45%, #FB923C 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Removed aggressive global vertical-tightening to preserve
           original section spacing and layout (Home tiles were being
           compressed). Use per-page utilities instead when needed. */

        /* Ensure main content clears the fixed header and keep a consistent
           page background so thin white lines between sections disappear. */
        main {
          padding-top: 5.25rem !important;
        }

        /* Add safe spacing at the top of the hero specifically */
        #home-hero {
          padding-top: 1.25rem !important;
        }

        /* Accent gradient (orange -> cream) for places that explicitly opt-in */
        .accent-fill svg,
        .accent-fill svg path,
        .accent-fill svg circle {
          fill: url(#accent-gradient) !important;
        }
      `}</style>
    </>
  );
}
