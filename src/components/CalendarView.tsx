import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventFormData } from '../types';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: EventFormData[];
  onEventClick: (event: EventFormData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick }) => {
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.datetime),
    end: moment(event.datetime).add(1, 'hour').toDate(),
    resource: event,
  }));

  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={['month', 'week', 'day']}
        onSelectEvent={(event: any) => onEventClick(event.resource)}
        className="rounded-lg overflow-hidden"
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          noEventsInRange: "No hay eventos en este período",
        }}
      />
    </div>
  );
};