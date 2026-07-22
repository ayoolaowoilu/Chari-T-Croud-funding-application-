'use client';

import { useEffect, useState } from 'react';
import { FetchProfile } from '../lib/fetchRequests';
import { useSession } from 'next-auth/react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/footer';
import { DualRingSpinner } from '../components/ui/loading';
import {
  AlertCircle,
  Users,
  Building2,
  Megaphone,
  CheckCircle,
  Clock,
  CreditCard,
  Flag,
  ChevronLeft,
  ChevronRight,
  Search,
  Ban,
  Check,
  X,
  Trash2,
  ShieldAlert,
  FileText,
  UserCheck,
  UserX,
  HandCoins,
  ExternalLink,
  MapPin,
  Globe,
  Phone,
  Calendar,
} from 'lucide-react';
import Button from '../components/ui/button';

// ─── Types ─────────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  totalCenters: number;
  all_time_campaigns: number;
  funded_campaigns: number;
  due_campaigns: number;
  all_time_transactions: number;
  reported_campaigns: number;
}

interface Campaign {
  id: number;
  name: string;
  main_img: string;
  goal: number;
  raised: number;
  _type: string;
  center_name: string | null;
  user_id: number;
  date_to_completion: number; // Date.now() timestamp
  created_at: string;
  currency: 'NG' | 'USD' | 'EURO';
  category: string;
  donation_count: number;
  safety_rating: 'verified_safe' | 'likely_safe' | 'uncertain' | 'likely_risky' | 'unsafe';
  reports: number;
}

interface Center {
  id?: number;
  name: string;
  registration_number: string;
  email: string;
  userEmail: string;
  phone: string;
  address: string;
  website: string;
  is_verified_status: 'pending' | 'verified' | 'rejected';
  about: string;
  logourl: string | null;
  geo_location: string;
  verification_documents: { url: string; type: string }[];
  created_at?: string;
}

