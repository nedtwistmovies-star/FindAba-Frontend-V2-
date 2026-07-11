import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Sparkles,
  Search,
  TrendingUp,
  Filter,
  Image as ImageIcon,
  Video,
  BarChart2,
  HelpCircle,
  PartyPopper,
  Megaphone,
  Loader2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useSocialFeed, useStoriesQuery } from '../services/supabaseService';
import { PostCard } from '../components/social/PostCard';
import { StoryCard } from '../components/social/StoryCard';

export const CommunityPage: React.FC = () => {
  const { user, addPost } = useStore();
  const { data: feed = [], isLoading: isFeedLoading, error: feedError } = useSocialFeed();
  const { data: stories = [], isLoading: isStoriesLoading } = useStoriesQuery();
  
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Feed' | 'Trending' | 'Businesses' | 'Groups'>('Feed');
  
  // Post Creation State
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'poll' | 'question' | 'celebration'>('text');
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');

  const handlePublishPost = async () => {
    if (!postContent) return;
    
    await addPost({
      author_id: user?.id || 'usr_demo1',
      author_name: user?.name || 'Aba Citizen',
      author_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      type: postType,
      category: 'general',
      title: postTitle,
      content: postContent,
    });

    setIsCreating(false);
    setPostContent('');
    setPostTitle('');
  };

  const filteredFeed = useMemo(() => {
    return feed.filter(item => 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [feed, searchQuery]);

  const trendingHashtags = [
    { tag: '#MadeInAba', count: '1.2k posts' },
    { tag: '#AriariaMarket', count: '856 posts' },
    { tag: '#AbaFashionWeek', count: '542 posts' },
    { tag: '#AbaElectric', count: '321 posts' },
  ];

  const suggestedPeople = [
    { name: 'Engr. Nnamdi', role: 'Community Leader', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'Aba Fashion House', role: 'Verified Merchant', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100' },
    { name: 'Chef Amaka', role: 'Top Creator', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 space-y-8">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter flex items-center gap-2">
            Aba Connect <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">The heartbeat of Enyimba City</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search people, posts, events..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#0B7A3B] transition-all"
            />
          </div>
          <button className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-200 transition-colors">
            <Filter className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Feed & Creation */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stories Rail */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            <StoryCard isAdd />
            {isStoriesLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-32 h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              ))
            ) : (
              stories.map(story => <StoryCard key={story.id} story={story} />)
            )}
          </div>

          {/* Creation Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm space-y-6">
            <div className="flex gap-4">
              <img 
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20" 
                alt="" 
              />
              <button 
                onClick={() => setIsCreating(true)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-3xl px-6 py-3 text-left text-zinc-400 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-medium"
              >
                What's happening in Aba today, {user?.name?.split(' ')[0]}?
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1 md:gap-4">
                <button onClick={() => { setPostType('image'); setIsCreating(true); }} className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors group">
                  <ImageIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hidden sm:block">Photo</span>
                </button>
                <button onClick={() => { setPostType('video'); setIsCreating(true); }} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl transition-colors group">
                  <Video className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hidden sm:block">Video</span>
                </button>
                <button onClick={() => { setPostType('poll'); setIsCreating(true); }} className="flex items-center gap-2 px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors group">
                  <BarChart2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hidden sm:block">Poll</span>
                </button>
                <button onClick={() => { setPostType('celebration'); setIsCreating(true); }} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl transition-colors group">
                  <PartyPopper className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hidden sm:block">Celebrate</span>
                </button>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-[#0B7A3B] text-white px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Post
              </button>
            </div>
          </div>

          {/* Feed Tabs */}
          <div className="flex items-center gap-6 border-b border-zinc-100 dark:border-zinc-800">
            {['Feed', 'Trending', 'Businesses', 'Groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab 
                    ? 'text-[#0B7A3B]' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B7A3B] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {isFeedLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 h-64 rounded-[2rem] animate-pulse border border-zinc-100 dark:border-zinc-800" />
              ))
            ) : feedError ? (
              <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/20 rounded-[2rem] border border-rose-100 dark:border-rose-900/30">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100">Unable to load feed</h3>
                <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">Please check your internet connection or try again later.</p>
              </div>
            ) : filteredFeed.length === 0 ? (
              <div className="p-20 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                <Users className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No dispatches found</h3>
                <p className="text-sm text-zinc-500 mt-2">Try adjusting your search or follow more people to fill your feed.</p>
              </div>
            ) : (
              filteredFeed.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Trending Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                Trending <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              </h3>
              <button className="text-xs font-bold text-[#0B7A3B]">View all</button>
            </div>
            <div className="space-y-4">
              {trendingHashtags.map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between group p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-[#0B7A3B] transition-colors">{item.tag}</p>
                    <p className="text-[10px] text-zinc-400">{item.count}</p>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Discover People</h3>
              <button className="text-xs font-bold text-[#0B7A3B]">Refresh</button>
            </div>
            <div className="space-y-5">
              {suggestedPeople.map((person, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={person.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{person.name}</p>
                      <p className="text-[10px] text-zinc-500">{person.role}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#0B7A3B] hover:text-white text-[#0B7A3B] rounded-full text-xs font-black transition-all">
                    Follow
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-200 transition-all">
              Discover More
            </button>
          </div>

          {/* Quick Stats/Announcements */}
          <div className="bg-gradient-to-br from-[#0B7A3B] to-[#169C4A] rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20">
            <Megaphone className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-lg font-black mb-2">Aba Town Hall Notice</h3>
            <p className="text-xs leading-relaxed opacity-90 mb-4">
              Ariaria International Market will be closing early today for general maintenance. Merchants are advised to secure their shops by 4 PM.
            </p>
            <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-all backdrop-blur-sm">
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white capitalize">Create {postType}</h3>
                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <Plus className="w-6 h-6 rotate-45 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <img src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} className="w-12 h-12 rounded-full object-cover" alt="" />
                  <div className="flex-1 space-y-4">
                    <input 
                      type="text" 
                      placeholder="Title (Optional)"
                      value={postTitle || ''}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-lg font-black placeholder:text-zinc-300 focus:ring-0"
                    />
                    <textarea 
                      placeholder="What's on your mind?"
                      value={postContent || ''}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={6}
                      className="w-full bg-transparent border-none p-0 text-sm placeholder:text-zinc-400 focus:ring-0 resize-none"
                    />
                  </div>
                </div>

                {postType === 'poll' && (
                  <div className="space-y-3 pl-16">
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 space-y-3 border border-zinc-100 dark:border-zinc-700">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Poll Options</span>
                      </div>
                      <input type="text" placeholder="Option 1" className="w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-2 text-xs border border-zinc-200 dark:border-zinc-700 focus:ring-1 focus:ring-emerald-500" />
                      <input type="text" placeholder="Option 2" className="w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-2 text-xs border border-zinc-200 dark:border-zinc-700 focus:ring-1 focus:ring-emerald-500" />
                      <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl text-zinc-500 hover:text-emerald-500 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl text-zinc-500 hover:text-blue-500 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl text-zinc-500 hover:text-amber-500 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handlePublishPost}
                  className="px-8 py-3 bg-[#0B7A3B] text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                  Publish Post
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
