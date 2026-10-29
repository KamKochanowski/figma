# Technology map, October 2026: fast but ultra-modern portfolio (Astro + React islands, Cloudflare, maintained with Claude Code)

> Researched 2026-10-29 for Kamil Kochanowski's new hand-coded portfolio. Sources are 2025-2026 unless marked "(older)". Machine-readable datasets I read directly: npm registry metadata and download counts (api.npmjs.org, week 2026-10-21..27), the `web-features` Baseline package v3.44.0 (published 2026-10-22), the `caniuse-db` package v1.0.30001819 (data updated 2026-10-22), and `@mdn/browser-compat-data` v8.1.7 (2026-10-22). "Own calculation / own scan" means I derived it from those datasets or from the earlier research ([RESEARCH_PORTFOLIO.md](/home/user/figma/docs/portfolio/RESEARCH_PORTFOLIO.md), [LINKI.md](/home/user/figma/docs/portfolio/LINKI.md)), which I do not repeat except where I update it. Dataset links used throughout: Baseline = [web-features 3.44.0](https://registry.npmjs.org/web-features); compat = [MDN BCD 8.1.7](https://registry.npmjs.org/@mdn/browser-compat-data); usage = [caniuse-db](https://registry.npmjs.org/caniuse-db). Human-readable mirrors (not fetched by me): webstatus.dev, caniuse.com, MDN.

## 1. Browser support as of October 2026 (WebGPU, view transitions, scroll-driven animations, anchor positioning, @starting-style, popover/invokers, grid-lanes, oklch/color-mix, container queries, text-wrap, Speculation Rules)

### Takeaway
Almost everything on the list is usable today as progressive enhancement. Already Baseline: same-document View Transitions, popover, invoker commands, @starting-style, text-wrap: balance, container queries, color-mix/oklch and AVIF. Still not Baseline: WebGPU (Firefox partial, Linux limited), cross-document View Transitions and text-wrap: pretty and Speculation Rules (no Firefox), CSS Grid Lanes/masonry (Safari only). Scroll-driven animations reached all three engines only on 2026-10-27 (Firefox 159), so treat them as new.

### Cited Findings

