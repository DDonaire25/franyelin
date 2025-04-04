import React, { useState } from 'react';
import { EventFormData } from '../types';
import { Calendar, MapPin, Users, Edit, Trash2, Share2, Download, Copy, QrCode } from 'lucide-react';
import { toPng } from 'html-to-image';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

interface EventCardProps {
  event: EventFormData;
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const eventUrl = `${window.location.origin}/event/${event.id}`;
  
  const generateShareMessage = () => {
    return `📢 ${event.title}\n` +
           `📅 ${new Date(event.datetime).toLocaleDateString()} | 🕒 ${new Date(event.datetime).toLocaleTimeString()}\n` +
           `📍 ${event.location}\n` +
           `🔗 ${eventUrl}\n` +
           `#CulturaViva #Eventos`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: generateShareMessage(),
          url: eventUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareMessage());
      toast.success('Texto copiado al portapapeles');
    } catch (err) {
      console.error('Error copying text:', err);
      toast.error('Error al copiar el texto');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Error copying link:', err);
      toast.error('Error al copiar el enlace');
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

  return (
    <>
      <div id={`event-card-${event.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
        {event.image && (
          <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full">
                {event.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900">{event.title}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{event.description}</p>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(event.datetime).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>{event.targetAudience}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-purple-600 font-semibold">
              {event.cost.isFree ? 'Gratis' : `$${event.cost.amount}`}
            </span>
          </div>
        </div>
      </div>

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Compartir Evento</h3>
              
              <div className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <QRCode value={eventUrl} size={150} />
                </div>

                {/* Share Buttons */}
                <div className="flex justify-center space-x-4 mb-4">
                  <WhatsappShareButton url={eventUrl} title={generateShareMessage()}>
                    <div className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
                      <Share2 size={24} />
                    </div>
                  </WhatsappShareButton>
                  
                  <FacebookShareButton url={eventUrl} quote={generateShareMessage()}>
                    <div className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <Share2 size={24} />
                    </div>
                  </FacebookShareButton>
                  
                  <TwitterShareButton url={eventUrl} title={generateShareMessage()}>
                    <div className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
                      <Share2 size={24} />
                    </div>
                  </TwitterShareButton>
                </div>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Copy size={20} />
                  <span>Copiar Enlace</span>
                </button>

                {/* Copy Text Button */}
                <button
                  onClick={handleCopyText}
                  className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Copy size={20} />
                  <span>Copiar Texto</span>
                </button>

                {/* Download Image Button */}
                <button
                  onClick={handleDownloadImage}
                  className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Download size={20} />
                  <span>Descargar Imagen</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};