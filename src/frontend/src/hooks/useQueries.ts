import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Link, Profile } from "../backend";
import { useActor } from "./useActor";

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor)
        return {
          name: "Alexis Reed",
          handle: "alexisreed",
          bio: "Visual Storyteller | Content Creator | Founder @ The Hive",
          avatarUrl: "/assets/generated/profile-avatar.dim_400x400.jpg",
        };
      return actor.getProfile();
    },
    enabled: !isFetching,
  });
}

export function useGetLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Link>>({
    queryKey: ["links"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLinks();
    },
    enabled: !isFetching,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useAddLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      url,
      icon,
    }: { title: string; url: string; icon: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addLink(title, url, icon);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useUpdateLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      url,
      icon,
      enabled,
    }: {
      id: bigint;
      title: string;
      url: string;
      icon: string;
      enabled: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateLink(id, title, url, icon, enabled);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useRemoveLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.removeLink(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useReorderLinks() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: bigint[]) => {
      if (!actor) throw new Error("No actor");
      return actor.reorderLinks(ids);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
  });
}
