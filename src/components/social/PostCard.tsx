import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  BadgeCheck,
  Award,
  AlertTriangle,
  Smile,
  Zap,
  Handshake,
  Star
} from 'lucide-react';
import { CommunityPost } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../../store/useStore';
import { CityImage } from '../common/CityImage';

interface PostCardProps {
  post: CommunityPost;
}

const REACTION_TYPES = [
  { id: 'like', icon: Heart, label: 'Like', color: 'text-rose-500' },
  { id: 'love', icon: Heart, label: 'Love', color: 'text-pink-500' },
  { id: 'celebrate', icon: Award, label: 'Celebrate', color: 'text-amber-500' },
  { id: 'support', icon: Handshake, label: 'Support', color: 'text-blue-500' },
  { id: 'funny', icon: Smile, label: 'Funny', color: 'text-yellow-500' },
  { id: 'helpful', icon: Zap, label: 'Helpful', color: 'text-emerald-500' },
  { id: 'inspirational', icon: Star, label: 'Inspirational', color: 'text-purple-500' },
];

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLikePost } = useStore();
  const [showReactions, setShowReactions] = useState(false);
  const liked = post.liked_by_user || false;

  const handleLike = async () => {
    await toggleLikePost(post.id);
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'business': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'event': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CityImage 
              src={post.author_avatar} 
              alt={post.author_name} 
              fallback="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20"
            />
            {post.author_role === 'Verified Business' && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-zinc-900">
                <BadgeCheck className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{post.author_name}</h4>
              {post.author_role && (
                <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-0.5">
                   • {post.author_role}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400">{getRelativeTime(post.created_at)}</p>
          </div>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-2">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getCategoryColor(post.category)}`}>
            {post.category.replace('_', ' ')}
          </span>
          {post.type === 'poll' && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider">
              Poll
            </span>
          )}
        </div>
        
        {post.title && <h3 className="text-base font-black text-zinc-900 dark:text-white leading-tight">{post.title}</h3>}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {post.content}
        </p>

        {post.media_url && (
          <div className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            {post.type === 'video' ? (
              <video src={post.media_url} controls className="w-full aspect-video object-cover" />
            ) : (
              <CityImage src={post.media_url} alt="Post media" fallback="event" className="w-full h-auto object-cover max-h-[400px]" />
            )}
          </div>
        )}

        {/* Poll Section */}
        {post.type === 'poll' && post.poll_data && (
          <div className="space-y-2 pt-2">
            {post.poll_data.options.map((option) => (
              <button
                key={option.id}
                className="w-full relative h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-left hover:border-emerald-500 transition-colors"
              >
                <div 
                  className="absolute inset-y-0 left-0 bg-emerald-50 dark:bg-emerald-950/30 transition-all duration-1000"
                  style={{ width: `${(option.votes / post.poll_data!.total_votes) * 100}%` }}
                />
                <div className="relative px-4 flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-700 dark:text-zinc-300">{option.text}</span>
                  <span className="text-zinc-400">{Math.round((option.votes / post.poll_data!.total_votes) * 100)}%</span>
                </div>
              </button>
            ))}
            <p className="text-[10px] text-zinc-400 text-right">{post.poll_data.total_votes} votes</p>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowReactions(false), 2000)}
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all ${liked ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current scale-110' : ''}`} />
              <span className="text-xs font-bold">{post.likes + (liked && !post.liked_by_user ? 1 : 0)}</span>
            </button>

            {/* Reactions Popup */}
            <AnimatePresence>
              {showReactions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  onMouseEnter={() => setShowReactions(true)}
                  className="absolute left-0 bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-1.5 flex items-center gap-2 z-20"
                >
                  {REACTION_TYPES.map((reaction) => (
                    <button
                      key={reaction.id}
                      className="hover:scale-125 transition-transform p-1.5 group/reaction relative"
                      title={reaction.label}
                    >
                      <reaction.icon className={`w-5 h-5 ${reaction.color} ${reaction.id === 'like' ? 'fill-current' : ''}`} />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/reaction:opacity-100 transition-opacity whitespace-nowrap">
                        {reaction.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold">{post.comments_count}</span>
          </button>
        </div>

        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
