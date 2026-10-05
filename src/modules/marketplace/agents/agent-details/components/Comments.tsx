import { Edit2, MessageCircle, MoreVertical, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateCommentMutation } from "@/modules/marketplace/agents/agent-details/services/createComment";
import { useCommentsList } from "@/modules/marketplace/agents/agent-details/services/getComments";
import { CircularLoader } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { useUser } from "@/utils/auth";

import type { CommentDTO } from "@/modules/marketplace/agents/agent-details/services/types";
import type { UserProfile } from "@/shared/types";
import type { PaginationState } from "@tanstack/react-table";

interface CommentsProps {
  agentId: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

type SortOption = "recent" | "oldest";

export const Comments = ({ agentId }: CommentsProps) => {
  const { t } = useTranslation();
  const { data: user } = useUser() as { data: UserProfile | null };

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: commentsResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useCommentsList({
    agentId,
    pagination,
  });

  const { mutate: createComment, isPending: isSubmitting } = useCreateCommentMutation({
    config: {
      onSuccess: () => {
        setCommentText("");
        setReplyText({});
        setReplyingTo(null);
        refetch();
      },
    },
  });

  const comments = commentsResponse?.data || [];
  const totalComments = commentsResponse?.pagination?.totalCount || comments.length;

  const handleSubmitComment = () => {
    if (!commentText.trim() || !user || !agentId) return;

    createComment({
      agentId,
      data: {
        content: commentText,
        parent: null,
      },
    });
  };

  const handleSubmitReply = (parentId: number) => {
    const content = replyText[parentId];
    if (!content?.trim() || !user || !agentId) return;

    createComment({
      agentId,
      data: {
        content: content,
        parent: parentId,
      },
    });
  };

  const renderComment = (comment: CommentDTO, isReply = false) => {
    const isOwner = user?.username === comment.userName; // Roughly inferred matching

    return (
      <div
        key={comment.id}
        className={`${!isReply ? "border-b pb-6 mb-6 last:border-b-0 last:mb-0" : "mt-4"}`}
      >
        <div className="flex items-start gap-3 md:gap-4">
          <div
            className={`rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden ${
              isReply ? "w-8 h-8" : "w-10 h-10 md:w-12 md:h-12"
            }`}
          >
            <User className={`${isReply ? "w-4 h-4" : "w-6 h-6"} text-muted-foreground`} />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className={`font-semibold ${isReply ? "text-sm" : "text-base"}`}>
                  {comment.userName || "User"}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt || new Date().toISOString())}
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="ml-2 italic">(edited)</span>
                  )}
                </span>
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" />
                      {t("common.edit", "Edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("common.delete", "Delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p
              className={`text-muted-foreground mb-3 wrap-break-word ${
                isReply ? "text-sm" : "text-base"
              }`}
            >
              {comment.content}
            </p>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                <span>{t("comments.reply", "Reply")}</span>
              </button>
            </div>

            {/* Reply Input Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 bg-muted/20 p-4 rounded-lg animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {t("comments.replyingTo", "Replying to")}{" "}
                    <span className="text-primary">@{comment.userName}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setReplyingTo(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Textarea
                    value={replyText[comment.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                    placeholder={t("comments.replyPlaceholder", "Write your reply...")}
                    rows={2}
                    className="flex-1 resize-none bg-background"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!(replyText[comment.id] || "").trim() || isSubmitting}
                  >
                    {isSubmitting
                      ? t("common.posting", "Posting...")
                      : t("comments.postReply", "Post Reply")}
                  </Button>
                </div>
              </div>
            )}

            {/* Render nested replies recursively */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-muted/30">
                {/* Sort replies by oldest first (chronological order) if they aren't already */}
                {comment.replies
                  .slice()
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {t("comments.title", "All Comments")} ({totalComments})
        </h2>
      </div>

      <div className="bg-muted/30 rounded-lg p-6 mb-8 border border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          {t("comments.writeComment", "Write a Comment")}
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {user?.profilePictureUrl || user?.profile?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl || user.profile?.profilePictureUrl}
                  alt={user.username || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t(
                "comments.commentPlaceholder",
                "Share your experience or ask a question about this AI agent..."
              )}
              rows={4}
              className="flex-1 bg-background"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || !user || isSubmitting}
              className="w-full md:w-auto shadow-sm"
            >
              {isSubmitting
                ? t("common.submitting", "Submitting...")
                : t("comments.submitComment", "Post Comment")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mb-6">
        <span className="text-sm font-medium">{t("comments.sortBy", "Sort by")}:</span>
        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("comments.sort.placeholder", "Sort by")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">{t("comments.sort.mostRecent", "Most Recent")}</SelectItem>
            <SelectItem value="oldest">{t("comments.sort.oldest", "Oldest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {isLoading && !isRefetching ? (
          <div className="flex justify-center p-8">
            <CircularLoader />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-lg bg-muted/20 border border-dashed border-muted-foreground/30">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">
              {t("comments.emptyTitle", "No comments yet")}
            </h3>
            <p className="text-muted-foreground">
              {t(
                "comments.emptyMessage",
                "Be the first to share your thoughts or ask a question about this agent."
              )}
            </p>
          </div>
        ) : (
          <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6 mb-8">
            {comments.map((comment) => renderComment(comment, false))}
          </div>
        )}
      </div>

      {commentsResponse?.pagination?.currentPage &&
        commentsResponse?.pagination?.totalPages &&
        commentsResponse.pagination.currentPage < commentsResponse.pagination.totalPages && (
          <div className="mt-8 text-center pb-8">
            <Button
              variant="outline"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
              className="px-6 py-2 shadow-sm"
              disabled={isLoading || isRefetching}
            >
              {isLoading || isRefetching
                ? t("common.loading", "Loading...")
                : t("comments.loadMore", "Load More Comments")}
            </Button>
          </div>
        )}
    </div>
  );
};