#### Where the browsers are on 2026-10-29
- Chrome 156 shipped 2026-10-20; Chrome 153, 154, 155 shipped 2026-09-08, 09-22, 10-06 (two-week gaps). Edge 155: 2026-10-08. Firefox 158: 2026-10-13 (153-158 also at short intervals: 07-21, 08-18, 09-01, 09-15, 09-29, 10-13). Safari 27: 2026-09-14. — [web-features 3.44.0 "browsers" block](https://registry.npmjs.org/web-features)
- Firefox 159 was released 2026-10-27 and "Scroll-driven animations are now enabled by default". — [MDN Firefox 159 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159)
- Safari 27.0 notes were posted 2026-09-17, Safari 27.1 on 2026-10-23 (iPhone Duo support), Safari 27.2 on 2026-10-26. — [WebKit Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/), [27.1](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/), [27.2](https://webkit.org/blog/18515/webkit-features-for-safari-27-2/)
- 47 features reached Baseline "Newly available" in 2026 by 2026-10-22 (own count). Examples with dates: Navigation API and :active-view-transition 2026-01-13, shape() 2026-02-24, @scope 2026-03-24, contrast-color() 2026-04-10, name-only container queries 2026-05-07, :open 2026-05-11, container style queries 2026-05-19, field-sizing 2026-06-16, sibling-count()/sibling-index() 2026-08-18, light-dark() image values + overflow-anchor + top-level await + ariaNotify() 2026-09-14. — [web-features 3.44.0](https://registry.npmjs.org/web-features)
- Baseline definition: supported by all core browsers = "Newly available"; it becomes "Widely available" 30 months later. — [web.dev Baseline](https://web.dev/baseline)
- Interop 2026 (announced 2026-02-12 by Apple, Google, Igalia, Microsoft, Mozilla) includes as focus areas: anchor positioning, container style queries, dialogs and popovers (dialog closedby, :open, popover="hint"), scroll-driven animations, view transitions (incl. cross-document, blocking="render", link rel=expect), attr(), contrast-color(), custom highlights. — [web.dev Interop 2026](https://web.dev/blog/interop-2026)

#### WebGPU
- Chrome/Edge: 113-143 "supported on ChromeOS, macOS, and Windows" (partial); 144+ adds Linux "(Intel Gen12+ GPUs only)". Chrome Android 121. — [MDN BCD api.GPU](https://registry.npmjs.org/@mdn/browser-compat-data)
- Firefox: Windows since 141; macOS Tahoe on Apple silicon since 145; older macOS on Apple silicon since 147; not macOS on Intel CPUs; not Linux; not Firefox Android; not in service workers. — [MDN BCD api.GPU](https://registry.npmjs.org/@mdn/browser-compat-data)
- Safari 26 (macOS and iOS); caniuse marks desktop Safari "partial" (default-on only on macOS 26 Tahoe or later) and Firefox "partial". — [MDN BCD](https://registry.npmjs.org/@mdn/browser-compat-data), [caniuse-db notes](https://registry.npmjs.org/caniuse-db)
- Baseline status: not Baseline. caniuse global usage: 85.80% full + 3.66% partial. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- Safari 27.0 adds the WGSL clip_distances built-in. — [WebKit 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)
- three.js `WebGPURenderer` "can automatically fall back to using a WebGL 2 backend" when WebGPU is unavailable. — [three.js manual](https://threejs.org/manual/pages/webgpurenderer)

#### View Transitions
- Same-document View Transitions: Baseline Newly available since 2025-10-14 (Chrome 111, Firefox 144, Safari 18); caniuse 92.90%. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- Cross-document (@view-transition rule): Chrome/Edge 126, Safari 18.2, Firefox not supported (Firefox is "partial" in caniuse: Level 1 / same-document only). Not Baseline. caniuse 86.77% full + 2.04% partial. — [MDN BCD css.at-rules.view-transition](https://registry.npmjs.org/@mdn/browser-compat-data), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- Cross-document view transitions are an explicit Interop 2026 work item. — [web.dev Interop 2026](https://web.dev/blog/interop-2026)

#### CSS scroll-driven animations
- `animation-timeline`: Chrome/Edge 115, Safari 26, Firefox 159 (desktop and Android). — [MDN BCD css.properties.animation-timeline](https://registry.npmjs.org/@mdn/browser-compat-data), [MDN Firefox 159](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159)
- web-features 3.44.0 (published 2026-10-22, before Firefox 159) still lists it as not Baseline with support only in Chrome 115 and Safari 26. — [web-features](https://registry.npmjs.org/web-features)
- Scroll-driven animations are a new Interop 2026 focus area. — [web.dev Interop 2026](https://web.dev/blog/interop-2026)
- Motion (the library) "uses the browser's ScrollTimeline when possible" for hardware-accelerated scroll effects. — [motion.dev](https://motion.dev/)

#### Anchor positioning
- `anchor-name`: Chrome 125, Firefox 147, Safari 26. `position-area`: Chrome 129 (as `inset-area` from 125), Firefox 147, Safari 26. `position-anchor` with the final default value `normal`: Chrome 151, Firefox 151, Safari 27 (earlier versions are flagged partial because of a different initial value). — [MDN BCD](https://registry.npmjs.org/@mdn/browser-compat-data)
- Baseline: not yet (web-features lists only Safari 27 as fully supporting every sub-feature). caniuse: 0.78% full + 86.58% partial; Chrome and Firefox are partial because `position-visibility: anchor-valid / anchor-visible` is missing (Firefox also lacks animating `anchor()`/`anchor-size()`); Safari 27 is full. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db notes](https://registry.npmjs.org/caniuse-db)
- Safari 27.0 added transform-aware anchor positioning, changed the `position-anchor` default to `normal`, and added `anchor-valid`/`anchor-visible`. — [WebKit 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)
- Contradicting source: a third-party blog (May 2026) claims "Baseline 2026" added anchor positioning and cross-document view transitions; I could not confirm it and the Baseline dataset contradicts it. — [pravinkumar.co via web.dev search result](https://www.pravinkumar.co/blog/web-platform-baseline-features-webflow-custom-code-2026); contradicted by [web-features](https://registry.npmjs.org/web-features)

#### @starting-style, popover, invoker commands, dialog
- `@starting-style`: Chrome 117, Firefox 129, Safari 17.5; Baseline Newly available since 2024-08-06. — [web-features](https://registry.npmjs.org/web-features), [BCD](https://registry.npmjs.org/@mdn/browser-compat-data)
- Popover API: Chrome 116, Firefox 125, Safari 17 (iOS 18.3); Baseline Newly available since 2025-01-27. — [web-features](https://registry.npmjs.org/web-features)
- Invoker commands (`command` / `commandfor`): Chrome 135, Firefox 144, Safari 26.2; Baseline Newly available since 2025-12-12. — [web-features](https://registry.npmjs.org/web-features), [BCD](https://registry.npmjs.org/@mdn/browser-compat-data)
- Not yet cross-browser: `popover="hint"` (Chrome 151, Firefox 153), `dialog closedby` (Chrome 134, Firefox 141), interest invokers (Chrome 142 only), `corner-shape` (Chrome 139 only), container scroll-state queries (Chrome 133 only). — [web-features](https://registry.npmjs.org/web-features)
- Customizable `<select>`: Chrome 135, Safari 27, no Firefox; caniuse 69.98%. Safari 27.2 refined it. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db), [WebKit 27.2](https://webkit.org/blog/18515/webkit-features-for-safari-27-2/)

#### CSS masonry / Grid Lanes
- The spec feature formerly called masonry is now `display: grid-lanes`. Safari shipped it in 26.4 (March 2026); Safari 27.2 renamed `flow-tolerance` to `fit-tolerance` (old name kept as deprecated alias). Chrome and Firefox: not shipped (an older spec version is behind a flag). caniuse global support 12.49%. — [WebKit 27.2](https://webkit.org/blog/18515/webkit-features-for-safari-27-2/), [BCD css.properties.display.grid-lanes](https://registry.npmjs.org/@mdn/browser-compat-data), [caniuse-db](https://registry.npmjs.org/caniuse-db), [web-features "masonry" redirect to grid-lanes](https://registry.npmjs.org/web-features)

#### Color, container queries, typography
- `color-mix()` and `oklab()`/`oklch()` (feature "oklab"): Baseline Widely available since 2025-11-09 (Chrome 111, Firefox 113, Safari 16.2 / 15.4). caniuse: color() 95.14%, LCH/Lab 95.14%. Relative color syntax: Newly available (2024-09-16), caniuse 88.09% + 5.36% partial. `color-mix()` with more than two colors (variadic): Firefox 150 and Safari 27 only. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- `contrast-color()`: Newly available 2026-04-10 (Chrome 147, Firefox 146, Safari 26). `light-dark()`: Newly available 2024-05-13. — [web-features](https://registry.npmjs.org/web-features)
- Size container queries: Widely available since 2025-08-14 (Chrome 105, Firefox 110, Safari 16); caniuse 95.81%. Style queries: Newly available 2026-05-19 (caniuse 2.00% full + 90.86% partial). — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- `text-wrap: balance`: Newly available since 2024-05-13 (Chrome 114, Firefox 121, Safari 17.5); caniuse 88.84% + 4.74% partial. `text-wrap: pretty`: Chrome 117, Safari 26, no Firefox; not Baseline. — [web-features](https://registry.npmjs.org/web-features), [BCD css.properties.text-wrap.pretty](https://registry.npmjs.org/@mdn/browser-compat-data), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- Safari 27.0 fixed the combination of `-webkit-line-clamp` with `text-wrap: balance` and added scroll anchoring (`overflow-anchor`). — [WebKit 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)
- CSS `if()` function: caniuse 68.94%. `field-sizing`: Newly available 2026-06-16. — [caniuse-db](https://registry.npmjs.org/caniuse-db), [web-features](https://registry.npmjs.org/web-features)

#### Speculation Rules
- `<script type="speculationrules">`: Chrome/Edge 109; Safari 26.2 behind the "SpeculationRules prefetch" flag; Firefox "preview" with prefetch of URL lists only; Firefox Android none. Not Baseline. — [BCD html.elements.script.type.speculationrules](https://registry.npmjs.org/@mdn/browser-compat-data), [web-features](https://registry.npmjs.org/web-features)

#### Agent-related browser tooling (relevant to "maintained with Claude Code")
- Safari 27.0 ships a Safari MCP server so "Claude Code, Codex, or the agent of your choice" can control the browser window and see how code renders. — [WebKit 27.0, Safari MCP section](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)
- WebMCP ("a proposed web standard to help you build and expose structured tools for AI agents"): Chrome origin trial from Chrome 149; local testing via `chrome://flags/#enable-webmcp-testing`; page last updated 2026-10-07. — [Chrome for Developers: WebMCP](https://developer.chrome.com/docs/ai/webmcp)

### Inferences
- Safe with no fallback today (Baseline, 90%+ usage): container queries, color-mix/oklch, text-wrap: balance, popover + invoker commands, @starting-style, same-document View Transitions, AVIF/WebP, prefers-reduced-motion. Use as enhancement only: cross-document View Transitions (Firefox users simply get a normal navigation), scroll-driven animations (Firefox 159 is two days old), anchor positioning (basic anchoring works everywhere; `position-visibility` does not), `text-wrap: pretty`, Speculation Rules, Grid Lanes (Safari-only, needs a CSS grid or columns fallback), WebGPU (always keep the WebGL2 fallback).
- Own calculation of a lower bound for global coverage (usage from caniuse-db summed over Chrome, Chrome Android, Edge, Firefox, Firefox Android, Safari, iOS Safari versions at or above the BCD/web-features thresholds; Samsung/Opera/UC excluded, so true numbers are about 3-4 points higher; method validated against caniuse's own numbers): scroll-driven animations about 84% before Firefox 159 (higher now), cross-document VT about 85%, text-wrap: pretty about 84%, popover about 89%, invoker commands about 84%, Speculation Rules about 72% (Chromium only), JPEG XL about 60%. Source data: [caniuse-db](https://registry.npmjs.org/caniuse-db), [web-features](https://registry.npmjs.org/web-features).
- web-features lags real releases (Firefox 159 shipped after the 3.44.0 snapshot). Expect scroll-driven animations and possibly anchor positioning to flip to "Newly available" in the next dataset releases; re-check webstatus.dev before relying on the label.
- Chrome and Firefox now release every two weeks (visible in the release dates), so "latest" moves quickly; feature checks should use `@supports`/feature detection rather than version assumptions.
- Safari MCP and WebMCP mean an agent (Claude Code) can look at the site in a real browser engine; this is useful for a non-coder maintainer, and WebMCP is a possible future channel for "Claude-powered" portfolio features, but it is still an origin trial.

### Gaps
- Chrome 155/156 and Edge release notes were not read; Firefox 159's other features were not enumerated.
- caniuse-db has no entries for popover, scroll-driven animations, @starting-style, Speculation Rules, text-wrap: pretty or invoker commands, so those global shares are my own lower-bound estimates, not caniuse figures.
- No source found for when Chrome/Firefox will ship Grid Lanes, or Firefox WebGPU on Linux/Android (BCD only links Bugzilla bugs).
- BCD says Edge has no JPEG XL (Edge 155 listed after Chrome 155); I could not verify whether this is a data lag.

## 2. Libraries: Three.js (WebGPURenderer, TSL), R3F, OGL, GSAP, Lenis, Motion, Theatre.js, Rive, Spline, Unicorn Studio, Barba/Swup; what award-winning 2025-2026 portfolios use

### Takeaway
The creative-site stack is still vanilla three.js + GSAP (free, including SplitText/ScrollTrigger/Flip/MorphSVG) + Lenis; three.js is moving to WebGPURenderer/TSL but its own manual calls that renderer experimental. Motion fits React islands, Paper Shaders and Unicorn Studio give low-code shader looks (Paper has a "halftone cmyk" shader), Rive and Spline are optional with free-tier branding, and Theatre.js and Barba.js are effectively stale.

### Cited Findings

#### Versions, licences and adoption (npm; downloads are week 2026-10-21..27)
| Package | Latest (published) | Licence | Weekly downloads |
|---|---|---|---|
| three | 0.186.1 (2026-09-24) | MIT | 25.8 M |
| @react-three/fiber | 9.8.2 (2026-10-14) | MIT | 7.1 M |
| @react-three/drei | 10.7.9 (2026-09-25) | MIT | 4.7 M |
| gsap | 3.15.0 (2026-04-13) | "Standard 'no charge' license" | 6.5 M |
| lenis | 1.3.27 (2026-10-15) | MIT | 2.0 M |
| motion / framer-motion | 14.7.1 (2026-10-27) | MIT | 28.5 M / 56.0 M |
| ogl | 1.0.11 (2025-01-27) | Unlicense | 0.94 M |
| @theatre/core | 0.7.2 (2024-05-19) | Apache-2.0 | 20 K |
| @rive-app/canvas | 2.48.0 (2026-10-27) | MIT | 1.29 M |
| @splinetool/runtime | 2.0.118 (2026-10-28) | none declared | 0.67 M |
| unicornstudio-react | 2.4.0 (2026-10-11) | MIT | 106 K |
| @paper-design/shaders-react | 0.0.82 (2026-10-21) | Apache-2.0 | 1.04 M |
| swup | 4.10.0 (2026-09-03) | MIT | 46 K |
| @barba/core | 2.10.3 (2024-08-12) | MIT | 8.9 K |
| pixi.js | 8.22.0 (2026-10-01) | MIT | 1.44 M |

Sources: registry metadata per package at `https://registry.npmjs.org/<package>` (e.g. [three](https://registry.npmjs.org/three), [gsap](https://registry.npmjs.org/gsap), [lenis](https://registry.npmjs.org/lenis), [motion](https://registry.npmjs.org/motion), [ogl](https://registry.npmjs.org/ogl), [@theatre/core](https://registry.npmjs.org/@theatre/core), [@rive-app/canvas](https://registry.npmjs.org/@rive-app/canvas), [@splinetool/runtime](https://registry.npmjs.org/@splinetool/runtime), [unicornstudio-react](https://registry.npmjs.org/unicornstudio-react), [@paper-design/shaders-react](https://registry.npmjs.org/@paper-design/shaders-react), [swup](https://registry.npmjs.org/swup), [@barba/core](https://registry.npmjs.org/@barba/core)) and downloads at `https://api.npmjs.org/downloads/point/last-week/<package>` (e.g. [three](https://api.npmjs.org/downloads/point/last-week/three)).

#### three.js
- Release cadence in 2026: r183 2026-02-18, r184 2026-04-16, r185 2026-06-25, r186 2026-09-08 (0.186.1 on 09-24); in 2025 releases were near-monthly (0.178 2025-06-30 ... 0.182 2025-12-10). — [npm registry: three](https://registry.npmjs.org/three)
- The manual describes `WebGPURenderer` as the "next-generation renderer": WebGPU backend by default with automatic WebGL 2 fallback, node-based material system, TSL (JavaScript shading language that transpiles to WGSL or GLSL), and a new post-processing stack. Import from `three/webgpu` and `three/tsl`. — [three.js manual: WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer)
- Same manual lists migration limits: `ShaderMaterial`, `RawShaderMaterial` and `onBeforeCompile` are not supported (port to node materials/TSL); `EffectComposer` is not supported; "The renderer itself is still in an experimental state although its maturity level has been greatly improved"; `WebGLRenderer` "is still maintained and the recommended choice for pure WebGL 2 applications", with no plans for larger new features. — [three.js manual: WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer)
- Conflict: secondary guides say r182 (Dec 2025) made WebGPURenderer "the recommended renderer" with WebGLRenderer as fallback. — [Utsubo migration guide (search result, not opened)](https://www.utsubo.com/blog/webgpu-threejs-migration-guide); contradicted by the official manual above.
- The npm package ships `three.webgpu.js`, `three.tsl.js`, `three.core.js`, `three.module.js` builds. — [jsDelivr package listing three@0.186.1](https://data.jsdelivr.com/v1/packages/npm/three@0.186.1?structure=flat)
- A 2026 TSL/WebGPU example from Codrops: "CinemaSeatPreview" (three.js, WebGPU renderer and TSL, falls back to WebGL 2; no build step). — [codrops/CinemaSeatPreview README](https://cdn.jsdelivr.net/gh/codrops/CinemaSeatPreview@main/README.md)

#### React Three Fiber and OGL
- R3F 9.8.2 peers: React >=19 <19.4, three >=0.156; drei 10.7.9 peers React ^19 and R3F ^9. React latest is 19.3.1; `@astrojs/react` 7.1.2 supports React 17, 18 and 19. — [npm: @react-three/fiber](https://registry.npmjs.org/@react-three/fiber), [drei](https://registry.npmjs.org/@react-three/drei), [react](https://registry.npmjs.org/react), [@astrojs/react](https://registry.npmjs.org/@astrojs/react)
- OGL's last release is 1.0.11 on 2025-01-27 (about 21 months before today). — [npm: ogl](https://registry.npmjs.org/ogl)

#### GSAP
- GSAP is "now 100% free for all users, thanks to Webflow's support"; maintained by the GSAP team working at Webflow. — [gsap.com/pricing](https://gsap.com/pricing/)
- Licence ("Standard 'No Charge' GSAP License", Webflow): permitted for any website or app; prohibited only in tools that let users build visual no-code animations that compete with Webflow's visual animation builder. — [GSAP standard licence](https://gsap.com/standard-license/)
- The public `gsap@3.15.0` npm package contains ScrollTrigger, ScrollSmoother, SplitText, Flip, MorphSVGPlugin, DrawSVGPlugin, InertiaPlugin, Draggable, Observer, ScrambleTextPlugin, Physics2D, CustomEase/Bounce/Wiggle, MotionPath, GSDevTools. — [jsDelivr package listing gsap@3.15.0](https://data.jsdelivr.com/v1/packages/npm/gsap@3.15.0?structure=flat)
- Official GSAP "AI Skills" (MIT, Agent Skills format) teach agents correct GSAP usage and work with Claude Code (also via plugin marketplace); README repeats "all formerly Club GSAP plugins (SplitText, MorphSVG, etc.) are free ... including commercial use". — [greensock/gsap-skills README](https://cdn.jsdelivr.net/gh/greensock/gsap-skills@main/README.md)
- GSAP Showcase gallery has filters including Astro, Portfolio, Three.js, WebGL, Scroll Animation, Text Animation (see screenshot `gsap-showcase.jpg`). — [gsap.com/showcase](https://gsap.com/showcase/)

#### Lenis, Motion, Theatre.js, Barba/Swup, Pixi
- Lenis: MIT, entry points for React, Vue and Nuxt; showcase lists Lando Norris, Netflix Careers, Rockstar's GTA VI page, Google Cloud x Team USA, OFF+BRAND; claims "no CSS transforms, no hijacked scrollbars, no accessibility trade-offs" (vendor claim); has a Framer plugin. — [lenis.darkroom.engineering](https://lenis.darkroom.engineering/), [npm: lenis](https://registry.npmjs.org/lenis)
- Motion ("previously Framer Motion"): "Free and open source", React/Vue/JS, layout animations, springs, scroll animations, 3D (animates three.js), mini `animate` at 3.2 kb; paid Motion+ adds components, visual editing and an "AI Kit". — [motion.dev](https://motion.dev/)
- Theatre.js: `@theatre/core` last released 2024-05-19 and only 20 K weekly downloads. — [npm: @theatre/core](https://registry.npmjs.org/@theatre/core)
- Barba.js: `@barba/core` last released 2024-08-12 (8.9 K weekly downloads); Swup 4.10.0 released 2026-09-03 and `@swup/astro` 1.8.0 on 2026-02-14. — [npm: @barba/core](https://registry.npmjs.org/@barba/core), [swup](https://registry.npmjs.org/swup), [@swup/astro](https://registry.npmjs.org/@swup/astro)
- Despite that, Codrops still published Barba-based Astro tutorials in 2026 (see section 6), while its October 2026 "Interlude" starter replaced Barba with Astro's own ClientRouter. — [Codrops search listing](https://tympanus.net/codrops/2026/04/08/creating-custom-page-transitions-in-astro-with-barba-js-and-gsap/), [codrops/interlude README](https://cdn.jsdelivr.net/gh/codrops/interlude@main/README.md)

#### Rive, Spline, Unicorn Studio, Paper Shaders
- Rive: Free plan $0 ("Free exports play a Rive splash screen. Upgrade to remove it"); paid tiers listed at $9 and $32 (billing unit not captured); open-source runtimes; an AI "Agent" with limits. — [rive.app/pricing](https://rive.app/pricing)
- Spline: Free plan has limited personal files and "Web exports with watermark"; no watermark on web exports/embeds from the paid plans ($12-15 per seat/month, $25-30, $60-70); "Code & Self-hosted exports" only in the top plan; unlimited viewers on all plans. — [spline.design/pricing](https://spline.design/pricing)
- Unicorn Studio: scenes run on "a small (~50kb gzipped) JavaScript library"; embeds for Framer, Webflow, Figma Sites, React/Next.js, plain HTML; 75+ configurable effects; an "LLM instructions" button copies a prompt that teaches an AI agent to embed and control a scene; performance levers: layer downsample (0.25-1), `data-us-scale`, `data-us-dpi` (1-2; 2 is 4x the work of 1), `data-us-fps` cap (24/30/60/120), Flatten (beta); project-JSON loading is a "Legend plan" feature. — [Unicorn docs: Embed](https://www.unicorn.studio/docs/embed/), [Performance](https://www.unicorn.studio/docs/performance/), [overview](https://www.unicorn.studio/docs/)
- Conflict with earlier research: LINKI/RESEARCH noted Unicorn's runtime at ~29 KB; the current docs say ~50 KB gzipped (use the newer figure). — [Unicorn docs: Embed](https://www.unicorn.studio/docs/embed/)
- Paper Shaders: "ultra fast zero-dependency shaders"; includes image filters "paper texture", "fluted glass", "water", "image dithering", "halftone dots", "halftone cmyk", "lens distortion" plus mesh gradients, grain gradient, metaballs, god rays; packages Apache-2.0, version 0.0.82 (2026-10-21), React wrapper `@paper-design/shaders-react`. — [shaders.paper.design](https://shaders.paper.design/), [npm](https://registry.npmjs.org/@paper-design/shaders-react)

#### What award-winning portfolios actually use (own scan plus corroboration)
- Own scan (2026-10-22, regex on rendered HTML of 84 unique portfolios/studios that loaded, so bundled libraries are undercounted): `<canvas>`/WebGL 41 sites (49%), Lenis 23 (27%), three.js 22 (26%), Next.js 21 (25%), GSAP 12 (14%), Framer 9, Webflow 5, Astro 4, Nuxt 4, Unicorn Studio 2, Spline 1, React Three Fiber 0, Rive 0 (same picture as the earlier RESEARCH_PORTFOLIO.md). — own scan from [LINKI.md](/home/user/figma/docs/portfolio/LINKI.md) result files (`top`, `top2`, `top4` in the scratchpad)
- Subset of 22 unique sites that won or were nominated in Oct 2026 (CSSDA/Framer lists in LINKI.md): WebGL 19 (86%), Lenis 13 (59%), three.js 10 (45%), GSAP 6 (27%), Next.js 7 (32%), Framer 6 (27%), Astro 2 (Lee Holmes, Khanh Nguyen), Unicorn 2, Spline 1, R3F 0, Rive 0; median transferred weight 5,432 KB (sum of content-length headers, approximate). — own scan from [LINKI.md](/home/user/figma/docs/portfolio/LINKI.md) result file `top4`
- Corroboration: the 2026 Codrops Atelier North starter credits Astro, GSAP + ScrollTrigger and Lenis; the Codrops Interlude starter uses Astro ClientRouter, GSAP and three.js; Lenis's own showcase and GSAP's showcase are curated galleries of the same stack. — [atelier-north README](https://cdn.jsdelivr.net/gh/codrops/atelier-north@main/README.md), [interlude README](https://cdn.jsdelivr.net/gh/codrops/interlude@main/README.md)
- Anecdotal (search-result summary only, page not opened): an Awwwards jury member's blog says winners cluster around GSAP + ScrollTrigger and three.js, with Lenis synced to GSAP's ticker. — [hontran.dev](https://www.hontran.dev/blog/how-to-build-an-award-winning-portfolio-site)

### Inferences
- For Kamil: GSAP (free, with SplitText for type, Flip for layout, ScrollTrigger, MorphSVG) plus Lenis plus either a small vanilla three.js scene (WebGL2 now, WebGPURenderer/TSL optional) or Paper Shaders for print-inspired shader looks (halftone CMYK) matches what winners use and keeps the bundle small. R3F is hugely downloaded (7.1 M/week) yet 0 of 84 scanned portfolios exposed it, so the "creative studio" look is mostly vanilla three.js; R3F only makes sense if a React island owns the 3D scene.
- Use Motion only for React-island UI (layout animations); do not mix it with GSAP on the same element.
- Treat WebGPURenderer as opt-in: the manual itself keeps WebGLRenderer as the stable choice and loses `ShaderMaterial`/`EffectComposer`. A WebGL2-first scene that can be upgraded is lower risk for a non-coder maintainer.
- Avoid Theatre.js and Barba.js for a new build (stale releases); Swup or Astro's ClientRouter are the maintained options. OGL is small and fine but updates are slow.
- Spline free exports carry a watermark and Rive free exports show a splash, so for a personal brand site prefer Paper Shaders (Apache-2.0), Unicorn Studio (check plan), or hand-written shaders.
- npm download counts include CI and mirrors; they show relative scale, not site counts.

### Gaps
- Awwwards (blocked from this environment) gave no official technology statistics; my counts come from a regex scan that undercounts bundled GSAP and R3F and mixes studios with portfolios.
- Unicorn Studio's pricing page returned no readable content; free-tier branding rules are unknown.
- I did not read three.js release notes for r183-r186 (GitHub release pages are blocked here), only the manual and npm metadata.
- No source found for performance comparisons between WebGPURenderer and WebGLRenderer on portfolio-type scenes.

## 3. Frameworks: current Astro (view transitions/ClientRouter, content collections and content layer, image optimization, islands, server islands, Cloudflare adapter) versus Next.js, SvelteKit, Nuxt; fit for a designer maintaining via Claude Code

### Takeaway
Astro 7.4.4 (MIT, Cloudflare-owned since January 2026, platform-agnostic) is the best fit: static HTML by default, React only where needed as islands, an official workerd-based Cloudflare adapter, and explicit agent tooling (docs MCP server, agent-aware dev server, JSON logs). Next.js, SvelteKit and Nuxt are capable but bring a persistent client app, more JavaScript, and (for Next.js) a visible security-patch cadence.

### Cited Findings

#### Astro: status and timeline
- Current: astro 7.4.4 (2026-10-28), `@astrojs/cloudflare` 14.4.3, `@astrojs/react` 7.1.2; engines `node >=22.23.4`; the dependency list includes vite, rolldown, `@astrojs/compiler-rs`, `@astrojs/markdown-satteri`. — [npm: astro](https://registry.npmjs.org/astro), [@astrojs/cloudflare](https://registry.npmjs.org/@astrojs/cloudflare)
- Timeline: Astro joined Cloudflare 2026-01-16 ("stays open-source and MIT-licensed", "continues to support a wide set of deployment targets, not just Cloudflare", employees now at Cloudflare); Astro 6.0 on 2026-03-10; Astro 7.0 on 2026-06-22; 7.1 (07-16), 7.2 (08-06), 7.3 (09-03), 7.4 (10-15). — [Astro joins Cloudflare](https://astro.build/blog/joining-cloudflare/), [Astro blog index](https://astro.build/blog/)
- Astro 6.0: redesigned `astro dev` on Vite's Environment API so the "exact production runtime" runs in development; the rebuilt Cloudflare adapter runs workerd in development, prerendering and production with local bindings (KV, D1, R2, Durable Objects); built-in Fonts API (downloads and self-hosts fonts, generates fallbacks, adds preload links); Live Content Collections stable; CSP API stable; Vite 7, Zod 4, Shiki 4; Node 22+ required; experimental Rust compiler, queued rendering and route caching. — [Astro 6.0](https://astro.build/blog/astro-6/)
- Astro 7.0: Vite 8/Rolldown, Rust `.astro` compiler (oxc + Lightning CSS; no more HTML auto-correction, JSX-style whitespace and strictness), Sätteri (Rust) Markdown/MDX by default, queued rendering stable and default (about 2.4x faster), builds "15-61% faster" on Astro's benchmarks (Apple M4 Pro), Advanced Routing via `src/fetch.ts` (Hono-compatible), stable route caching with experimental CDN cache providers including `@astrojs/cloudflare/cache`, astro dev `--background`, automatic AI-agent detection, and JSON logging. — [Astro 7.0](https://astro.build/blog/astro-7/)
- Astro 7.4 (2026-10-15): `astro build --timings`, separate build and runtime image services, `notFound()` handler, experimental parallel prerendering; 7.3 adds a `finalize()` helper for Cloudflare custom worker entrypoints; 7.2 experimental incremental static builds; 7.1 CSP, pagination, dev server, content collection controls. — [Astro 7.4](https://astro.build/blog/astro-740/), [Astro blog index](https://astro.build/blog/)

#### Astro: islands, content, images, view transitions, Cloudflare
- Islands: most of the page is static HTML; client islands hydrate separately with directives such as `client:load` and `client:idle`; server islands (`server:defer`) render dynamic parts separately so the shell can be cached; React, Preact, Svelte etc. can be mixed. — [Astro docs: Islands](https://docs.astro.build/en/concepts/islands/)
- Content collections: defined in `src/content.config.ts` with `defineCollection()`, a required loader (built-in `glob()` and others for Markdown, MDX, YAML, JSON; community and custom loaders) and an optional Zod schema; live collections fetch at request time and "We suggest using build-time content collections whenever possible". — [Astro docs: Content collections](https://docs.astro.build/en/guides/content-collections/)
- Images: `<Image />` and `<Picture />` from `astro:assets`; `<Picture />` generates AVIF/WebP with a fallback; setting `layout` generates `srcset` and `sizes` automatically; images in `public/` are never optimized. — [Astro docs: Images](https://docs.astro.build/en/guides/images/)
- Cloudflare adapter `imageService` defaults to `'cloudflare-binding'` (Cloudflare Images binding at runtime); other options include `compile` (build-time, Sharp) and a `{ build, runtime }` pair. — [Astro docs: Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- View transitions are opt-in; `<ClientRouter />` adds client-side routing, `transition:name/animate/persist`, fallback control and "Automatic support for prefers-reduced-motion". Astro's own docs say native cross-document view transitions can be used in Astro and that, as browser APIs evolve, ClientRouter "will increasingly become unnecessary". — [Astro docs: View transitions](https://docs.astro.build/en/guides/view-transitions/)
- 2024 (older): zero-JS cross-document view transitions with `@view-transition { navigation: auto; }` after Chrome 126. — [Astro blog: Zero-JavaScript View Transitions](https://astro.build/blog/future-of-astro-zero-js-view-transitions/)
- Static sites need only `assets.directory` in `wrangler.jsonc`; on-demand sites use `@astrojs/cloudflare` (`astro add cloudflare`) with `nodejs_compat`; Cloudflare "recommends using Cloudflare Workers for new projects"; Workers Builds settings are build `npx astro build` and deploy `npx wrangler deploy`; Cloudflare Auto Minify can break hydration; use `not_found_handling: "404-page"` for a custom 404. — [Astro docs: Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)

#### Astro and AI-assisted maintenance
- Astro Docs MCP server (free, remote, open source): `claude mcp add --transport http astro-docs https://mcp.docs.astro.build/mcp`; docs also cover Claude Code CLI, Claude Code GitHub Action and Claude Desktop. — [Astro docs: Build with AI](https://docs.astro.build/en/guides/build-with-ai/)
- Astro 7 detects coding agents and runs `astro dev` in the background with a lockfile, `astro dev status/stop/logs`, a `/_astro/status` health endpoint and structured JSON logs. — [Astro 7.0](https://astro.build/blog/astro-7/)
- Cloudflare's docs have an "Agent setup" page with a Claude Code guide and "Copy as Markdown"/llms.txt on every page. — [Cloudflare Agent setup](https://developers.cloudflare.com/agent-setup/)
- Codrops' October 2026 Astro 7.3 starter footer reads "Made by Codrops with Claude" (observed on the live demo; see screenshot). — [interlude demo](https://interlude.crnacura.workers.dev/)

#### Adoption evidence
- State of JS 2025 meta-frameworks: Astro "#2 in usage (two years in a row), #1 in interest (four years), #1 in satisfaction (three years), #1 in positivity (three years)"; HTTP Archive "11.8% on mobile, 14.6% on desktop" (unit not defined in the post). Both quoted by Astro itself. — [Astro, What's new February 2026](https://astro.build/blog/whats-new-february-2026/)
- Astro npm downloads: about 360,000/week at start of 2025 to over 900,000 by end of 2025; the Cloudflare announcement says "almost 1,000,000 times per week". — [Astro 2025 in review](https://astro.build/blog/year-in-review-2025/), [Astro joins Cloudflare](https://astro.build/blog/joining-cloudflare/)
- npm API, week 2026-10-21..27: astro 9,022,948; next 76,391,424; svelte 7,408,692; nuxt 2,754,938; react 205,386,791; `@astrojs/react` 2,600,288. The jump from about 1 M to 9 M for Astro is unexplained (conflict with Astro's own numbers). — [npm downloads: astro](https://api.npmjs.org/downloads/point/last-week/astro), [next](https://api.npmjs.org/downloads/point/last-week/next), [svelte](https://api.npmjs.org/downloads/point/last-week/svelte), [nuxt](https://api.npmjs.org/downloads/point/last-week/nuxt)
- Award-site scan: Astro on 4 of 84 portfolios/studios (Lee Holmes, Khanh Nguyen, Stas Bondar, Cuberto), Next.js on 21. — own scan from [LINKI.md](/home/user/figma/docs/portfolio/LINKI.md)

#### Competing frameworks (Oct 2026)
- Next.js 16.4 released 2026-10-06; blog posts include "Ship less JavaScript in Next.js with your AI agent" (10-28); security items on 2026-10-08, 10-14 ("Next.js Security Update for Upstream Vulnerabilities") and an announced "November Security Release" (10-27). — [Next.js blog](https://nextjs.org/blog)
- Next.js on Cloudflare: `@opennextjs/cloudflare` 1.20.14 (MIT) and Cloudflare's `vinext` 1.4.0 ("Run Next.js apps on Vite. Drop-in replacement for the next CLI"). Cloudflare's 2026-02-24 post says one engineer used Claude in OpenCode to build it in a week for about $1,100 in tokens, with 4.4x faster builds and about 57% smaller client bundles on a single 33-route fixture ("measure compilation and bundling speed, not production serving performance"). — [npm: @opennextjs/cloudflare](https://registry.npmjs.org/@opennextjs/cloudflare), [npm: vinext](https://registry.npmjs.org/vinext), [Cloudflare blog: How we rebuilt Next.js with AI in one week](https://blog.cloudflare.com/vinext/)
- SvelteKit 3 released 2026-10-01 (Svelte 5.57); `@sveltejs/adapter-cloudflare` 8.0.1 targets Workers or Pages. — [Svelte blog](https://svelte.dev/blog), [npm: adapter-cloudflare](https://registry.npmjs.org/@sveltejs/adapter-cloudflare)
- Nuxt 4.6 released 2026-10-05 (server-agnostic `nuxt/server`, Vue Vapor support); Nuxt Fonts 1.0 (10-11), Nuxt DevTools v4 (10-27). — [Nuxt blog](https://nuxt.com/blog)

### Inferences
- Astro matches the brief: a portfolio is content-driven, so static HTML plus a few React islands (a WebGL hero, a Claude chat panel) keeps JavaScript off every case-study page, which helps LCP/INP and SEO. Case studies as Markdown/MDX in a content collection means a non-coder can ask Claude Code to add or edit a project without touching components.
- Astro-specific trade-offs: (a) islands are isolated, so a persistent WebGL canvas or audio across pages needs ClientRouter plus `transition:persist` or a shared store, whereas Next.js keeps one React tree; (b) ClientRouter is still useful because Firefox lacks cross-document view transitions, but it needs scripts to re-initialise after navigation; (c) Astro 7's compiler is strict (unclosed tags error, whitespace collapses like JSX), which affects AI-generated templates; (d) Node >=22.23.4 is required locally and in CI; (e) the vendor is now Cloudflare, so the Cloudflare path is the best-tested, but MIT licence and multi-host support are explicitly promised.
- Next.js is overkill for this site and carries a recurring security-update treadmill that a non-coder maintainer would feel; SvelteKit and Nuxt are fine frameworks but have smaller creative-dev ecosystems around GSAP/three templates (Codrops 2026 starters are Astro and React/Next-oriented) and no React-islands story.
- Claude Code fit: file-based routing, small `.astro` files, content collections, docs MCP, agent-aware dev server and JSON logs lower the chance that edits break the site. Guardrails still needed (CLAUDE.md with design tokens, per-branch preview deploys, a screenshot check using Playwright or Safari MCP) because the maintainer cannot review code.
- The 9 M weekly downloads of astro should not be quoted without caveat.

### Gaps
- No independent benchmark of Astro vs Next.js/SvelteKit/Nuxt on a portfolio-type site; State of JS figures are only quoted via Astro's own digest because the survey site is JavaScript-rendered.
- Astro's "Build with AI" page was only read for the MCP setup; other agent features (skills, AGENTS.md guidance) were not extracted.
- I did not evaluate Astro's `@astrojs/react` island hydration cost with three.js, nor server islands on the Workers free tier.
- Claude-powered features hosting (Workers calling the Claude API, AI Gateway, Workers AI) was not researched.

## 4. Media and performance: AVIF/WebP, video (AV1, H.265, HLS, Cloudflare Stream, Mux), responsive images, preloading, Core Web Vitals on WebGL-heavy sites, budgets, accessibility, SEO for case studies, privacy-friendly analytics

### Takeaway
Ship AVIF/WebP through Astro's image pipeline, keep the LCP element in HTML (an `<img>`, `<video poster>` or text, because `<canvas>` is not an LCP candidate), lazy-load WebGL code, use H.264 MP4 as the universal video baseline (AV1 and HEVC are not universal), put long video on Cloudflare Stream or Mux, honor `prefers-reduced-motion`, rely on static HTML for SEO, and measure with a cookieless analytics tool.

### Cited Findings

#### Image and video formats
- AVIF: Baseline Widely available since 2026-07-25; caniuse 96.33%. WebP: Widely available since 2023-03-16; caniuse 97.08%. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- JPEG XL: Chrome 155 (released 2026-10-06), Firefox 158 (2026-10-13), Safari 17 (no animation); BCD lists Edge as unsupported; not Baseline; caniuse 43.26% full + 16.93% partial. — [MDN BCD mediatypes.image.jxl](https://registry.npmjs.org/@mdn/browser-compat-data), [caniuse-db](https://registry.npmjs.org/caniuse-db)
- Video codecs (caniuse global): H.264 MP4 97.49%, WebM 96.41% (+0.84% partial), AV1 79.04% full + 16.93% partial, HEVC/H.265 19.99% full + 74.95% partial (hardware/OS dependent). `loading="lazy"` on video/audio: Chrome 150 only, 67.22%. — [caniuse-db](https://registry.npmjs.org/caniuse-db), [web-features loading-lazy-media](https://registry.npmjs.org/web-features)
- `loading="lazy"` for images: Widely available (2026-06-19); `fetchpriority`: Newly available since 2024-10-29; `<link rel=preload>` Widely available; `content-visibility`: Newly available 2025-09-15; `sizes="auto"`: Chrome 126, Firefox 150 only. — [web-features](https://registry.npmjs.org/web-features)
- Safari 27.0 improves HDR images with gain maps and lets WebCodecs override the hardware decoder colour space. — [WebKit 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)
- Cloudflare Stream: storage $5 per month per 1,000 minutes (prepaid); delivery $1 per 1,000 minutes delivered; delivery counted by segment requests (4-second segments for uploads), and client-side preloading/buffering counts as billable delivery; HLS and DASH playback. — [Cloudflare Stream pricing](https://developers.cloudflare.com/stream/pricing/)
- Mux: Free plan with 100K free monthly delivery minutes, up to 10 videos stored, on-demand only, no credit card; Pay-as-you-go has no storage limit, live and on-demand, $20 monthly usage credit. — [mux.com/pricing](https://www.mux.com/pricing)
- Cloudflare Images Free plan: 5,000 unique transformations per month for images stored elsewhere (e.g. R2). — [Cloudflare Images pricing](https://developers.cloudflare.com/images/pricing/)
- Cloudflare per-file limit for Workers static assets is 25 MiB (relevant to hosting video in the repo). — [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Browser-side image tooling from Codrops (2026-10-17): "Build a Browser-Based Image Compression Previewer with libvips-wasm". — [Codrops all-posts listing](https://tympanus.net/codrops/all-posts/)

#### Core Web Vitals and WebGL
- Targets at the 75th percentile: LCP within 2.5 s, INP 200 ms or less, CLS 0.1 or less. — [web.dev: Web Vitals](https://web.dev/articles/vitals)
- LCP candidates are `<img>` (first-frame time for animated GIF/PNG), `<image>` inside `<svg>`, `<video>` (poster or first frame), elements with a CSS `url()` background image, and block-level text elements; `<canvas>` is not in the list and "restricting the elements to this limited set was intentional". — [web.dev: LCP](https://web.dev/articles/lcp)
- Astro ships islands lazily: `client:idle`/`client:visible` style directives; the Codrops Interlude starter loads three.js "only when a WebGL transition is about to be triggered". — [Astro docs: Islands](https://docs.astro.build/en/concepts/islands/), [Codrops Interlude summary](https://tympanus.net/codrops/?p=123511)
- Astro's Fonts API self-hosts fonts and adds preload hints "keeping your site fast and your users' data private". — [Astro 6.0](https://astro.build/blog/astro-6/)
- Unicorn Studio's performance guide: halving scale cuts pixels by 75%; most ambient scenes look the same at DPI 1 and 30 fps. — [Unicorn docs: Performance](https://www.unicorn.studio/docs/performance/)
- Measured now (sum of response content-length headers in KB, so approximate and likely an undercount; headless Chromium with software WebGL; first load after 8-24 s): Codrops Interlude home 47 KB; apple-style-portfolio 122 KB; kaiseisadatoki portfolio 79 KB; Atelier North 3,769 KB; Juan Mora Romero 2,461 KB; Maria Vasilyeva 2,320 KB; Lenis showcase 7,429 KB; GSAP showcase 18,164 KB; Unicorn Studio home 123,950 KB. Earlier scan (same method): median 4,065 KB across the 81 sites with size data, 5,432 KB for the 22 awarded/nominated sites, maxima 133,108 KB and 76,595 KB; lightweight outliers Joliot 295 KB, Sun Hung 418 KB. — own measurement (2026-10-29, script `shots.js`); earlier scan from [LINKI.md](/home/user/figma/docs/portfolio/LINKI.md)

#### Accessibility
- `prefers-reduced-motion` is Baseline Widely available since 2022-07-15; caniuse 97.22%. MDN: animations such as "scaling or panning large objects can be vestibular motion triggers" and should be toned down under the media query. — [web-features](https://registry.npmjs.org/web-features), [caniuse-db](https://registry.npmjs.org/caniuse-db), [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- Astro's ClientRouter has automatic `prefers-reduced-motion` support. — [Astro docs: View transitions](https://docs.astro.build/en/guides/view-transitions/)
- Keyboard-operable WebGL example: CinemaSeatPreview documents arrow-key seat navigation, Enter/Esc/Space/A/S shortcuts and tab-in map navigation. — [CinemaSeatPreview README](https://cdn.jsdelivr.net/gh/codrops/CinemaSeatPreview@main/README.md)
- `ariaNotify()` became Baseline Newly available on 2026-09-14 (announce dynamic updates to screen readers). — [web-features](https://registry.npmjs.org/web-features)

#### SEO for case studies
- Google: "server-side or pre-rendering is still a great idea because it makes your website faster for users and crawlers, and not all bots can run JavaScript"; Googlebot renders JS with an evergreen Chromium, queues rendering, and recommends unique `<title>` elements and meta descriptions. — [Google Search Central: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- `@astrojs/sitemap` 3.7.4 is current. — [npm: @astrojs/sitemap](https://registry.npmjs.org/@astrojs/sitemap)

#### Privacy-friendly analytics
- Cloudflare Web Analytics: available on all plans, "without compromising user privacy", with Core Web Vitals views. — [Cloudflare Web Analytics docs](https://developers.cloudflare.com/web-analytics/)
- Plausible: vendor states no cookies, "No cookie banner required", open source, EU-hosted, 30-day free trial without a card (paid afterwards). — [plausible.io](https://plausible.io/)
- Umami Cloud: Hobby $0 with up to 100K events per month; Pro $20 per month with 1 million events. — [umami.is/pricing](https://umami.is/pricing)

### Inferences
- Because `<canvas>` is not an LCP candidate, a WebGL hero will not hurt LCP by itself, but if the headline or poster arrives only after the canvas boots, LCP is delayed. Render the title and poster image in HTML and fade the canvas in later; keep the heavy JS behind `client:visible`/dynamic import.
- Safe media recipe: AVIF + WebP + JPEG through `<Picture />` with `layout`, MP4 (H.264) loops for short motion (muted, `playsinline`, poster) with optional AV1 `<source>` first; Cloudflare Stream or Mux for reels (a 20-30 s reel is cheap on either); JPEG XL is too new to depend on.
- Performance budget: no official standard was found. The measured set shows lightweight winners exist (Interlude about 47 KB, kaiseisadatoki about 79 KB, Sun Hung 418 KB and Joliot 295 KB in the earlier scan) versus medians of about 4,000-5,400 KB; a budget in the 1-2 MB range for the first view (excluding lazy WebGL and video) is achievable and well below the median, but this is my recommendation, not a sourced rule.
- Accessibility pattern: wrap GSAP/Lenis/WebGL starts in a `prefers-reduced-motion` check (GSAP `matchMedia` or CSS), keep a visible "fast mode" toggle, keep keyboard and focus order in the DOM, and use `ariaNotify()`/ARIA live regions for dynamic updates.
- SEO: Astro's static HTML per case study (title, description, OG image, JSON-LD) is the safe path; a chat or WebGL island must not be the only place the case-study text exists.
- Cloudflare Web Analytics is the zero-cost option already inside the platform; Plausible/Umami are the paid or capped alternatives. GDPR/ePrivacy compliance was not verified here.

### Gaps
- No authoritative performance-budget source and no CrUX/HTTP Archive data on Core Web Vitals for WebGL-heavy portfolios were found.
- W3C WCAG 2.2 Understanding pages (2.2.2 Pause/Stop/Hide, 2.3.3 Animation from Interactions) could not be fetched (empty responses), so WCAG criteria are not cited.
- three.js performance guidance (DPR clamps, instancing, dispose) was not read; only Unicorn's levers are cited.
- Cloudflare AI-crawler controls (relevant to protecting portfolio imagery from scraping) were not researched.
- Plausible's price list and Unicorn Studio pricing were not captured; legal assessment of "no cookie banner" claims is out of scope.

## 5. Hosting: Cloudflare Workers with static assets vs Cloudflare Pages, Vercel, Netlify; free-tier limits, custom domain, deploy from GitHub, previews

### Takeaway
Cloudflare now tells new projects to use Workers (static assets), not Pages. Static-asset requests are free and unlimited, GitHub deploys with per-branch preview URLs come from Workers Builds (3,000 free build minutes), and a custom domain needs the zone on Cloudflare DNS. Vercel Hobby forbids commercial use (a concern for a freelancer with a B2B company); Netlify's free tier is a 300-credit monthly budget.

### Cited Findings

#### Workers (static assets) versus Pages
- Cloudflare Pages docs (last updated 2026-08-25): "Are you sure you want to use Pages? Workers supports most Pages use cases and offers a broader feature set ... It is Cloudflare's primary platform for building applications. Start new projects with Workers." Pages Free plan: 500 deploys per month. — [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Migration guide (updated 2026-10-12): Pages config `pages_build_output_dir` becomes `assets.directory`; "requests for static assets on Workers are free" and Pages Functions invocations are billed like Workers; Workers adds Durable Objects, Cron Triggers and fuller observability; SPA/404 handling must be set explicitly (`not_found_handling`). — [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- Astro's docs repeat: "Cloudflare recommends using Cloudflare Workers for new projects". — [Astro docs: Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
- Pricing: "Requests to static assets are free and unlimited"; Workers Paid plan has a $5 per month minimum; Workers Free allows 100,000 requests per day (Worker invocations). — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Static asset limits: 20,000 files per Worker version on Free (100,000 on Paid); 25 MiB per file. — [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Workers Builds (Git integration for GitHub or GitLab): production-branch builds create a new version; other branches create Previews with a Preview URL, which supported providers can post as a pull-request comment; connecting a repo without a Wrangler config triggers an automatic PR that configures the project and generates a preview; build and log retention 90 days; the Worker name in the dashboard must match the Wrangler config name. — [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- Workers Builds limits: Free 3,000 build minutes per month, 1 concurrent build, 20-minute timeout, 2 vCPU, 8 GB RAM; Paid 6,000 minutes, 6 concurrent builds, 4 vCPU. — [Workers Builds limits](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)
- Version URLs: `<version-prefix>-<worker-name>.<subdomain>.workers.dev`, optional alias via `wrangler versions upload --preview-alias staging`, public unless protected with Cloudflare Access. — [Workers Version URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- Custom Domains: require an active Cloudflare zone; "You cannot create a Custom Domain on a hostname with an existing CNAME DNS record"; Cloudflare creates the DNS records and certificates; add in dashboard (Settings > Domains & Routes > Add > Custom Domain) or Wrangler. — [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- Evidence the path works for WebGL/GSAP sites: Codrops hosts its Astro demos (Interlude, Atelier North) on `*.workers.dev`. — [interlude demo](https://interlude.crnacura.workers.dev/), [atelier-north README](https://cdn.jsdelivr.net/gh/codrops/atelier-north@main/README.md)

#### Vercel and Netlify
- Vercel Hobby is free "aimed at developers with personal projects" and "restricts users to non-commercial, personal use only" (fair-use guidelines); includes first 100 GB Fast Data Transfer, 5,000 image transformations; 100 deployments per day on Hobby vs 6,000 on Pro; Pro seats $20 per user per month. — [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- Netlify Free: "$0 forever", unlimited deploy previews, custom domains with SSL, global CDN, credit-based usage with a 300 credit monthly limit; costs: production deploy 15 credits each, bandwidth 20 credits per GB, web requests 2 credits per 10,000; Personal plan 1,000 credits per month; new projects start private until published. — [Netlify pricing](https://www.netlify.com/pricing/)

### Inferences
- Recommended: Cloudflare Workers with static assets for a static Astro build (no adapter needed; only add `@astrojs/cloudflare` when a server route such as a Claude proxy is added), connected to GitHub through Workers Builds so every branch gets a preview URL and merges to main deploy production. 3,000 build minutes is far more than a portfolio needs.
- Static pages cost nothing at any traffic level; Worker invocations (a chat endpoint) count against 100,000 per day on Free, so rate limiting is advisable.
- Large video must not live in the repo (25 MiB/file cap and deploy size); use Stream/Mux/R2.
- Domain: moving DNS for the portfolio domain to Cloudflare is required for Custom Domains (or use the free workers.dev address temporarily); a hostname with an existing CNAME must be cleared first.
- Vercel Hobby's non-commercial clause is risky for a senior freelancer with a B2B company who uses the site to win clients; Netlify's free credits (about 20 deploys or 15 GB of bandwidth equivalents before limit) are tighter than Cloudflare's unlimited static requests. This reading of "commercial use" is mine; confirm with Vercel's fair-use text.

### Gaps
- Cloudflare's fair-use language for unlimited static bandwidth was not read; custom-domain steps for Vercel/Netlify and registrar-specific steps for a .pl domain were not researched.
- Workers Builds behaviour with monorepos, private repos and PR-comment setup for GitHub specifically was not tested; Cloudflare's new "Artifacts" Git hosting was seen but not evaluated.

## 6. Open-source award-winning portfolios, Codrops 2025-2026 tutorials (WebGL image transitions, galleries, shaders, scroll and text effects), licences, what to borrow, screenshots

### Takeaway
The best matches for the planned stack are three MIT-licensed Codrops starters from October 2026: Interlude (Astro 7.3 + ClientRouter + GSAP + three.js WebGL transitions), Atelier North (Astro + GSAP + Lenis, pixel transitions) and CinemaSeatPreview (three.js WebGPU + TSL with WebGL fallback), plus Bruno Simon's MIT "folio-2025" and Paper Shaders for print-style shader looks. Codrops itself blocks automated access except its first listing page.

### Cited Findings

#### Open-source code worth borrowing (licence checked)
- codrops/interlude: starter for custom page transitions in Astro, "built on Astro's own client router", 21 cover-and-reveal transitions in `src/transitions/` (curtain, wipe, columns, circle, typewriter, stack, slide-over, peel, slices, frame, carousel, cube, corner, tear, dither, dissolve, ink, spiral, velvet, particles, channel), WebGL ones need three.js (loaded lazily), "Built with Astro 7.3", needs Node 22.12+, MIT, copy files into your site and keep the licence notice; created 2026-10-06, 43 stars. — [README](https://cdn.jsdelivr.net/gh/codrops/interlude@main/README.md), [LICENSE (MIT, Codrops 2026)](https://cdn.jsdelivr.net/gh/codrops/interlude@main/LICENSE), [GitHub](https://github.com/codrops/interlude), [demo](https://interlude.crnacura.workers.dev/), [article](https://tympanus.net/codrops/?p=123511)
- codrops/atelier-north (tutorial "Building a Minimal Architecture Studio Landing Page with Astro & GSAP", 2026-10-09, by Kaisei Sadatoki): scroll-driven pixel transition between sections and a canvas-based pixel reveal for project images; Astro, GSAP + ScrollTrigger, Lenis, Kode Mono and Anton fonts; README says MIT but the `LICENSE` file was not found by jsDelivr and GitHub reports no licence, so verify before reuse. — [README](https://cdn.jsdelivr.net/gh/codrops/atelier-north@main/README.md), [GitHub](https://github.com/codrops/atelier-north), [demo](https://atelier-north.crnacura.workers.dev/), [article](https://tympanus.net/codrops/2026/10/09/architecture-studio-astro-gsap/)
- codrops/CinemaSeatPreview (2026-10-15): three.js WebGPURenderer + TSL with WebGL 2 fallback, film-lit room, 3D positional sound, keyboard controls, no build step, MIT; film clip "Charge" (c) Blender Foundation under CC BY 4.0. — [README](https://cdn.jsdelivr.net/gh/codrops/CinemaSeatPreview@main/README.md), [LICENSE](https://cdn.jsdelivr.net/gh/codrops/CinemaSeatPreview@main/LICENSE), [demo](https://tympanus.net/Demos/CinemaSeatPreview/)
- Other Codrops MIT repos pushed in Oct 2026: OnScrollColumnsRows (GSAP, 120 stars), ElasticGridScroll (61), SlideshowAnimations (307), DoubleImageHoverEffects (82), MotionTrailAnimations (77), 3DCarousel (60), RotatingOnScrollAnimations (44), isle-thorne-collective (Astro furniture-shop template with content collections, Tailwind and page transitions, MIT, 13 stars); also KineticTypePageTransition (2025-05, MIT, 127 stars) and ScrollTextMotion (2025-12, MIT). Org licence text: "MIT License, Copyright (c) 2009 - 2026 Codrops". — [GitHub search of org codrops](https://github.com/codrops), [CinemaSeatPreview LICENSE](https://cdn.jsdelivr.net/gh/codrops/CinemaSeatPreview@main/LICENSE)
- itsyujay/apple-style-portfolio: Astro + Tailwind + GSAP + Three.js + React portfolio template, MIT, 34 stars, pushed 2026-10-21; optional paid support ($75 commercial sponsorship, $199 ship-assist, $499 per year agency plan) while the licence stays MIT. — [README](https://cdn.jsdelivr.net/gh/itsyujay/apple-style-portfolio@main/README.md), [GitHub](https://github.com/itsyujay/apple-style-portfolio), [demo](https://apple-style-portfolio.yujay.dev/)
- brunosimon/folio-2025 (site bruno-simon.com): MIT, 1,993 stars, 342 forks, last push 2026-04-07; folio-2019: MIT, 4,751 stars, 1,030 forks. — [folio-2025](https://github.com/brunosimon/folio-2025), [folio-2019](https://github.com/brunosimon/folio-2019)
- Paper Shaders: Apache-2.0 npm packages; "halftone cmyk" filter with CMYK colour, gain and flood controls and presets (Default, Drops, Newspaper, Vintage). — [shaders.paper.design/halftone-cmyk](https://shaders.paper.design/halftone-cmyk), [npm](https://registry.npmjs.org/@paper-design/shaders)
- greensock/gsap-skills (MIT): official skills for Claude Code and other agents. — [README](https://cdn.jsdelivr.net/gh/greensock/gsap-skills@main/README.md)

#### Codrops tutorials 2025-2026 relevant to portfolio effects (titles and dates from listings; article bodies not readable, see Gaps)
- 2026-10-28 "Paper, Curated: The Tutorials, Tips, Tools, and People Worth Following"; 2026-10-27 "Songs of Hyrule: ... a Three.js Mini-Game in a Few Days"; 2026-10-26 "Animating with Agents: Building a Kinetic Type Site with GSAP and the Animaxxing Skills" (agent-driven GSAP type animation). — [Codrops all-posts](https://tympanus.net/codrops/all-posts/)
- 2026-10-22 "Juan Mora Romero '26: An Endless Lab, a Channel Split and Posters That Move Like Cloth"; 2026-10-20 "When a Website Becomes a Melody: Inside Maria Vasilyeva's Portfolio"; 2026-10-24 "Built to Move: Carmen Ansio's Obsession with Motion and the Platform". — [Codrops all-posts](https://tympanus.net/codrops/all-posts/)
- 2026-10-21 "Atelier UI: Mixing WebGL and the DOM in a React UI Library"; 2026-10-19 "Designing in Paper as a Developer: Taking Paper Shaders off the Background"; 2026-10-18 "Real Folds, Real Fire: Building a React Library for Sheets That Bend and Burn" (paper-like effect, relevant to a print-minded designer); 2026-10-17 "Build a Browser-Based Image Compression Previewer with libvips-wasm". — [Codrops all-posts](https://tympanus.net/codrops/all-posts/)
- 2026-10-13 "Typography That Leaves a Trace: Building Scroll-Driven Ghost Trails with GSAP"; 2026-10-12 "Chasing the Moment: Making a Short Film for the Browser with Three.js and GLSL"; 2026-10-09 "Building a Minimal Architecture Studio Landing Page with Astro & GSAP"; 2026-10-08 "Building Parallel Page Transitions with GSAP and React Router". — [Codrops all-posts](https://tympanus.net/codrops/all-posts/)
- Early Oct 2026 "Interlude: A Starter for Custom Page Transitions in Astro" (21 transitions; Three.js loads only for WebGL transitions). — [Codrops article](https://tympanus.net/codrops/?p=123511)
- 2026-08-25 "Building a Mouse-Following Square Lens Effect with Three.js and GLSL" (lens bulge and RGB shift in the fragment shader). — [Codrops article](https://tympanus.net/codrops/2026/08/25/building-a-mouse-following-square-lens-effect-with-three-js-and-glsl/)
- 2026-05-06 "From Shader Uniforms to Clip-Path Wipes: How GSAP Drives My Portfolio". — [Codrops article](https://tympanus.net/codrops/2026/05/06/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio/)
- 2026-04-08 "Creating Custom Page Transitions in Astro with Barba.js and GSAP" (synced reveal to WebGL, SVG morphing, overlay effects). — [Codrops article](https://tympanus.net/codrops/2026/04/08/creating-custom-page-transitions-in-astro-with-barba-js-and-gsap/)
- 2026-02-02 "Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js". — [Codrops article](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- 2026 (about June; exact date unknown) "Building Persistent Page Transitions with WebGPU and Vanilla JavaScript". — [Codrops article](https://tympanus.net/codrops/?p=116944)
- 2026 (date not captured) "Joffrey Spitzer Portfolio: A Minimalist Astro + GSAP Build with Reveals, Flip Transitions and Subtle Motion". — [Codrops article](https://tympanus.net/codrops/?p=108883)
- 2025 (older): "Stas Bondar '25: The Code & Techniques Behind a Next-Level Portfolio" (earlier scan: Astro + three + GSAP + Lenis); 2025-01-22 "WebGL Shader Techniques for Dynamic Image Transitions" (circle SDFs, noise patterns, texture integration). — [Stas Bondar article](https://tympanus.net/codrops/?p=89194), [author listing](https://tympanus.net/codrops/author/arlindaliu)

#### Screenshots (saved at `/home/user/figma/docs/portfolio/research_notes/Portfolio 2026 rekruterzy trendy i Claude/screens/technologia/`, JPG q75, 1440x900, headless Chromium with software WebGL; page weights are content-length sums)
| File | URL | What it shows and what to borrow |
|---|---|---|
| `interlude-astro-gsap-webgl-transitions.jpg` | [interlude.crnacura.workers.dev](https://interlude.crnacura.workers.dev/) | Home is one sentence of 21 transition names (overlays, moving the page, shaders); footer "Built on Astro's ClientRouter and GSAP, WebGL with Three.js, MIT licence, Made by Codrops with Claude"; about 47 KB first load. Borrow the transition engine. |
| `atelier-north-astro-gsap-lenis.jpg` | [atelier-north.crnacura.workers.dev](https://atelier-north.crnacura.workers.dev/) | Kinetic outline type "WHO WE ARE", dotted-frame grid, pixel reveals; Astro + GSAP + Lenis. Borrow scroll-driven pixel transitions. |
| `apple-style-astro-template.jpg` | [apple-style-portfolio.yujay.dev](https://apple-style-portfolio.yujay.dev/) | Minimal Astro template with floating three.js spheres. Borrow the project skeleton (MIT). |
| `threejs-webgpu-tsl-galaxy-example.jpg` | [threejs.org/examples/webgpu_tsl_galaxy.html](https://threejs.org/examples/webgpu_tsl_galaxy.html) | three.js WebGPURenderer + TSL galaxy with parameter GUI; rendered via the WebGL 2 fallback in headless Chromium. |
| `paper-shaders-halftone-cmyk.jpg` | [shaders.paper.design/halftone-cmyk](https://shaders.paper.design/halftone-cmyk) | CMYK halftone filter on a photo with C/M/Y/K colour, size, grid-noise, gain and flood controls. Strong fit for a print/packaging art director. |
| `juan-mora-romero-portfolio-2026.jpg` | [juanmoraromero.com](https://www.juanmoraromero.com/) | Grain-textured dark grid, big sans statement, photo strip, geometric shapes; client "Villiers"; CSSDA Website of the Day per earlier research ([RESEARCH_PORTFOLIO.md](/home/user/figma/docs/portfolio/RESEARCH_PORTFOLIO.md)) and a Codrops case study; about 2,461 KB. |
| `maria-vasilyeva-portfolio-2026.jpg` | [mariavasilyeva.com](https://www.mariavasilyeva.com/) | Horizontal project gallery with "Sound: ON/OFF" and "Annotations: ON/OFF" toggles, project labels and "View project" links (images still loading at capture); earlier capture showed a playlist-style loader. |
| `kaisei-sadatoki-portfolio.jpg` | [kaiseisadatoki-v4.vercel.app](https://kaiseisadatoki-v4.vercel.app/) | Warm paper-grain page with marquee, display serif name, numbered menu; author of the Atelier North tutorial; about 79 KB first load. |
| `lenis-showcase.jpg` | [lenis.darkroom.engineering/showcase](https://lenis.darkroom.engineering/showcase) | Curated gallery of smooth-scroll sites with filters (Categories, Technologies, Features, Color, Templates). |
| `gsap-showcase.jpg` | [gsap.com/showcase](https://gsap.com/showcase/) | GSAP Gallery with tag filters (Site of the Week/Day, Astro, Portfolio, React, SVG, Scroll, Svelte, Text, Three.js, UI, Vue, WebGL, Webflow) and a Showreel carousel. |
| `unicorn-studio-home.jpg` | [unicorn.studio](https://www.unicorn.studio/) | "Craft Interactive Graphics that Ship" with a live shader hero; heavy first load (about 123,950 KB by content-length sum). |

### Inferences
- Start from Interlude for page transitions (it is built for Astro 7.x and ClientRouter, MIT) and Atelier North for scroll/pixel reveals (confirm licence first); layer Paper Shaders or a custom halftone/CMYK shader as the signature look that ties to Kamil's print and packaging background.
- Cinema-style WebGPU demos are heavy and could not be screenshotted in software rendering; treat WebGPU/TSL as a showcase layer, not core navigation.
- The 2026 Codrops case studies of Juan Mora Romero and Maria Vasilyeva match the CSSDA winners in the earlier research; their pattern is one strong idea plus sound/annotation toggles, not a larger stack.
- Agent-oriented material appearing at Codrops (Animaxxing skills, "made with Claude") plus GSAP's official skills suggest an established workflow for Claude Code to write GSAP/three code reliably.

### Gaps
- tympanus.net (Codrops) returns Cloudflare 403/challenge to automated clients except the first `all-posts` page, and awwwards.com resets connections, so tutorial bodies, exact dates for some posts (Joffrey Spitzer, WebGPU persistent transitions, Interlude article) and Awwwards stats were not read; dates above come from listings and search summaries.
- The CinemaSeatPreview demo could not be captured (screenshot timed out under software rendering); Maria Vasilyeva's and Stas Bondar's pages showed loaders at capture (Stas Bondar's screenshot was discarded as uninformative); the Interlude transition mid-flight could not be captured.
- Atelier North licence is ambiguous (README says MIT, no LICENSE file found, GitHub licence "None").
- I did not inspect the Joffrey Spitzer or Stas Bondar repos for licences, and did not find whether Kaisei Sadatoki's own portfolio (v4) is open source.
