import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconStar, IconStarFilled, IconEdit, IconX, IconTrash } from "@tabler/icons-react";
import { axios } from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

export const AddReviewTab = ({ agentId }: { agentId: string | number }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [existingReviewId, setExistingReviewId] = useState<number | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [agentId]);

    const fetchReviews = async () => {
        setIsLoadingReviews(true);
        try {
            const response = await axios.get(`/api/marketplace/v1/agents/${agentId}/reviews/`);
            setReviews(response.data?.data || response.data?.results || response.data || []);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const handleEditClick = (review: any) => {
        setExistingReviewId(review.id);
        setRating(parseFloat(review.rating));
        setTitle(review.title);
        setBody(review.body || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setExistingReviewId(null);
        setRating(0);
        setTitle("");
        setBody("");
    };

    const handleDeleteClick = async (reviewId: number) => {
        try {
            await axios.delete(`/api/marketplace/v1/agents/${agentId}/reviews/${reviewId}/`);
            toast.success("Review deleted successfully");
            if (existingReviewId === reviewId) {
                handleCancelEdit();
            }
            fetchReviews();
        } catch (error: any) {
            console.error("Failed to delete review:", error);
            const errorMsg = error?.response?.data?.message || "Failed to delete review";
            toast.error(errorMsg);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        setIsSubmitting(true);
        try {
            if (existingReviewId) {
                await axios.put(`/api/marketplace/v1/agents/${agentId}/reviews/${existingReviewId}/`, {
                    rating: rating.toString() + (rating % 1 === 0 ? ".0" : ""),
                    title,
                    body,
                });
                toast.success("Review updated successfully");
            } else {
                await axios.post(`/api/marketplace/v1/agents/${agentId}/reviews/`, {
                    rating: rating.toString() + (rating % 1 === 0 ? ".0" : ""),
                    title,
                    body,
                });
                toast.success("Review submitted successfully");
            }

            handleCancelEdit();
            fetchReviews();
        } catch (error: any) {
            console.error(error);
            const errorMsg = error?.response?.data?.message || `Failed to ${existingReviewId ? "update" : "submit"} review`;
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50 animate-in fade-in duration-500">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-900 dark:text-white">
                            {existingReviewId ? "Edit Review" : "Leave a Review"}
                        </CardTitle>
                        {existingReviewId && (
                            <button
                                onClick={handleCancelEdit}
                                className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all font-medium cursor-pointer"
                            >
                                <IconX size={16} /> Cancel Edit
                            </button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        {existingReviewId
                            ? "Update your review details below."
                            : "Share your experience using this agent to help others in the marketplace."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Rating and Title */}
                            <div className="space-y-6">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                                        Rating <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                            >
                                                {star <= (hoverRating || rating) ? (
                                                    <IconStarFilled size={32} className="text-yellow-400" />
                                                ) : (
                                                    <IconStar size={32} className="text-gray-300 dark:text-gray-700" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Headline <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Sum up your experience"
                                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Body */}
                            <div className="flex flex-col h-full">
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Review Details
                                </label>
                                <Textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="What did you like or dislike? How did this agent help you?"
                                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white resize-none flex-1 min-h-[120px]"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 dark:border-gray-500 dark:border-t-white rounded-full animate-spin" />
                                        {existingReviewId ? "Updating..." : "Submitting..."}
                                    </>
                                ) : (
                                    existingReviewId ? "Update Review" : "Submit Review"
                                )}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Reviews Section (for editing purposes) */}
            <div className="mt-8">
                <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50 animate-in fade-in duration-500">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">Your Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingReviews ? (
                            <div className="flex justify-center py-4">
                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="p-4 rounded-lg border border-gray-300 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-950 flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-gray-900 dark:text-white font-medium">{review.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star}>
                                                        {star <= parseFloat(review.rating) ? (
                                                            <IconStarFilled size={14} className="text-yellow-400" />
                                                        ) : (
                                                            <IconStar size={14} className="text-gray-300 dark:text-gray-700" />
                                                        )}
                                                    </span>
                                                ))}
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-300 text-sm">{review.body}</p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => handleEditClick(review)}
                                                className="p-2 text-gray-500 cursor-pointer hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                                aria-label="Edit review"
                                            >
                                                <IconEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(review.id)}
                                                className="p-2 text-gray-500 cursor-pointer hover:text-red-600 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
                                                aria-label="Delete review"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">No reviews found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
