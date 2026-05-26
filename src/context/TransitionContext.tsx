"use client";

import { createContext, useContext } from "react";
import type { PostWithProject, ProjectWithPosts } from "@/types/data";

export type SelectedPost = {
  post: PostWithProject;
  styleIndex: number;
};

export type SelectedProject = {
  project: ProjectWithPosts;
  styleIndex: number;
};

type TransitionContextValue = {
  selectedPost: SelectedPost | null;
  selectPost: (value: SelectedPost | null) => void;
  selectedProject: SelectedProject | null;
  selectProject: (value: SelectedProject | null) => void;
};

export const TransitionContext = createContext<TransitionContextValue>({
  selectedPost: null,
  selectPost: () => {},
  selectedProject: null,
  selectProject: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);
