import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Share2, DollarSign, TrendingUp, Users, Copy, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
interface Props {
  user: any;
}
export default function AffiliateProgram({ user }: Props) {
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    fetch('/api/affiliate/dashboard')
      .then(res => res.json())
      .then(data => setAffiliateData(data));
  }, []);
  const handleGenerateCode = () => {
    fetch('/api/affiliate/generateCode', { method: 'POST' })
      .then(res => res.json())
      .then(data => setAffiliateData({ ...affiliateData, affiliate: { ...affiliateData.affiliate, ...data } }));
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!affiliateData) {
    return (
      <Layout>
        <Head title="Affiliate Program" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }
  const referralUrl = affiliateData.affiliate?.affiliateCode
    ? `${window.location.origin}/register?ref=${affiliateData.affiliate.affiliateCode}`
    : null;
  return (
    <Layout>
      <Head title="Affiliate Program" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Affiliate Program</h1>
            <p className="text-slate-600 dark:text-slate-400">Earn commission by referring new students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <DollarSign className="w-8 h-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-1">${affiliateData.affiliate?.totalEarnings || 0}</div>
              <div className="text-blue-100">Total Earnings</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <TrendingUp className="w-8 h-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-1">${affiliateData.affiliate?.pendingEarnings || 0}</div>
              <div className="text-purple-100">Pending Earnings</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <Users className="w-8 h-8 mb-4 opacity-80" />
              <div className="text-3xl font-bold mb-1">{affiliateData.affiliate?.totalReferrals || 0}</div>
              <div className="text-green-100">Total Referrals</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Your Referral Link</h2>
            </div>
            {!affiliateData.affiliate?.affiliateCode ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 mb-6">Generate your unique referral code to start earning</p>
                <button
                  onClick={handleGenerateCode}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Generate Affiliate Code
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Affiliate Code</div>
                      <div className="text-2xl font-bold text-blue-600">{affiliateData.affiliate.affiliateCode}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(affiliateData.affiliate.affiliateCode)}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                {referralUrl && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Referral URL</div>
                        <div className="text-sm font-mono text-blue-600 break-all">{referralUrl}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(referralUrl)}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Commission Rate:</strong> {affiliateData.affiliate.commissionRate}% per successful referral
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Recent Referrals</h2>
            <div className="space-y-4">
              {affiliateData.referrals?.length > 0 ? (
                affiliateData.referrals.map((referral: any) => (
                  <div key={referral.referralId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div>
                      <div className="font-medium">{referral.referredUser?.userName}</div>
                      <div className="text-sm text-slate-500">${referral.commissionAmount} - {referral.commissionStatus}</div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {referral.convertedAt ? new Date(referral.convertedAt).toLocaleDateString() : 'Pending'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No referrals yet. Share your link to start earning!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}