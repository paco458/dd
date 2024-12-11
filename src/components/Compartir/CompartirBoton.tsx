import React from 'react';
import { Facebook, Twitter, MessageCircle } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share';

interface CompartirBotonProps {
  url: string;
  titulo: string;
  plataforma: 'facebook' | 'twitter' | 'whatsapp';
}

const CompartirBoton: React.FC<CompartirBotonProps> = ({ url, titulo, plataforma }) => {
  const getButtonConfig = () => {
    switch (plataforma) {
      case 'facebook':
        return {
          Icon: Facebook,
          className: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900'
        };
      case 'twitter':
        return {
          Icon: Twitter,
          className: 'text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
        };
      case 'whatsapp':
        return {
          Icon: MessageCircle,
          className: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900'
        };
    }
  };

  const config = getButtonConfig();
  const ShareButton = {
    facebook: FacebookShareButton,
    twitter: TwitterShareButton,
    whatsapp: WhatsappShareButton
  }[plataforma];

  return (
    <ShareButton url={url} title={titulo}>
      <div className={`p-2 rounded-full ${config.className}`}>
        <config.Icon className="w-5 h-5" />
      </div>
    </ShareButton>
  );
};

export default CompartirBoton;