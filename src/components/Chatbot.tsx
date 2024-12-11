import React, { useState } from "react";
import { Send, Bot, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Importamos la librería de Google Generative AI

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de seguridad. ¿En qué puedo ayudarte?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY; // Usamos la clave de API desde las variables de entorno

  if (!API_KEY) {
    console.error("No se ha configurado la clave de API.");
    return null; // Esto evitará que la aplicación se ejecute si no hay clave de API
  }

  const genAI = new GoogleGenerativeAI(API_KEY); // Instanciamos el cliente de GoogleGenerativeAI
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Elegimos el modelo

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Llamada al modelo de Google Generative AI
      const result = await model.generateContent(input); // Generamos contenido con el prompt del usuario

      const botResponseContent = result.response.text(); // Accede al texto generado por el modelo

      // Eliminar los asteriscos "**" y limitar la longitud
      const cleanedResponse = botResponseContent
      ? botResponseContent
          .replace(/\*\*/g, "")    // Elimina los asteriscos dobles
          .replace(/\*/g, "")      // Elimina los asteriscos simples
          .replace(/_/g, "")       // Elimina guiones bajos
          .replace(/~/g, "")       // Elimina tilde (~)
      : "Lo siento, no tengo suficiente información para responder a eso.";
    

      const botResponse: Message = {
        id: messages.length + 2,
        text: cleanedResponse,
        isBot: true,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "Ocurrió un problema al procesar tu solicitud. Por favor, revisa la conexión o inténtalo más tarde.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold dark:text-white">Asistente de Seguridad</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isBot
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="input flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            />
            <button
              onClick={handleSend}
              className="btn btn-primary p-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={!input.trim() || loading}
            >
              {loading ? "..." : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
