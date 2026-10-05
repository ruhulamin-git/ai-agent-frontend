import { Star, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateReviewMutation } from "@/modules/marketplace/agents/agent-details/services/createReview";
import { useReviewsList } from "@/modules/marketplace/agents/agent-details/services/getReviews";
import { CircularLoader } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { useUser } from "@/utils/auth";

import type { UserProfile } from "@/shared/types";
import type { PaginationState } from "@tanstack/react-table";

type SortOption = "recent" | "highest" | "lowest";

interface ReviewsProps {
  agentId: string;
}

export const Reviews = ({ agentId }: ReviewsProps) => {
  const { t } = useTranslation();

  const { data: user } = useUser() as { data: UserProfile | null };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: reviewsResponse,
    isLoading,
    refetch,
  } = useReviewsList({
    agentId,
    pagination,
    // Note: sorting implementation depends on backend support. For now, default is 'recent'.
  });

  const { mutate: createReview, isPending: isSubmitting } = useCreateReviewMutation({
    config: {
      onSuccess: () => {
        setUserRating(0);
        setReviewTitle("");
        setReviewText("");
        refetch();
      },
    },
  });

  const reviews = reviewsResponse?.data || [];
  const totalReviews = reviewsResponse?.pagination?.totalCount || reviews.length;
  // Calculate average rating locally if not provided by backend.
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const renderInteractiveStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-7 h-7 cursor-pointer transition-colors ${
          i < (hoveredRating || userRating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 hover:text-yellow-400"
        }`}
        onClick={() => setUserRating(i + 1)}
        onMouseEnter={() => setHoveredRating(i + 1)}
        onMouseLeave={() => setHoveredRating(0)}
      />
    ));
  };

  const handleSubmitReview = () => {
    if (userRating === 0 || !reviewTitle.trim() || !reviewText.trim() || !user || !agentId) {
      return;
    }

    createReview({
      agentId,
      data: {
        rating: userRating,
        title: reviewTitle,
        body: reviewText,
      },
    });
  };

  const sortReviews = (option: SortOption) => {
    setSortBy(option);
    // In a real application, you might update the sorting prop for useReviewsList,
    // passing the appropriate sorting fields.
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {t("reviews.title", `Customer Reviews (${totalReviews})`)}
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(Math.round(parseFloat(averageRating)))}</div>
            <span className="text-lg font-semibold">{averageRating}</span>
          </div>
          <span className="text-muted-foreground">
            {t("reviews.basedOn", "Based on")} {totalReviews} {t("reviews.reviews", "reviews")}
          </span>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">{t("reviews.writeReview", "Write a Review")}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("reviews.rating", "Rating")}
            </label>
            <div className="flex gap-1">{renderInteractiveStars()}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("reviews.yourReview", "Your Review")}
            </label>
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
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
              <div className="flex-1 space-y-3">
                <Input
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder={t("reviews.titlePlaceholder", "Review Title")}
                  className="w-full"
                />
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={t(
                    "reviews.reviewPlaceholder",
                    "Share your experience with this AI agent..."
                  )}
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReview}
              disabled={
                userRating === 0 ||
                !reviewTitle.trim() ||
                !reviewText.trim() ||
                !user ||
                isSubmitting
              }
              className="w-full md:w-auto"
            >
              {isSubmitting
                ? t("common.submitting", "Submitting...")
                : t("reviews.submitReview", "Submit Review")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-sm font-medium">{t("reviews.sortBy", "Sort by")}:</span>
        <Select value={sortBy} onValueChange={(value: SortOption) => sortReviews(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("reviews.sort.placeholder", "Sort by")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">{t("reviews.sort.mostRecent", "Most Recent")}</SelectItem>
            <SelectItem value="highest">
              {t("reviews.sort.highestRating", "Highest Rating")}
            </SelectItem>
            <SelectItem value="lowest">
              {t("reviews.sort.lowestRating", "Lowest Rating")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <CircularLoader />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("reviews.noReviewsYet", "No reviews yet. Be the first to review!")}
          </div>
        ) : (
          reviews.map((review) => {
            const displayName = review.reviewerName || "User";

            return (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{displayName}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt || new Date().toISOString())}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Inject the review Title as well */}
                    <p className="font-semibold mb-1 text-slate-800 dark:text-slate-200">
                      {review.title}
                    </p>
                    <p className="text-muted-foreground mb-3">{review.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {reviewsResponse?.pagination?.currentPage &&
      reviewsResponse?.pagination?.totalPages &&
      reviewsResponse.pagination.currentPage < reviewsResponse.pagination.totalPages ? (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            className="px-6 py-2 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t("reviews.loadMore", "Load More Reviews")}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
