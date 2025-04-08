const generateRecurringEvents = (baseEvent: EventFormData): EventFormData[] => {
  const events: EventFormData[] = [];
  const baseDate = new Date(baseEvent.datetime);
  const now = new Date();
  const MAX_EVENTS = 100;
  
  // ID raíz para todos los eventos recurrentes
  const rootId = baseEvent.id || crypto.randomUUID();

  switch (baseEvent.recurrence.type) {
    case 'diaria': {
      for (let i = 0; i < 30 && events.length < MAX_EVENTS; i++) {
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + i);
        if (newDate > now) {
          events.push({
            ...baseEvent,
            id: `${rootId}-${i}`, // ID único basado en raíz + índice
            datetime: newDate.toISOString(),
          });
        }
      }
      break;
    }

    case 'anual': {
      for (let i = 0; i < 5 && events.length < MAX_EVENTS; i++) {
        const newDate = new Date(baseDate);
        newDate.setFullYear(newDate.getFullYear() + i);
        if (newDate > now) {
          events.push({
            ...baseEvent,
            id: `${rootId}-${i}`,
            datetime: newDate.toISOString(),
          });
        }
      }
      break;
    }

    case 'personalizada': {
      const endDate = baseEvent.recurrence.endDate 
        ? new Date(baseEvent.recurrence.endDate)
        : new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));

      const maxOccurrences = baseEvent.recurrence.occurrences || MAX_EVENTS;
      const daysOfWeek = baseEvent.recurrence.daysOfWeek || [];
      
      let currentDate = new Date(baseDate);
      let occurrenceCount = 0;

      while (occurrenceCount < maxOccurrences && currentDate <= endDate && events.length < MAX_EVENTS) {
        const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        if (daysOfWeek.includes(capitalizedDayName) && currentDate > now) {
          events.push({
            ...baseEvent,
            id: `${rootId}-${occurrenceCount}`,
            datetime: currentDate.toISOString(),
          });
          occurrenceCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
    }

    default: {
      if (baseDate > now) {
        events.push({
          ...baseEvent,
          id: rootId,
        });
      }
    }
  }

  return events;
};

const addEvent = (event: Omit<EventFormData, 'id'>) => {
  const baseEvent = { 
    ...event, 
    id: crypto.randomUUID() // ID único para el evento base
  };

  const recurringEvents = generateRecurringEvents(baseEvent);

  // Verificación de duplicados por ID y datetime
  const newEvents = recurringEvents.filter(
    newEvent => !events.some(existing => 
      existing.id === newEvent.id || 
      (existing.datetime === newEvent.datetime && existing.title === newEvent.title)
    )
  );

  if (newEvents.length === 0) {
    toast.error('Los eventos ya existen en el calendario');
    return;
  }

  saveEvents([...events, ...newEvents]);
  toast.success(`${newEvents.length} evento(s) creado(s) exitosamente`);
};

// Modificar la carga inicial para eliminar duplicados
useEffect(() => {
  const loadStoredData = () => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (!storedEvents) return;

    try {
      const parsedEvents = JSON.parse(storedEvents) as EventFormData[];
      
      // Eliminar duplicados por ID
      const uniqueEvents = parsedEvents.filter((event, index, self) =>
        index === self.findIndex(e => e.id === event.id)
      );

      setEvents(uniqueEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error al cargar eventos');
    }
  };

  loadStoredData();
}, []);
