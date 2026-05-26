export type PostWithProject = {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  project: {
    id: string;
    title: string;
    slug: string;
  };
};

export type ProjectWithPosts = {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: Date;
  posts: {
    id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    createdAt: Date;
  }[];
};
