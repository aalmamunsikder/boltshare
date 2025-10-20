import { useNavigate } from 'react-router-dom';
import { Share2, Lock, Zap, Shield, Users, FileCheck, ArrowRight, Sparkles, Globe, Clock } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="relative z-10 border-b border-white/20 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">BoltShare</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-all duration-200 hover:bg-white/50 rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Peer-to-Peer File Sharing</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Share Files
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            BoltShare enables <span className="font-semibold text-blue-600">peer-to-peer</span> file sharing directly between users. 
            Your files never touch our servers. <span className="font-semibold">Lightning fast</span>, completely secure, and absolutely private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/signup')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center"
          >
            Start Sharing Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 text-lg rounded-xl font-semibold hover:bg-white transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
            >
              Sign In
          </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Globe className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-700">No Servers</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="font-semibold text-gray-700">Lightning Fast</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-gray-700">100% Private</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 my-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start sharing files securely and instantly
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Create or Join Room</h3>
              <p className="text-gray-600 leading-relaxed">
                Create a secure room or join an existing one with a room code. Optionally add password
                protection for extra security.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Connect Peer-to-Peer</h3>
              <p className="text-gray-600 leading-relaxed">
              Once connected, files transfer directly between users using WebRTC technology. No cloud
                storage involved, maximum privacy.
            </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FileCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Send & Receive Files</h3>
              <p className="text-gray-600 leading-relaxed">
              Drag and drop files to share instantly. Chat in real-time while files transfer at
              maximum speed.
            </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Why Choose BoltShare?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of file sharing with cutting-edge technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Direct peer-to-peer connections mean maximum transfer speeds without server bottlenecks.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">
              Your files never touch our servers. What you share stays between you and your peers.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure Rooms</h3>
            <p className="text-gray-600 leading-relaxed">
              Password-protected rooms ensure only invited users can access your shared files.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">No Size Limits</h3>
            <p className="text-gray-600 leading-relaxed">
              Since files transfer directly, there are no arbitrary file size restrictions.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-time Chat</h3>
            <p className="text-gray-600 leading-relaxed">
              Communicate with connected users while sharing files in the same room.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-indigo-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Simple & Clean</h3>
            <p className="text-gray-600 leading-relaxed">
              Beautiful, intuitive interface designed for effortless file sharing experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Sharing?</h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users sharing files securely and privately. Experience the future of file sharing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 bg-white text-blue-600 text-lg rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white text-lg rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/20 mt-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">BoltShare</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 mb-2">
                Built with React, Supabase & WebRTC
              </p>
              <p className="text-sm text-gray-500">
                © 2024 BoltShare. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
