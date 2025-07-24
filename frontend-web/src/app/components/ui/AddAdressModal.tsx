import { useTranslations } from 'next-intl';
import React, { JSX, useEffect, useState } from 'react';

import { AddAdressIcon } from '@/app/components/ui/icons';

type Sport = {
  id: string;
  name: string;
};

export default function SportModal(): JSX.Element {
  const t = useTranslations('place');
  const [isOpen, setIsOpen] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    sport: '',
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function fetchSports() {
      try {
        const res = await fetch('/api/sports');
        if (!res.ok) {
          return;
        }
        const data: Sport[] = await res.json();
        setSports(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSports();
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      address: form.address,
      sportIds: form.sport !== '' ? [form.sport] : [],
    };

    try {
      const response = await fetch('/api/sport-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const { message } = await response.json();
        alert(`Erreur : ${message}`);

        return;
      }

      await response.json();
      alert(t('successfullyAdded'));
      setIsOpen(false);
      setForm({ name: '', description: '', address: '', sport: '' });
    } catch (error) {
      console.error(error);
      alert(t('addError'));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-1.5 bg-yellow-400 text-black rounded hover:bg-yellow-500 font-semibold"
      >
        <AddAdressIcon />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {t('addPlace')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nom"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 text-black rounded px-3 py-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded text-black px-3 py-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Adresse"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded text-black px-3 py-2"
              />
              <select
                name="sport"
                value={form.sport}
                onChange={handleChange}
                className="w-full border border-gray-300 text-black rounded px-3 py-2"
                required
              >
                <option value="">{t('chooseSport')}</option>
                {sports.map(sport => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
