import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ── Projects ────────────────────────────────────────────────────────────────

  const devlog = await prisma.project.upsert({
    where: { slug: "building-devlog" },
    update: {},
    create: {
      slug: "building-devlog",
      title: "Building Devlog",
      description: "The meta-project: designing and building this very site from scratch.",
    },
  });

  const webgl = await prisma.project.upsert({
    where: { slug: "webgl-experiments" },
    update: {},
    create: {
      slug: "webgl-experiments",
      title: "WebGL Experiments",
      description: "Exploring GLSL shaders, ordered dithering, and GPU-driven visuals with React Three Fiber.",
    },
  });

  // ── Posts ────────────────────────────────────────────────────────────────────

  await prisma.post.upsert({
    where: { slug: "stack-architecture" },
    update: {},
    create: {
      projectId: devlog.id,
      title: "Stack Architecture",
      slug: "stack-architecture",
      isPublished: true,
      createdAt: new Date("2025-01-08"),
      content: `<p>Every project starts with a set of hard decisions that define everything downstream. For this devlog, the constraints were clear: server-rendered pages for SEO and performance, a real database for persistent content, and a type system that catches mistakes at build time rather than runtime.</p><p>Next.js 15 with the App Router gives me React Server Components out of the box — server-side data fetching without a separate API layer, layouts that persist between navigations, and streaming. Prisma handles the database with a schema-first workflow that generates fully typed query builders. The combination means TypeScript flows from the database schema all the way to the component tree with no manual type definitions for data shapes.</p><p>The admin section uses NextAuth v5 with GitHub OAuth, locked to a single allowed email address via the <code>signIn</code> callback. No user tables, no session storage — just a JWT and an email check. For a personal tool used by exactly one person, anything more complex is unnecessary.</p>`,
    },
  });

  await prisma.post.upsert({
    where: { slug: "the-astrodither-background" },
    update: {},
    create: {
      projectId: devlog.id,
      title: "The AstroDither Background",
      slug: "the-astrodither-background",
      isPublished: true,
      createdAt: new Date("2025-01-15"),
      content: `<p>The background effect runs entirely in GLSL on the GPU via React Three Fiber. The technique layers two concepts: fractal Brownian motion for animated noise, and Bayer matrix ordered dithering to reduce that continuous noise field to a sharp binary pattern.</p><p>FBM works by summing multiple octaves of noise at increasing frequencies and decreasing amplitudes. Each additional octave adds finer detail — the first octave gives you large, slow-moving clouds, the fourth adds tiny flickering grain. The result is organic and non-repeating.</p><p>The Bayer matrix is a pre-computed 4×4 threshold table. For each pixel, compare the noise value against the corresponding threshold entry. If the noise exceeds the threshold, the pixel is lit; if not, dark. This converts a smooth gradient into a pattern of discrete dots. Running the comparison at 3px groups gives the chunky retro feel. Sparse twinkling stars and CRT scanlines complete the terminal aesthetic.</p>`,
    },
  });

  await prisma.post.upsert({
    where: { slug: "brutalist-grid-shared-transitions" },
    update: {},
    create: {
      projectId: devlog.id,
      title: "Brutalist Grid + Shared Transitions",
      slug: "brutalist-grid-shared-transitions",
      isPublished: true,
      createdAt: new Date("2025-01-28"),
      content: `<p>The layout is a 12-column CSS Grid with 1px gaps. Those seams aren't an oversight — they expose the WebGL canvas underneath, acting as dark mortar between content blocks. No padding, no gutters, no container max-width. Content spans edge to edge.</p><p>Block sizes follow an asymmetric cycle: full-width hero, an 8/4 split, a 6/6 split, then 4/4/4. Typography scales down as blocks get smaller — fluid viewport-relative units on the hero, fixed rem values on smaller blocks. The variation reads as intentional hierarchy, not inconsistency.</p><p>The expand animation uses Framer Motion's <code>layoutId</code>. Each block and its corresponding fullscreen overlay share the same <code>layoutId</code> string. When the overlay mounts, Framer Motion captures the block's computed position and morphs the overlay from that bounding box to fill the viewport. The block's background color is identical on the overlay, so there is no visual jump during the transition.</p>`,
    },
  });

  await prisma.post.upsert({
    where: { slug: "pixel-cursor-autopilot" },
    update: {},
    create: {
      projectId: devlog.id,
      title: "Pixel Cursor & Autopilot",
      slug: "pixel-cursor-autopilot",
      isPublished: true,
      createdAt: new Date("2025-02-04"),
      content: `<p>The custom cursor is a pixelated hand SVG that follows the mouse via Framer Motion springs — a spring with damping 28 and stiffness 400 gives it the slightly-lagged, organic feel of a physical object being dragged.</p><p>After four seconds of mouse inactivity, an autopilot loop kicks in. It queries the DOM for all post and project blocks, picks one at random, animates the cursor spring to the center of that block, fires a synthetic click, waits for the expand animation to play out, then dispatches an Escape keydown event to close the overlay. This repeats until the user moves the mouse, at which point the loop exits at the next async boundary and control returns immediately.</p>`,
    },
  });

  await prisma.post.upsert({
    where: { slug: "ordered-dithering-explained" },
    update: {},
    create: {
      projectId: webgl.id,
      title: "Ordered Dithering Explained",
      slug: "ordered-dithering-explained",
      isPublished: true,
      createdAt: new Date("2024-12-20"),
      content: `<p>Ordered dithering simulates continuous tones using only a limited set of values — in its simplest form, just black and white. Each pixel is compared against a pre-computed threshold from a matrix. If the source value exceeds the threshold, the pixel outputs the high value; otherwise, the low value. The spatial distribution of these decisions creates the visual illusion of intermediate tones.</p><p>The Bayer matrix is a specific ordered dithering pattern optimized for perceptual smoothness. Its recursive construction means that at every scale level, the dot pattern is as evenly distributed as mathematically possible. The 4×4 variant operates on 16 pixels simultaneously, giving 17 effective tone levels from just two actual values. This is why Bayer dithering became the standard for early digital imaging — maximum tonal range at near-zero cost.</p>`,
    },
  });

  await prisma.post.upsert({
    where: { slug: "fbm-noise-glsl" },
    update: {},
    create: {
      projectId: webgl.id,
      title: "FBM Noise in GLSL",
      slug: "fbm-noise-glsl",
      isPublished: true,
      createdAt: new Date("2025-01-03"),
      content: `<p>Fractal Brownian motion is not a single noise function — it is a method for combining multiple calls to a simpler noise function. Start with a base call at frequency 1.0 and amplitude 0.5. Double the frequency, halve the amplitude, and add the result. Repeat four or five times. Each iteration is an octave. The high-frequency octaves add fine detail on top of the low-frequency structure established by the first.</p><p>In GLSL, each octave requires a separate noise evaluation — five octaves means five hash lookups and five interpolations per pixel, per frame. On modern desktop GPUs this is trivial, but on mobile hardware or at 4K resolution it becomes the bottleneck. The standard optimization is to reduce octave count conditionally, driven by a uniform set from the CPU based on device capability.</p>`,
    },
  });

  await prisma.post.upsert({
    where: { slug: "gpu-particle-systems" },
    update: {},
    create: {
      projectId: webgl.id,
      title: "GPU Particle Systems (WIP)",
      slug: "gpu-particle-systems",
      isPublished: false,
      createdAt: new Date("2025-02-10"),
      content: `<p>The core idea: store particle positions in a floating-point texture rather than a CPU-side array. Each frame, a fragment shader reads the position texture and writes updated positions to an output texture via ping-pong FBOs. The main render pass samples the position texture to place instanced geometry. No position data ever leaves the GPU — the bottleneck shifts from CPU→GPU bandwidth to pure shader throughput.</p>`,
    },
  });

  console.log("✓ Seeded 2 projects and 7 posts");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
