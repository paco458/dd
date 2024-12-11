import React from 'react';
import { X } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon
} from 'react-share';
import { Incidente } from '../types';

interface CompartirAlertaProps {
  alerta: Incidente;
  onClose: () => void;
}

const CompartirAlerta: React.FC<CompartirAlertaProps> = ({ alerta, onClose }) => {
  const shareUrl = window.location.href;
  const title = `Alerta de ${alerta.tipo}: ${alerta.descripcion}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Compartir Alerta</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={48} round />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={48} round />
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={48} round />
            </WhatsappShareButton>

            <TelegramShareButton url={shareUrl} title={title}>
              <TelegramIcon size={48} round />
            </TelegramShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompartirAlerta;