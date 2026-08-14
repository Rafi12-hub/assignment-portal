import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Hash, BookOpen, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, isDemoMode, isFirebaseConfigured } = useAuth();
  const { showToast } = useOutletContext();

  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials, academic major, and authentication setup
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Overview Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-brand-500/20 mb-4">
            {currentUser?.displayName?.split(' ').map(n => n[0]).join('').slice(0,2) || 'ST'}
          </div>

          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            {currentUser?.displayName || 'Student User'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentUser?.email}
          </p>

          <div className="mt-4 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-full text-xs font-semibold border border-brand-200/60 dark:border-brand-800/60">
            {currentUser?.major || 'Computer Science'}
          </div>

          <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Student ID:</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser?.studentId || 'ST-88902'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Auth Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Right Details & Configuration Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Account Details Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Academic Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {currentUser?.displayName || 'Student'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {currentUser?.email}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Student ID Number</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  {currentUser?.studentId || 'ST-88902'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Major / Specialization</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {currentUser?.major || 'Computer Science'}
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Connection Status Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Firebase Backend Status
              </h4>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isFirebaseConfigured 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {isFirebaseConfigured ? 'Firebase Connected' : 'Demo Mode Active'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isFirebaseConfigured 
                ? 'Your student task system is actively synced with live Firebase Authentication and Cloud Firestore.' 
                : 'The application is running in local Demo Mode. Environment variables can be configured in .env.local to link live Firebase services.'
              }
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              VITE_FIREBASE_PROJECT_ID: <span className="text-brand-600 dark:text-brand-400 font-bold">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not Configured (Demo Mode)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
