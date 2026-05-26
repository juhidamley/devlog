export type MockProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  createdAt: Date;
};

export type MockPost = {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  project: MockProject;
};

const projects: MockProject[] = [
  {
    id: "proj_1",
    slug: "building-devlog",
    title: "Building Devlog",
    description: "The meta-project: designing and building this very site.",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "proj_2",
    slug: "webgl-experiments",
    title: "WebGL Experiments",
    description: "Exploring React Three Fiber, GLSL shaders, and GPU-driven visuals.",
    createdAt: new Date("2024-02-01"),
  },
];

const posts: MockPost[] = [
  {
    id: "post_1",
    projectId: "proj_1",
    title: "Phase 1: Scaffolding the Stack",
    slug: "phase-1-scaffolding",
    content: "Setting up Next.js App Router, Prisma, and the base routing structure.",
    isPublished: true,
    createdAt: new Date("2024-01-10"),
    project: projects[0],
  },
  {
    id: "post_2",
    projectId: "proj_1",
    title: "Phase 2: Auth and the Admin CMS",
    slug: "phase-2-auth-cms",
    content: "Adding NextAuth with GitHub OAuth and wiring up the admin dashboard.",
    isPublished: true,
    createdAt: new Date("2024-01-25"),
    project: projects[0],
  },
  {
    id: "post_3",
    projectId: "proj_2",
    title: "Writing My First Vertex Shader",
    slug: "first-vertex-shader",
    content: "A walkthrough of my first GLSL vertex shader inside a React Three Fiber scene.",
    isPublished: true,
    createdAt: new Date("2024-02-20"),
    project: projects[1],
  },
  {
    id: "post_4",
    projectId: "proj_2",
    title: "GPU Particle System (WIP)",
    slug: "gpu-particle-system",
    content: "Drafting a GPGPU particle system. Not ready for publication.",
    isPublished: false,
    createdAt: new Date("2024-03-05"),
    project: projects[1],
  },
];

export function getAllPublishedPosts(): MockPost[] {
  return posts
    .filter((p) => p.isPublished)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAllPosts(): MockPost[] {
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAllProjects(): MockProject[] {
  return [...projects].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getProjectWithPosts(
  slug: string
): (MockProject & { posts: MockPost[] }) | null {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  return {
    ...project,
    posts: posts
      .filter((p) => p.projectId === project.id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  };
}
