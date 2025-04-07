export const generateShareMessage = (event: any) => {
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  };

  const eventDate = new Date(event.datetime);
  const formattedDate = eventDate.toLocaleDateString('es-ES', dateOptions);
  const formattedTime = eventDate.toLocaleTimeString('es-ES', timeOptions);

  let message = `📢 Agenda Cultural (considérese invitado)\n✨ ${event.title}`;

  if (event.description) {
    message += `\n📝 ${event.description}`;
  }

  message += `\n📅 Fecha: ${formattedDate} | 🕒 Hora: ${formattedTime}`;

  if (event.location) {
    message += `\n📍 ${event.location}`;
  }

  message += '\n#CulturaViva #Eventos';

  return message;
};