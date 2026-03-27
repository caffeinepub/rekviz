import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Link } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddLink,
  useGetLinks,
  useGetProfile,
  useRemoveLink,
  useReorderLinks,
  useUpdateLink,
  useUpdateProfile,
} from "../hooks/useQueries";

interface AdminPanelProps {
  onBack: () => void;
}

interface LinkFormState {
  title: string;
  url: string;
  icon: string;
  enabled: boolean;
}

const EMPTY_LINK_FORM: LinkFormState = {
  title: "",
  url: "",
  icon: "link",
  enabled: true,
};

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { data: profile } = useGetProfile();
  const { data: links } = useGetLinks();
  const updateProfile = useUpdateProfile();
  const addLink = useAddLink();
  const updateLink = useUpdateLink();
  const removeLink = useRemoveLink();
  const reorderLinks = useReorderLinks();
  const { clear } = useInternetIdentity();

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: profile?.name ?? "",
    handle: profile?.handle ?? "",
    bio: profile?.bio ?? "",
    avatarUrl: profile?.avatarUrl ?? "",
  });

  // Sync profileForm when profile loads
  const [profileSynced, setProfileSynced] = useState(false);
  if (profile && !profileSynced) {
    setProfileForm({
      name: profile.name,
      handle: profile.handle,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
    });
    setProfileSynced(true);
  }

  // Link dialog
  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    editing: Link | null;
    form: LinkFormState;
  }>({
    open: false,
    editing: null,
    form: EMPTY_LINK_FORM,
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(profileForm);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleOpenAddLink = () => {
    setLinkDialog({ open: true, editing: null, form: EMPTY_LINK_FORM });
  };

  const handleOpenEditLink = (link: Link) => {
    setLinkDialog({
      open: true,
      editing: link,
      form: {
        title: link.title,
        url: link.url,
        icon: link.icon,
        enabled: link.enabled,
      },
    });
  };

  const handleSaveLink = async () => {
    const { editing, form } = linkDialog;
    try {
      if (editing) {
        await updateLink.mutateAsync({ id: editing.id, ...form });
        toast.success("Link updated!");
      } else {
        await addLink.mutateAsync({
          title: form.title,
          url: form.url,
          icon: form.icon,
        });
        toast.success("Link added!");
      }
      setLinkDialog({ open: false, editing: null, form: EMPTY_LINK_FORM });
    } catch {
      toast.error("Failed to save link");
    }
  };

  const handleRemoveLink = async (id: bigint) => {
    try {
      await removeLink.mutateAsync(id);
      toast.success("Link removed");
    } catch {
      toast.error("Failed to remove link");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!links) return;
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;
    [newLinks[index], newLinks[swapIndex]] = [
      newLinks[swapIndex],
      newLinks[index],
    ];
    try {
      await reorderLinks.mutateAsync(newLinks.map((l) => l.id));
    } catch {
      toast.error("Failed to reorder links");
    }
  };

  const handleToggleLink = async (link: Link) => {
    try {
      await updateLink.mutateAsync({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        enabled: !link.enabled,
      });
    } catch {
      toast.error("Failed to update link");
    }
  };

  const isSavingLink = addLink.isPending || updateLink.isPending;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.965 0.015 85)" }}
    >
      <Toaster />
      {/* Admin Header */}
      <header
        className="w-full px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "oklch(0.84 0.012 60)" }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="rounded-full"
            data-ocid="admin.back.button"
          >
            <X className="w-4 h-4 mr-1" /> Back to Profile
          </Button>
        </div>
        <h1
          className="font-display font-bold text-xl"
          style={{ color: "oklch(0.22 0 0)" }}
        >
          Admin Panel
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clear();
            onBack();
          }}
          className="rounded-full"
          data-ocid="admin.logout.button"
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Profile Edit */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            style={{
              backgroundColor: "oklch(0.97 0.01 80)",
              borderColor: "oklch(0.84 0.012 60)",
            }}
          >
            <CardHeader>
              <CardTitle
                className="font-display text-lg"
                style={{ color: "oklch(0.22 0 0)" }}
              >
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="profile.name.input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="handle">Handle</Label>
                  <Input
                    id="handle"
                    value={profileForm.handle}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, handle: e.target.value }))
                    }
                    data-ocid="profile.handle.input"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                  data-ocid="profile.bio.textarea"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={profileForm.avatarUrl}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, avatarUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  data-ocid="profile.avatar_url.input"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                className="self-end rounded-full"
                style={{
                  backgroundColor: "oklch(0.22 0 0)",
                  color: "oklch(0.98 0 0)",
                }}
                data-ocid="profile.save.button"
              >
                {updateProfile.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {updateProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator style={{ backgroundColor: "oklch(0.84 0.012 60)" }} />

        {/* Links Manager */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-display font-bold text-lg"
              style={{ color: "oklch(0.22 0 0)" }}
            >
              Links
            </h2>
            <Button
              onClick={handleOpenAddLink}
              size="sm"
              className="rounded-full"
              style={{
                backgroundColor: "oklch(0.22 0 0)",
                color: "oklch(0.98 0 0)",
              }}
              data-ocid="links.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>

          {!links || links.length === 0 ? (
            <div
              className="text-center py-10 rounded-2xl border"
              style={{
                borderColor: "oklch(0.84 0.012 60)",
                color: "oklch(0.55 0 0)",
              }}
              data-ocid="links.empty_state"
            >
              No links yet. Add your first link!
            </div>
          ) : (
            <div className="flex flex-col gap-3" data-ocid="links.list">
              {links.map((link, i) => (
                <motion.div
                  key={String(link.id)}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 p-3 rounded-2xl border"
                  style={{
                    backgroundColor: "oklch(0.97 0.01 80)",
                    borderColor: "oklch(0.84 0.012 60)",
                  }}
                  data-ocid={`links.item.${i + 1}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleMove(i, "up")}
                      disabled={i === 0}
                      data-ocid={`links.move_up.button.${i + 1}`}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleMove(i, "down")}
                      disabled={i === links.length - 1}
                      data-ocid={`links.move_down.button.${i + 1}`}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: "oklch(0.22 0 0)" }}
                    >
                      {link.title}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      {link.url}
                    </p>
                  </div>
                  <Switch
                    checked={link.enabled}
                    onCheckedChange={() => handleToggleLink(link)}
                    data-ocid={`links.toggle.${i + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenEditLink(link)}
                    data-ocid={`links.edit_button.${i + 1}`}
                  >
                    <span className="text-xs font-medium">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleRemoveLink(link.id)}
                    data-ocid={`links.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Link dialog */}
      <Dialog
        open={linkDialog.open}
        onOpenChange={(open) => setLinkDialog((s) => ({ ...s, open }))}
      >
        <DialogContent data-ocid="link.dialog">
          <DialogHeader>
            <DialogTitle>
              {linkDialog.editing ? "Edit Link" : "Add Link"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="link-title">Title</Label>
              <Input
                id="link-title"
                value={linkDialog.form.title}
                onChange={(e) =>
                  setLinkDialog((s) => ({
                    ...s,
                    form: { ...s.form, title: e.target.value },
                  }))
                }
                data-ocid="link.title.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkDialog.form.url}
                onChange={(e) =>
                  setLinkDialog((s) => ({
                    ...s,
                    form: { ...s.form, url: e.target.value },
                  }))
                }
                placeholder="https://..."
                data-ocid="link.url.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="link-icon">Icon name</Label>
              <Input
                id="link-icon"
                value={linkDialog.form.icon}
                onChange={(e) =>
                  setLinkDialog((s) => ({
                    ...s,
                    form: { ...s.form, icon: e.target.value },
                  }))
                }
                placeholder="instagram, youtube, discord, globe..."
                data-ocid="link.icon.input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={linkDialog.form.enabled}
                onCheckedChange={(v) =>
                  setLinkDialog((s) => ({
                    ...s,
                    form: { ...s.form, enabled: v },
                  }))
                }
                id="link-enabled"
                data-ocid="link.enabled.switch"
              />
              <Label htmlFor="link-enabled">Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setLinkDialog({
                  open: false,
                  editing: null,
                  form: EMPTY_LINK_FORM,
                })
              }
              data-ocid="link.dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLink}
              disabled={
                isSavingLink || !linkDialog.form.title || !linkDialog.form.url
              }
              style={{
                backgroundColor: "oklch(0.22 0 0)",
                color: "oklch(0.98 0 0)",
              }}
              data-ocid="link.dialog.confirm_button"
            >
              {isSavingLink ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isSavingLink ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
