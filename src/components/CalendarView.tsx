import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventFormData } from '../types';
import { useFloating, offset, shift, flip, arrow, Placement } from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: EventFormData[];
  onEventClick: (event: EventFormData) => void;
}

interface TooltipProps {
  event: EventFormData;
  placement: Placement;
  isOpen: boolean;
}

const EventTooltip: React.FC<TooltipProps> = ({ event, placement, isOpen }) => {
  const { refs, floatingStyles, context } = useFloating({
    placement,
    middleware: [offset(10), flip(), shift()],
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={refs.setFloating}
          style={floatingStyles}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm z-50"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>📍 {event.location}</p>
            <p>👥 {event.targetAudience}</p>
            <p>💰 {event.cost.isFree ? 'Gratis' : `$${event.cost.amount}`}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick }) => {
  const [hoveredEvent, setHoveredEvent] = React.useState<EventFormData | null>(null);
  const [tooltipPlacement, setTooltipPlacement] = React.useState<Placement>('top');

  const handleEventDrop = ({ event, start, end }: any) => {
    const updatedEvent = {
      ...event.resource,
      datetime: start.toISOString(),
    };
    onEventClick(updatedEvent);
  };

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
        onEventDrop={handleEventDrop}
        draggableAccessor={() => true}
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
        components={{
          eventWrapper: (props: any) => (
            <div
              onMouseEnter={() => {
                setHoveredEvent(props.event.resource);
                const rect = props.children.props.children.getBoundingClientRect();
                setTooltipPlacement(rect.top < window.innerHeight / 2 ? 'bottom' : 'top');
              }}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              {props.children}
              {hoveredEvent?.id === props.event.resource.id && (
                <EventTooltip
                  event={hoveredEvent}
                  placement={tooltipPlacement}
                  isOpen={true}
                />
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};