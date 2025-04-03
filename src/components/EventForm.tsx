import React, { useState, useEffect } from 'react';
import { EventFormData } from '../types';
import { X } from 'lucide-react';

interface EventFormProps {
  onSubmit: (event: Omit<EventFormData, 'id'>) => void;
  onClose: () => void;
  initialData?: EventFormData;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<Omit<EventFormData, 'id'>>({
    title: '',
    eventType: 'Taller',
    description: '',
    category: 'Artes Escenicas y Musicales',
    datetime: '',
    location: '',
    mapLink: '',
    responsibleName: '',
    phone: '',
    socialMedia: '',
    targetAudience: 'Todos',
    cost: {
      isFree: true,
      amount: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Evento' : 'Nuevo Evento'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Evento
                </label>
                <select
                  value={formData.eventType}
                  onChange={e => setFormData(prev => ({ ...prev, eventType: e.target.value as EventFormData['eventType'] }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {['Taller', 'Festival', 'Exposicion', 'Toma Cultural', 'Encuentros', 'Proyeccion de cine', 'Otros'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={500}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as EventFormData['category'] }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {[
                    'Artes Escenicas y Musicales',
                    'Artes Visuales y del espacio',
                    'Cine y medios audiovisual',
                    'Promocion del Libro y la Lectura',
                    'Patrimonio cultural'
                  ].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sección 2: Fecha y Lugar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Fecha y Lugar</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={e => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lugar
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enlace a Google Maps
                </label>
                <input
                  type="url"
                  value={formData.mapLink}
                  onChange={e => setFormData(prev => ({ ...prev, mapLink: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Sección 3: Responsable/Institución */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Responsable/Institución</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Responsable
                </label>
                <input
                  type="text"
                  value={formData.responsibleName}
                  onChange={e => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram/Red Social
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={formData.socialMedia}
                    onChange={e => setFormData(prev => ({ ...prev, socialMedia: e.target.value }))}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Detalles Adicionales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Detalles Adicionales</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imagen del Evento
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Público Objetivo
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={e => setFormData(prev => ({ ...prev, targetAudience: e.target.value as EventFormData['targetAudience'] }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {['Infantil', 'Adultos', 'Todos'].map(audience => (
                    <option key={audience} value={audience}>{audience}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Costo
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.cost.isFree}
                      onChange={() => setFormData(prev => ({ ...prev, cost: { isFree: true } }))}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Gratis
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.cost.isFree}
                      onChange={() => setFormData(prev => ({ ...prev, cost: { isFree: false, amount: prev.cost.amount || 0 } }))}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Pago
                    </label>
                    {!formData.cost.isFree && (
                      <input
                        type="number"
                        min="0"
                        value={formData.cost.amount}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          cost: { isFree: false, amount: Number(e.target.value) }
                        }))}
                        className="ml-4 block w-24 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {initialData ? 'Actualizar' : 'Crear'} Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};