import React, { useState } from 'react';
import { Gift, Award, Coins, Share2, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { selectDashboardData } from '../../redux/features/dashboardSlice';
import { useSelector } from 'react-redux';

const ReferralSystem = () => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const dashboardData = useSelector(selectDashboardData);

  // Get referral code from dashboardData
  const referralCode = dashboardData?.user?.referral || "ABC123";

  // Generate referral link
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share functions
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on this amazing platform!')}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareByEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent('Join me on this platform!')}&body=${encodeURIComponent(`Hey! I think you'd love this platform. Use my referral code ${referralCode} or sign up through this link: ${referralLink}`)}`, '_blank');
  };

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">Referral & Earning System</h2>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6 mb-8">
        <div className="text-center mb-4">
          <h3 className="font-bold text-xl mb-2">Your Referral Code</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-mono bg-white/20 px-4 py-2 rounded">{referralCode}</span>
            <button
              onClick={copyToClipboard}
              className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition"
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && <p className="text-sm mt-2 text-white/80">✓ Copied to clipboard!</p>}
        </div>

        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-full bg-white text-purple-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Share & Earn Rewards
        </button>

        {showShareOptions && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            <button onClick={shareOnFacebook} className="bg-blue-600 p-3 rounded-lg flex flex-col items-center">
              <Facebook size={20} />
              <span className="text-xs mt-1">Facebook</span>
            </button>
            <button onClick={shareOnTwitter} className="bg-blue-400 p-3 rounded-lg flex flex-col items-center">
              <Twitter size={20} />
              <span className="text-xs mt-1">Twitter</span>
            </button>
            <button onClick={shareOnLinkedIn} className="bg-blue-700 p-3 rounded-lg flex flex-col items-center">
              <Linkedin size={20} />
              <span className="text-xs mt-1">LinkedIn</span>
            </button>
            <button onClick={shareByEmail} className="bg-gray-600 p-3 rounded-lg flex flex-col items-center">
              <Mail size={20} />
              <span className="text-xs mt-1">Email</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referrals Card */}
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-pink-100 p-2 rounded-full">
              <Gift className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold">Your Referrals</h3>
          </div>
          <div className="text-3xl font-bold text-center mb-4">
            {dashboardData?.user?.referralPoint || 0}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Points Earned</span>
              <span className="font-semibold">{dashboardData?.user?.referralPoint || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Active Referrals</span>
              <span className="font-semibold">{dashboardData?.user?.referralNumber || 0}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mt-2">
              <div className="h-2 bg-pink-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 text-center">25 more referrals to reach Gold tier</p>
          </div>
        </div>

        {/* Earnings Card */}
        {/* <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Coins className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold">Teaching Earnings</h3>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">₹{dashboardData?.earnings?.total || '15,000'}</div>
              <div className="text-gray-500">Total Earnings</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Students Mentored</span>
                <span className="font-semibold">{dashboardData?.earnings?.studentsCount || 25}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Sessions</span>
                <span className="font-semibold">{dashboardData?.earnings?.activeSessions || 5}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Referral Bonus</span>
                <span className="font-semibold text-green-500">+₹{dashboardData?.earnings?.referralBonus || 2500}</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Achievements Card */}
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold">Achievements</h3>
          </div>
          <div className="space-y-3">
            {(dashboardData?.achievements || [
              {
                title: 'Super Mentor',
                description: 'Helped 20+ students',
                completed: true
              },
              {
                title: 'Top Contributor',
                description: '100+ forum answers',
                completed: true
              },
              {
                title: 'Community Star',
                description: '50+ referrals',
                completed: false
              }
            ]).map((achievement, index) => (
              <div key={index} className={`p-3 ${achievement.completed ? 'bg-purple-50' : 'bg-gray-50'} rounded-lg flex items-center gap-3`}>
                {achievement.completed ? (
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                )}
                <div>
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-gray-500">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How Referrals Work */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">How Referrals Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="bg-pink-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <span className="text-pink-500 font-bold">1</span>
            </div>
            <h4 className="font-medium mb-2">Share Your Code</h4>
            <p className="text-sm text-gray-500">Share your unique referral code with friends via social media or direct message</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-pink-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <span className="text-pink-500 font-bold">2</span>
            </div>
            <h4 className="font-medium mb-2">Friends Join</h4>
            <p className="text-sm text-gray-500">When they sign up using your code, they get a special welcome bonus</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-pink-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <span className="text-pink-500 font-bold">3</span>
            </div>
            <h4 className="font-medium mb-2">Earn Rewards</h4>
            <p className="text-sm text-gray-500">You earn points for each successful referral that can be redeemed for rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;