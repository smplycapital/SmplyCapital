import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import {
  RiSendPlaneLine,
  RiChat3Line,
  RiTeamLine,
  RiGlobalLine,
  RiRefreshLine,
  RiSearchLine,
  RiFilterLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiMailSendLine,
  RiPhoneLine,
} from 'react-icons/ri';

const STATUS_COLORS = {
  NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  QUEUED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  SENT: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  REPLIED: 'bg-green-500/20 text-green-300 border-green-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  OPTED_OUT: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_OPTIONS = ['ALL', 'NEW', 'QUEUED', 'SENT', 'DELIVERED', 'REPLIED', 'FAILED', 'OPTED_OUT'];

function StatCard({ icon: Icon, label, value, detail, color, loading }) {
  return (
    <div className="card-dark flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-white/30 text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        {loading ? (
          <div className="h-9 w-20 bg-white/5 rounded animate-pulse" />
        ) : (
          <span className="font-display text-3xl font-bold text-white leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        )}
      </div>
      {detail && <span className="text-white/30 text-xs">{detail}</span>}
    </div>
  );
}

function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || 'bg-white/10 text-white/60 border-white/20';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-sm ${colorClass}`}>
      {status === 'REPLIED' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
      {status}
    </span>
  );
}

export default function S2L() {
  const [stats, setStats] = useState({ total: 0, sent: 0, replied: 0, sources: 0 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('updated_at');
  const [sortDir, setSortDir] = useState('desc');
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const [totalRes, sentRes, repliedRes, sourcesRes] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .in('status', ['SENT', 'DELIVERED', 'REPLIED']),
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'REPLIED'),
        supabase.from('leads').select('source'),
      ]);

      const uniqueSources = sourcesRes.data
        ? new Set(sourcesRes.data.map((r) => r.source).filter(Boolean)).size
        : 0;

      setStats({
        total: totalRes.count || 0,
        sent: sentRes.count || 0,
        replied: repliedRes.count || 0,
        sources: uniqueSources,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setTableLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order(sortField, { ascending: sortDir === 'asc' })
        .limit(100);

      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      if (search.trim()) {
        query = query.or(
          `name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setTableLoading(false);
    }
  }, [statusFilter, search, sortField, sortDir]);

  const refreshAll = useCallback(() => {
    fetchStats();
    fetchLeads();
    setLastRefresh(new Date());
  }, [fetchStats, fetchLeads]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Real-time subscription for lead status changes
  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchStats();
        fetchLeads();
        setLastRefresh(new Date());
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats, fetchLeads]);

  // Refetch when filters change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <RiArrowUpSLine className="w-3.5 h-3.5 text-gold" />
    ) : (
      <RiArrowDownSLine className="w-3.5 h-3.5 text-gold" />
    );
  };

  const formatTime = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Head>
        <title>S2L Command Center — Simply Capital</title>
        <meta name="description" content="Send-to-Lead dashboard for tracking outreach, replies, and lead engagement." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <NavBar />

      <main className="min-h-screen pt-24 pb-16 bg-navy-950 relative">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

        <div className="container-custom relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="section-subheading">Command Center</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
                S2L <span className="text-gradient-gold">Dashboard</span>
              </h1>
              <p className="text-white/40 text-sm mt-2">
                Real-time lead outreach tracking &amp; engagement metrics.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastRefresh && (
                <span className="text-white/20 text-xs">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={refreshAll}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-white/70 hover:text-gold hover:border-gold/30 transition-all text-sm"
              >
                <RiRefreshLine className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              icon={RiTeamLine}
              label="Total Leads"
              value={stats.total}
              detail="All leads in pipeline"
              color="bg-blue-500/10 text-blue-400"
              loading={loading}
            />
            <StatCard
              icon={RiSendPlaneLine}
              label="Messages Sent"
              value={stats.sent}
              detail="Sent, delivered, or replied"
              color="bg-indigo-500/10 text-indigo-400"
              loading={loading}
            />
            <StatCard
              icon={RiChat3Line}
              label="Replied"
              value={stats.replied}
              detail="Leads who responded"
              color="bg-green-500/10 text-green-300"
              loading={loading}
            />
            <StatCard
              icon={RiGlobalLine}
              label="Sources"
              value={stats.sources}
              detail="Distinct lead sources"
              color="bg-gold/10 text-gold"
              loading={loading}
            />
          </div>

          {/* Filters Bar */}
          <div className="card-dark mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              {/* Status Filter */}
              <div className="relative">
                <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[160px]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === 'ALL' ? 'All Statuses' : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="card-dark overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      { key: 'name', label: 'Lead' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'source', label: 'Source' },
                      { key: 'status', label: 'Status' },
                      { key: 'updated_at', label: 'Last Updated' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="text-left px-5 py-4 text-white/40 font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-gold transition-colors select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <SortIcon field={col.key} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-white/5 rounded animate-pulse w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <RiMailSendLine className="w-10 h-10 text-white/10" />
                          <p className="text-white/30 text-sm">
                            {search || statusFilter !== 'ALL'
                              ? 'No leads match your filters.'
                              : 'No leads yet. They\'ll appear here once your n8n workflow starts sending.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {lead.name || '—'}
                            </span>
                            {lead.email && (
                              <span className="text-white/30 text-xs mt-0.5">{lead.email}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-white/60 flex items-center gap-1.5">
                            <RiPhoneLine className="w-3.5 h-3.5 text-white/30" />
                            {lead.phone || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-white/50">{lead.source || '—'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-white/40 flex items-center gap-1.5">
                            <RiTimeLine className="w-3.5 h-3.5 text-white/20" />
                            {formatTime(lead.updated_at)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            {!tableLoading && leads.length > 0 && (
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-white/20 text-xs">
                  Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <RiCheckboxCircleLine className="w-3.5 h-3.5 text-green-400/50" />
                  <span className="text-white/20 text-xs">Real-time updates active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
