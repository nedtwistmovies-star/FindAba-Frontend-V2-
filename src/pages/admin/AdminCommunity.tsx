import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  MessageSquare, 
  Users, 
  Flag, 
  Zap, 
  TrendingUp, 
  Heart, 
  Share2,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const AdminCommunity: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Community Control">
      <div className="space-y-8">
        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Conversations</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{posts.length}</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Engagement Rate</p>
            <h4 className="text-2xl font-black text-emerald-500 mt-1">12.4%</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Stories</p>
            <h4 className="text-2xl font-black text-[#D4AF37] mt-1">842</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Moderation Queue</p>
            <h4 className="text-2xl font-black text-rose-500 mt-1">12</h4>
          </div>
        </div>

        {/* Community Feed Monitor */}
        <DataTable 
          title="Digital City Square"
          subtitle="Real-time monitoring of all community posts and social engagement."
          isLoading={isLoading}
          data={posts}
          columns={[
            { 
              header: 'Citizen Content', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white text-xs truncate max-w-[250px]">
                      {item.content?.slice(0, 50)}...
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.profiles?.full_name || 'Citizen'}</p>
                  </div>
                </div>
              )
            },
            { 
              header: 'Engagement', 
              accessor: (item: any) => (
                <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> {item.likes_count || 0}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-blue-500" /> {item.comments_count || 0}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-emerald-500" /> {item.shares_count || 0}</span>
                </div>
              )
            },
            { 
              header: 'Trend Score', 
              accessor: (item: any) => (
                <div className="flex items-center gap-1 text-emerald-600 font-black">
                  <Zap className="w-3 h-3 fill-current" />
                  <span className="text-xs">{(item.likes_count || 0) * 1.5 + (item.comments_count || 0) * 3}</span>
                </div>
              )
            },
            { 
              header: 'Timestamp', 
              accessor: (item: any) => (
                <span className="text-xs font-bold text-zinc-400">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all" title="Promote to Trending">
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-all" title="Remove Post">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
