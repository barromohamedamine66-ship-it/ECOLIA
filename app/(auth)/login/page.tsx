'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '../../../lib/auth/auth-service';
import { isSupabaseConfigured } from '../../../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (!isConfigured) {
        // En mode démo sans clés Supabase
        setErrorMessage(
          'Supabase n\'est pas encore relié aux variables d\'environnement réelles. Vous pouvez tester le tableau de bord ou configurer .env.local.'
        );
        setLoading(false);
        return;
      }

      const res = await signIn(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Connexion réussie ! Redirection en cours...');
        setTimeout(() => {
          router.push('/students');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-emerald-900/60 mx-auto mb-3">
          É
        </div>
        <h1 className="text-3xl font-black tracking-tight">ÉCOLIA</h1>
        <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest">
          L'école, simplement.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Connexion à votre Établissement</h2>
          <p className="text-xs text-slate-400 mt-1">
            Entrez vos identifiants pour accéder à votre espace sécurisé
          </p>
        </div>

        {/* Configuration Notice */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-base mt-0.5"></i>
            <div>
              <span className="font-bold block">Mode Local / Démo</span>
              Pour connecter votre base de données Supabase, configurez vos variables <code className="bg-slate-900 px-1 py-0.5 rounded text-white">NEXT_PUBLIC_SUPABASE_URL</code> et <code className="bg-slate-900 px-1 py-0.5 rounded text-white">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans le fichier <code className="bg-slate-900 px-1 py-0.5 rounded text-white">.env.local</code>.
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation text-base"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-base"></i>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="direction@horizon-abidjan.ci"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mot de Passe
              </label>
              <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Authentification en cours...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                Se Connecter
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400 mb-3">Comptes de test pré-configurés :</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('direction@horizon.ci');
                setPassword('admin1234');
              }}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Directeur
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('prof.koffi@horizon.ci');
                setPassword('prof1234');
              }}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Enseignant
            </button>
          </div>

          <div className="mt-4">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
