import { useState } from 'react';
import { User, Upload, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginPageProps {
  onLogin: (nickname: string, profilePic?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [nickname, setNickname] = useState('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const defaultAvatars = [
    '😊', '😎', '🥳', '🦊', '🐱', '🐼', '🦄', '🌸',
    '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺',
  ];

  const handleLogin = () => {
    if (nickname.trim()) {
      onLogin(nickname.trim(), profilePic || undefined);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (emoji: string) => {
    setProfilePic(emoji);
    setShowAvatarOptions(false);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo/Icon */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-400/30">
            <span className="text-4xl">💕</span>
          </div>
          <h1 className="text-2xl font-bold text-rose-100">EchoRoom</h1>
          <p className="text-sm text-rose-200/60">Join the conversation</p>
        </div>

        {/* Profile Picture Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-rose-200/80">Profile Picture</label>
          <div className="flex items-center gap-4">
            {/* Current Profile Preview */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-300/20 to-pink-400/20 flex items-center justify-center text-3xl border-2 border-rose-300/30 overflow-hidden">
                {profilePic ? (
                  profilePic.startsWith('data:') ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{profilePic}</span>
                  )
                ) : (
                  <User className="w-8 h-8 text-rose-300" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-white hover:text-rose-300" />
                </label>
                <button
                  onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                  className="hover:text-rose-300"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Avatar Options */}
            {showAvatarOptions && (
              <div className="flex-1 bg-black/50 backdrop-blur-sm rounded-2xl p-3 border border-rose-300/20">
                <p className="text-xs text-rose-200/60 mb-2">Choose an emoji avatar</p>
                <div className="grid grid-cols-8 gap-1">
                  {defaultAvatars.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => handleAvatarSelect(avatar)}
                      className="w-8 h-8 flex items-center justify-center text-xl hover:bg-rose-300/20 rounded-full transition-colors"
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-rose-200/50">Click to upload image or choose emoji avatar</p>
        </div>

        {/* Nickname Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-rose-200/80">Nickname</label>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter your nickname"
            className="bg-rose-300/10 border-rose-300/20 text-rose-100 placeholder:text-rose-200/40 focus:border-rose-400"
          />
        </div>

        {/* Join Button */}
        <Button
          onClick={handleLogin}
          disabled={!nickname.trim()}
          className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-black font-semibold py-6 rounded-2xl shadow-lg shadow-rose-400/20 disabled:opacity-50"
        >
          Join Room
        </Button>

        {/* Info */}
        <p className="text-center text-xs text-rose-200/40">
          Messages are end-to-end encrypted 🔒
        </p>
      </div>
    </div>
  );
}