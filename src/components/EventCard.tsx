import React, { useState, useRef } from 'react';
import { EventFormData } from '../types';
import { Calendar, MapPin, Users, Edit, Trash2, Share2, Download, Copy, Bell, Star, FileDown, CalendarPlus } from 'lucide-react';
import { toPng } from 'html-to-image';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import toast from 'react-hot-toast';
import { generateShareMessage } from '../utils/shareFormatters';
import { exportToICS, addToGoogleCalendar } from '../utils/exportUtils';
import { useFloating, offset, shift, flip, arrow } from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventCardProps {
  event: EventFormData;
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onToggleReminder,
  onToggleFavorite,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(30);
  const [showTooltip, setShowTooltip] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
  });

  const handleCopyText = async () => {
    try {
      const message = generateShareMessage(event);
      await navigator.clipboard.writeText(message);
      toast.success('Texto copiado al portapapeles');
    } catch (err) {
      console.error('Error copying text:', err);
      toast.error('Error al copiar el texto');
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById(`event-card-${event.id}`);
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${event.title}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Imagen descargada exitosamente');
    } catch (err) {
      console.error('Error downloading image:', err);
      toast.error('Error al descargar la imagen');
    }
  };

  const handleSetReminder = () => {
    if (reminderMinutes > 0) {
      onToggleReminder(event.id, reminderMinutes);
      setIsReminderModalOpen(false);
      toast.success('Recordatorio configurado exitosamente');
    } else {
      toast.error('Por favor seleccione un tiempo válido para el recordatorio');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Agenda Cultural',
      text: generateShareMessage(event),
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Evento compartido exitosamente');
      } catch (err) {
        console.error('Error sharing:', err);
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  return (
    <>
      <div 
        id={`event-card-${event.id}`} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        ref={refs.setReference}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {event.image && (
          <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                {event.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onToggleFavorite(event.id)}
                className={`p-2 rounded-full transition-colors ${
                  event.isFavorite 
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
                aria-label={event.isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              >
                <Star
                  size={20}
                  fill={event.isFavorite ? 'currentColor' : 'none'}
                  className="transition-transform hover:scale-110"
                />
              </button>
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  event.reminder?.enabled 
                    ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
                aria-label="Configurar recordatorio"
              >
                <Bell
                  size={20}
                  fill={event.reminder?.enabled ? 'currentColor' : 'none'}
                  className="transition-transform hover:scale-110"
                />
              </button>
              <button
                onClick={() => onEdit(event)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                aria-label="Editar evento"
              >
                <Edit size={20} className="transition-transform hover:scale-110" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                aria-label="Compartir evento"
              >
                <Share2 size={20} className="transition-transform hover:scale-110" />
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                aria-label="Exportar evento"
              >
                <FileDown size={20} className="transition-transform hover:scale-110" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Eliminar evento"
              >
                <Trash2 size={20} className="transition-transform hover:scale-110" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(event.datetime).toLocaleString('es-ES')}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="h-5 w-5 mr-2" />
              <span>{event.targetAudience}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              {event.cost.isFree ? 'Gratis' : `$${event.cost.amount}`}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              ref={refs.setFloating}
              style={floatingStyles}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-sm"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Detalles Adicionales</h4>
              {event.responsibleName && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  👤 Responsable: {event.responsibleName}
                </p>
              )}
              {event.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📞 Contacto: {event.phone}
                </p>
              )}
              {event.socialMedia && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📱 Social: @{event.socialMedia}
                </p>
              )}
              {event.mapLink && (
                <a
                  href={event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  🗺️ Ver en Google Maps
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compartir Evento</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {generateShareMessage(event)}
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-4">
                  <WhatsappShareButton url={window.location.href} title={generateShareMessage(event)}>
                    <div className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                      <Share2 size={24} />
                    </div>
                  </WhatsappShareButton>
                  
                  <FacebookShareButton url={window.location.href} quote={generateShareMessage(event)}>
                    <div className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <Share2 size={24} />
                    </div>
                  </FacebookShareButton>
                  
                  <TwitterShareButton url={window.location.href} title={generateShareMessage(event)}>
                    <div className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                      <Share2 size={24} />
                    </div>
                  </TwitterShareButton>
                </div>

                <button
                  onClick={handleCopyText}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Copy size={20} />
                  <span>Copiar Texto</span>
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download size={20} />
                  <span>Descargar Imagen</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exportar Evento</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    exportToICS(event);
                    setIsExportModalOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileDown size={20} />
                  <span>Descargar archivo .ics</span>
                </button>

                <button
                  onClick={() => {
                    addToGoogleCalendar(event);
                    setIsExportModalOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <CalendarPlus size={20} />
                  <span>Añadir a Google Calendar</span>
                </button>

                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurar Recordatorio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minutos antes del evento
                  </label>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={120}>2 horas</option>
                    <option value={1440}>1 día</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsReminderModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSetReminder}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};