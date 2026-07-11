import React, { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Calendar, 
  Users, 
  MessageSquare, 
  Edit3,
  Camera,
  BadgeCheck,
  Award,
  Star,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Heart,
  Grid,
  Bookmark,
  Share2,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PostCard } from '../components/social/PostCard';
import { useSocialFeed, useUserProfileQuery } from '../services/supabaseService';

import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ProfilePage: React.FC = () => {
  const { user: localUser } = useStore();
  const { data: userProfile, isLoading: profileLoading } = useUserProfileQuery();
  const { data: feed = [] } = useSocialFeed();
  const [activeTab, setActiveTab] = useState<'Posts' | 'Media' | 'Reviews' | 'Saved'>('Posts');

  const user = userProfile || localUser;
  const userPosts = feed.filter(p => p.author_id === user?.id);

  const cityBadges = [
    { id: '1', name: 'Verified Citizen', icon: BadgeCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: '2', name: 'Top Reviewer', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: '3', name: 'Community Leader', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: '4', name: 'Made-in-Aba Champion', icon: ShieldCheck, color: 'text-[#0B7A3B]', bg: 'bg-emerald-100' },
  ];

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
      <Breadcrumbs />
      {/* Cover & Avatar Header */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <img 
            src={user?.cover_url || "https://images.unsplash.com/photo-1621640786029-220e9ff8dd09?w=1200"} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-80"
          />
          <button className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl text-white transition-all">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute -bottom-20 left-12 flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-8 border-zinc-50 dark:border-zinc-950 overflow-hidden shadow-2xl bg-white">
              <img 
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} 
                alt={user?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-[#0B7A3B] text-white rounded-xl shadow-lg border-2 border-white dark:border-zinc-950">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="pb-4 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
                {user?.name || 'Aba Citizen'}
              </h1>
              {user?.verified && <BadgeCheck className="w-6 h-6 text-blue-500 fill-current" />}
            </div>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">@{user?.email?.split('@')[0] || 'citizen_' + user?.id.slice(0, 6)}</p>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="pt-24 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-xl font-black text-zinc-900 dark:text-white">{user?.followers_count || 0}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-zinc-900 dark:text-white">{user?.following_count || 0}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Following</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-zinc-900 dark:text-white">{userPosts.length}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Posts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none px-8 py-3 bg-[#0B7A3B] text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
          <button className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-500 hover:bg-zinc-200 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-500 hover:bg-zinc-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* About */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">About</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {user?.bio || 'Passionate about the growth of local industries in Aba. Supporting Made-in-Aba products and advocating for better market infrastructure. 🇳🇬'}
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-zinc-500 font-bold">
                <MapPin className="w-4 h-4 text-[#0B7A3B]" />
                <span>{user?.address || 'Ariaria, Aba South'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-500 font-bold">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'June 2024'}</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              City Badges <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {cityBadges.map((badge) => (
                <div key={badge.id} className={`${badge.bg} p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-zinc-100 dark:border-zinc-800 transition-transform hover:scale-105`}>
                  <badge.icon className={`w-8 h-8 ${badge.color}`} />
                  <p className="text-[10px] font-black text-zinc-800 dark:text-zinc-200 leading-tight">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-8 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
            {['Posts', 'Media', 'Reviews', 'Saved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-sm font-black transition-all relative whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-[#0B7A3B]' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B7A3B] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'Posts' ? (
              userPosts.length > 0 ? (
                userPosts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="p-20 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem]">
                  <Grid className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">No posts yet</h3>
                  <p className="text-sm text-zinc-500 mt-2">When you share dispatches, they will appear here.</p>
                </div>
              )
            ) : (
              <div className="p-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <LayoutGrid className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-zinc-400">Section Empty</h3>
                <p className="text-sm text-zinc-400 mt-1">This part of your profile is waiting for your activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
