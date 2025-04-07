import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Camera, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const defaultProfile: UserProfile = {
  name: '',
  bio: '',
  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  theme: 'light',
};

export const ProfileEditor: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success('Perfil actualizado exitosamente');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    setProfile(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-4 max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {profile.theme === 'light' ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Photo Section */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={profile.photo || defaultProfile.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white cursor-pointer hover:bg-purple-700">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Info */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía
                </label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{profile.name || 'Sin nombre'}</h3>
              <p className="text-gray-600">{profile.bio || 'Sin biografía'}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Guardar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};