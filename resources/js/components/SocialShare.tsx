import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';
interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}
export default function SocialShare({ title, description, url, imageUrl }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
      }
    }
  };
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
  };
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white">Share</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => window.open(shareLinks.facebook, '_blank', 'width=600,height=400')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </button>
        <button
          onClick={() => window.open(shareLinks.twitter, '_blank', 'width=600,height=400')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </button>
        <button
          onClick={() => window.open(shareLinks.linkedin, '_blank', 'width=600,height=400')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            More
          </button>
        )}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}