interface KycData {
  id: number;
  user_id: number;
  full_name: string;
  date_of_birth: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  document_type: 'NIN' | 'BVN' | 'DRIVERS_LICENSE' | 'PASSPORT' | 'VOTERS_CARD';
  document_number: string;
  document_url: string;
  document_public_id: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

interface UserData {
  id?: number;
  full_name: string;
  email: string;
  is_verified: number;
  created_at: string;
  image: string;
  donations: number;
  recived: number;
  method: string;
  kyc?: KycData;
}

interface Transaction {
  id: number;
  owner_id: number;
  refrence: string;
  ammount: number;
  payer_id: number | null;
  paid_to: 'normal' | 'center';
  created_at?: string;
}

type TableType = 'users' | 'centers' | 'campaigns' | 'transactions';
type CampaignFilter = 'all' | 'funded' | 'due' | 'reported';

function KycModal({
  isOpen,
  onClose,
  user,
  kyc,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  kyc: KycData | null;
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 text-sm font-bold">
              {user.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                user.full_name?.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.full_name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!kyc ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No KYC submission found for this user.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Status Banner */}
            <div
              className={`rounded-xl p-4 flex items-center gap-3 ${
                kyc.status === 'approved'
                  ? 'bg-green-50 border border-green-200'
                  : kyc.status === 'rejected'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-amber-50 border border-amber-200'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  kyc.status === 'approved'
                    ? 'bg-green-500'
                    : kyc.status === 'rejected'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                }`}
              />
              <span
                className={`font-medium capitalize ${
                  kyc.status === 'approved'
                    ? 'text-green-700'
                    : kyc.status === 'rejected'
                      ? 'text-red-700'
                      : 'text-amber-700'
                }`}
              >
                {kyc.status}
              </span>
              {kyc.reviewed_at && (
                <span className="text-sm text-gray-500 ml-auto">
                  Reviewed {new Date(kyc.reviewed_at).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Personal Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{kyc.full_name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {new Date(kyc.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{kyc.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Document Type</p>
                  <p className="font-medium text-gray-900">{kyc.document_type.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Address
              </h4>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-900">{kyc.address_line}</p>
                <p className="text-gray-500">
                  {kyc.city}, {kyc.state}
                </p>
              </div>
            </div>

            {/* Document */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Document
              </h4>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{kyc.document_type.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500 font-mono">{kyc.document_number}</p>
                </div>
                <a
                  href={kyc.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Rejection Reason */}
            {kyc.rejection_reason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm font-medium text-red-700">Rejection Reason</p>
                <p className="text-sm text-red-600 mt-1">{kyc.rejection_reason}</p>
              </div>
            )}

            {/* Submitted */}
            <p className="text-xs text-gray-400 text-center">
              Submitted on {new Date(kyc.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CenterDocsModal({
  isOpen,
  onClose,
  center,
}: {
  isOpen: boolean;
  onClose: () => void;
  center: Center | null;
}) {
  if (!isOpen || !center) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Center Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
              {center.logourl ? (
                <img src={center.logourl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{center.name}</h4>
              <p className="text-sm text-gray-500">{center.registration_number}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={center.is_verified_status} />
              </div>
            </div>
          </div>

          {/* Contact & Web */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MailIcon className="w-4 h-4 text-gray-400" />
                {center.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {center.phone}
              </div>
              {center.website && (
                <a
                  href={
                    center.website.startsWith('http') ? center.website : `https://${center.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  {center.website}
                </a>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Location
            </h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span>{center.address}</span>
              </div>
              {center.geo_location && (
                <p className="text-xs text-gray-500 mt-1 font-mono">{center.geo_location}</p>
              )}
            </div>
          </div>

          {/* About */}
          {center.about && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                About
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{center.about}</p>
            </div>
          )}

          {/* Verification Documents */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Verification Documents
            </h4>
            {!center.verification_documents?.length ? (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            ) : (
              <div className="space-y-2">
                {center.verification_documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{doc.type}</p>
                      <p className="text-xs text-gray-500 truncate">{doc.url}</p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

function StatCard({ label, value, icon, accent = 'default', onClick }: StatCardProps) {
  const accentStyles = {
    default: 'border-gray-200 hover:border-gray-300',
    success: 'border-green-200 bg-green-50/50 hover:border-green-300',
    warning: 'border-amber-200 bg-amber-50/50 hover:border-amber-300',
    danger: 'border-red-200 bg-red-50/50 hover:border-red-300',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border ${accentStyles[accent]} bg-white p-6 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="p-2 rounded-lg bg-gray-100 text-gray-700 w-fit">{icon}</div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </button>
  );
}

function SafetyBadge({ rating }: { rating: Campaign['safety_rating'] }) {
  const styles = {
    verified_safe: 'bg-green-100 text-green-700',
    likely_safe: 'bg-emerald-100 text-emerald-700',
    uncertain: 'bg-amber-100 text-amber-700',
    likely_risky: 'bg-orange-100 text-orange-700',
    unsafe: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[rating] || 'bg-gray-100 text-gray-600'}`}
    >
      {rating?.replace('_', ' ') || 'Unknown'}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    active: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
}

export default function Page() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stage, setStage] = useState<1 | 2>(1);
  const [stats, setStats] = useState<Stats | null>(null);

  const [activeTable, setActiveTable] = useState<TableType>('campaigns');
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>('all');
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [txTotal, setTxTotal] = useState(0);

  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedKyc, setSelectedKyc] = useState<KycData | null>(null);

  const [centerModalOpen, setCenterModalOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(false);
    if (status === 'loading') return;

    try {
      const resp = await FetchProfile(session?.user?.email as string);
      if (resp.error) {
        setError(true);
        return;
      }
      if (resp.userData.role !== 'admin') {
        window.location.href = '/';
        return;
      }

      const resp1 = await fetch('/api/ad45667899/stats');
      if (!resp1.ok) {
        setError(true);
        return;
      }
      const data: Stats = await resp1.json();
      setStats(data);
    } catch (_error) {
      console.log(_error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchTableData = async (
    targetTable: TableType,
    targetPage: number = 0,
    filter?: CampaignFilter,
  ) => {
    setTableLoading(true);
    try {
      let url = `/api/ad45667899/data?page=${targetPage}&table=${targetTable}`;
      if (targetTable === 'campaigns' && filter && filter !== 'all') {
        url += `&_type=${filter}`;
      }
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Failed to fetch');
      const data = await resp.json();
      setTableData(data.rows || []);
      setTotalPages(data.totalPages || 1);
      setPage(targetPage);

      // Calculate transaction total
      if (targetTable === 'transactions') {
        const total = (data.rows || []).reduce(
          (sum: number, tx: Transaction) => sum + (tx.ammount || 0),
          0,
        );
        setTxTotal(total);
      }
    } catch (_error) {
      console.log(_error);
    } finally {
      setTableLoading(false);
    }
  };
  const fetchKyc = async (userId: number) => {
    try {
      const resp = await fetch(`/api/ad45667899/kyc?userId=${userId}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      console.log(data);
      return (data.kyc as KycData) || null;
    } catch (_error) {
      console.log(_error);
      return null;
    }
  };
  const openKycModal = async (user: UserData) => {
    setSelectedUser(user);
    const kyc = user.id ? await fetchKyc(user.id) : null;
    setSelectedKyc(kyc);
    setKycModalOpen(true);
  };
  const openCenterModal = (center: Center) => {
    setSelectedCenter(center);
    setCenterModalOpen(true);
  };
  const handleVerifyUser = async (email: string, verify: boolean) => {
    try {
      await fetch(`/api/ad45667899/users/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verify }),
      });
      fetchTableData(activeTable, page, campaignFilter);
    } catch (_error) {
      console.log(_error);
    }
  };
  const handleBanUser = async (email: string) => {
    if (!confirm('Ban this user permanently?')) return;
    try {
      await fetch(`/api/ad45667899/users/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      fetchTableData(activeTable, page, campaignFilter);
    } catch (_error) {
      console.log(_error);
    }
  };
  const handleVerifyCenter = async (email: string, verify: boolean) => {
    try {
      await fetch(`/api/ad45667899/centers/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verify }),
      });
      fetchTableData(activeTable, page, campaignFilter);
    } catch (_error) {
      console.log(_error);
    }
  };
  const handleTakeDownCampaign = async (id: number) => {
    if (!confirm('Take down this campaign?')) return;
    try {
      await fetch(`/api/ad45667899/campaigns/${id}/takedown`, { method: 'POST' });
      fetchTableData(activeTable, page, campaignFilter);
    } catch (_error) {
      console.log(_error);
    }
  };
  const handleRefundTransaction = async (id: number) => {
    if (!confirm('Refund this transaction?')) return;
    try {
      await fetch(`/api/ad45667899/transactions/${id}/refund`, { method: 'POST' });
      fetchTableData(activeTable, page, campaignFilter);
    } catch (_error) {
      console.log(_error);
    }
  };
  const goToStage2 = (table: TableType, filter?: CampaignFilter) => {
    setActiveTable(table);
    if (filter) setCampaignFilter(filter);
    setPage(0);
    setSearchQuery('');
    setTxTotal(0);
    fetchTableData(table, 0, filter);
    setStage(2);
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, status]);

  const filteredData = tableData.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (activeTable === 'users')
      return item.full_name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q);
    if (activeTable === 'centers')
      return item.name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q);
    if (activeTable === 'campaigns')
      return item.name?.toLowerCase().includes(q) || item.center_name?.toLowerCase().includes(q);
    if (activeTable === 'transactions')
      return item.refrence?.toLowerCase().includes(q) || item.owner_id?.toString().includes(q);
    return true;
  });

  const formatCampaignDate = (ts: number) => {
    if (!ts || ts < 100000000000) return '—';
    return new Date(ts).toLocaleDateString();
  };
  const isCampaignDue = (ts: number) => {
    if (!ts) return false;
    return ts > Date.now();
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-white">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <DualRingSpinner />
        </div>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Error</h2>
            <p className="text-gray-500 text-sm mt-2">Unable to load admin data</p>
            <Button variant="secondary" className="mt-6" onClick={fetchUserData} details="Retry" />
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (stage === 1) {
    return (
      <div className="bg-white w-screen min-h-screen">
        <NavBar />
        <main className="text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Time Stats</h1>
              <p className="text-sm text-gray-500">Platform overview and key metrics</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={stats?.totalUsers || 0}
                icon={<Users className="w-5 h-5" />}
                onClick={() => goToStage2('users')}
              />
              <StatCard
                label="Total Centers"
                value={stats?.totalCenters || 0}
                icon={<Building2 className="w-5 h-5" />}
                onClick={() => goToStage2('centers')}
              />
              <StatCard
                label="All Time Campaigns"
                value={stats?.all_time_campaigns || 0}
                icon={<Megaphone className="w-5 h-5" />}
                onClick={() => goToStage2('campaigns', 'all')}
              />
              <StatCard
                label="Funded Campaigns"
                value={stats?.funded_campaigns || 0}
                icon={<CheckCircle className="w-5 h-5" />}
                accent="success"
                onClick={() => goToStage2('campaigns', 'funded')}
              />
              <StatCard
                label="Due Campaigns"
                value={stats?.due_campaigns || 0}
                icon={<Clock className="w-5 h-5" />}
                accent="warning"
                onClick={() => goToStage2('campaigns', 'due')}
              />
              <StatCard
                label="All Time Transactions"
                value={stats?.all_time_transactions || 0}
                icon={<CreditCard className="w-5 h-5" />}
                onClick={() => goToStage2('transactions')}
              />
              <StatCard
                label="Reported Campaigns"
                value={stats?.reported_campaigns || 0}
                icon={<Flag className="w-5 h-5" />}
                accent="danger"
                onClick={() => goToStage2('campaigns', 'reported')}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white w-screen min-h-screen">
      <NavBar />

      <KycModal
        isOpen={kycModalOpen}
        onClose={() => {
          setKycModalOpen(false);
          setSelectedUser(null);
          setSelectedKyc(null);
        }}
        user={selectedUser}
        kyc={selectedKyc}
      />
      <CenterDocsModal
        isOpen={centerModalOpen}
        onClose={() => {
          setCenterModalOpen(false);
          setSelectedCenter(null);
        }}
        center={selectedCenter}
      />

      <main className="text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setStage(1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTable === 'campaigns' && campaignFilter !== 'all'
                ? `${campaignFilter} Campaigns`
                : activeTable}
            </h1>
            <p className="text-sm text-gray-500">Manage and review {activeTable} data</p>
          </div>
        </div>

        {activeTable === 'transactions' && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₦{txTotal.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Across {filteredData.length} transactions</p>
          </div>
        )}

        {/* Campaign Filter Tabs */}
        {activeTable === 'campaigns' && (
          <div className="flex gap-2 mb-6">
            {(['all', 'funded', 'due', 'reported'] as CampaignFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setCampaignFilter(f);
                  fetchTableData('campaigns', 0, f);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  campaignFilter === f
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTable}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {tableLoading ? (
            <div className="flex items-center justify-center py-20">
              <DualRingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  {activeTable === 'users' && (
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  )}
                  {activeTable === 'centers' && (
                    <tr>
                      <th className="px-6 py-4">Center</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  )}
                  {activeTable === 'campaigns' && (
                    <tr>
                      <th className="px-6 py-4">Campaign</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4">Donors</th>
                      <th className="px-6 py-4">Safety</th>
                      <th className="px-6 py-4">Deadline</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  )}
                  {activeTable === 'transactions' && (
                    <tr>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  )}
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                        No data found
                      </td>
                    </tr>
                  )}

                  {activeTable === 'users' &&
                    filteredData.map((user: UserData, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 text-xs font-bold">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                user.full_name?.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.full_name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.is_verified ? 'verified' : 'pending'} />
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* KYC Check */}
                            <button
                              onClick={() => openKycModal(user)}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                              title="Review KYC"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            {/* Verify / Unverify */}
                            {user.is_verified ? (
                              <button
                                onClick={() => handleVerifyUser(user.email, false)}
                                className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                                title="Unverify User"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerifyUser(user.email, true)}
                                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                title="Verify User"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            {/* Ban */}
                            <button
                              onClick={() => handleBanUser(user.email)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Ban User"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {activeTable === 'centers' &&
                    filteredData.map((center: Center, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                              {center.logourl ? (
                                <img
                                  src={center.logourl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{center.name}</p>
                              <p className="text-xs text-gray-500">{center.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={center.is_verified_status} />
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-50 truncate">
                          {center.address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Full Details + Documents */}
                            <button
                              onClick={() => openCenterModal(center)}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                              title="View Details & Documents"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            {/* Verify / Reject / Revoke */}
                            {center.is_verified_status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleVerifyCenter(center.email, true)}
                                  className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                  title="Verify Center"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleVerifyCenter(center.email, false)}
                                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                  title="Reject Center"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {center.is_verified_status === 'verified' && (
                              <button
                                onClick={() => handleVerifyCenter(center.email, false)}
                                className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                                title="Revoke Verification"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                  {activeTable === 'campaigns' &&
                    filteredData.map((campaign: Campaign, index: number) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                              {campaign.main_img ? (
                                <img
                                  src={
                                    campaign.main_img.startsWith('http')
                                      ? campaign.main_img
                                      : JSON.parse(campaign.main_img)?.url
                                  }
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Megaphone className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {campaign.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {campaign.center_name || 'No center'} · {campaign.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span
                                className={
                                  campaign.raised >= campaign.goal
                                    ? 'text-green-600 font-medium'
                                    : 'text-gray-500'
                                }
                              >
                                {campaign.currency} {campaign.raised?.toLocaleString()}
                              </span>
                              <span className="font-medium text-gray-900">
                                {campaign.currency} {campaign.goal?.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${campaign.raised >= campaign.goal ? 'bg-green-600' : 'bg-gray-800'}`}
                                style={{
                                  width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <HandCoins className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{campaign.donation_count || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <SafetyBadge rating={campaign.safety_rating} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar
                              className={`w-3.5 h-3.5 ${isCampaignDue(Number(campaign.date_to_completion)) ? 'text-amber-500' : 'text-gray-400'}`}
                            />
                            <span
                              className={`${isCampaignDue(Number(campaign.date_to_completion)) ? 'text-amber-600 font-medium' : 'text-gray-600'}`}
                            >
                              {formatCampaignDate(Number(campaign.date_to_completion))}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleTakeDownCampaign(campaign.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Take Down Campaign"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {activeTable === 'transactions' &&
                    filteredData.map((tx: Transaction, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{tx.refrence}</td>
                        <td className="px-6 py-4 text-gray-900">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {tx.paid_to}
                            </span>
                            <span className="text-sm">ID: {tx.owner_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ₦{tx.ammount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              tx.payer_id
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tx.payer_id ? 'Donation' : 'System'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {tx.payer_id && (
                              <button
                                onClick={() => handleRefundTransaction(tx.id)}
                                className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                                title="Refund"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing {filteredData.length} results</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTableData(activeTable, page - 1, campaignFilter)}
              disabled={page === 0 || tableLoading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-3">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => fetchTableData(activeTable, page + 1, campaignFilter)}
              disabled={page >= totalPages - 1 || tableLoading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
