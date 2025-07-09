'use client';

import React, { useState } from 'react';
import { z } from 'zod';

type AddTerrainModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTerrainModal({
  isOpen,
  onClose,
}: AddTerrainModalProps): React.JSX.Element | null {
  const [formData, setFormData] = useState({
    adresse: '',
    description: '',
    openingHours: '',
    sport: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const schema = z.object({
    adresse: z.string().min(1, { message: 'Adresse requise' }),
    description: z.string().min(1, { message: 'Description requise' }),
    openingHours: z.string().min(1, { message: 'Horaires requis' }),
    sport: z.string().min(1, { message: 'Sport requis' }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = schema.safeParse(formData);
    if (!result.success) {
      const firstError =
        Object.values(result.error.formErrors.fieldErrors)[0]?.[0] ??
        'Erreur de validation';
      setError(firstError);

      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/sport-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? 'Erreur lors de l’ajout du terrain');
        setLoading(false);

        return;
      }

      // Si succès, fermer modal et reset formulaire
      setFormData({
        adresse: '',
        description: '',
        openingHours: '',
        sport: '',
      });

      onClose();
    } catch {
      setError('Erreur lors de l’ajout du terrain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-black">
          Ajouter un terrain
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
          <input
            type="text"
            name="openingHours"
            placeholder="Horaires d’ouverture"
            value={formData.openingHours}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
          <input
            type="text"
            name="sport"
            placeholder="Sport"
            value={formData.sport}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />

          {error != null && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition"
          >
            {loading ? 'Ajout...' : 'Ajouter le terrain'}
          </button>
        </form>
      </div>
    </div>
  );
}
