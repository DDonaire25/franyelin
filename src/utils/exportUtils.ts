import { createEvents } from 'ics';
import { EventFormData } from '../types';
import moment from 'moment';

export const exportToICS = (event: EventFormData) => {
  const startDate = moment(event.datetime);
  const endDate = moment(event.datetime).add(1, 'hour');

  const icsEvent = {
    start: [
      startDate.year(),
      startDate.month() + 1,
      startDate.date(),
      startDate.hour(),
      startDate.minute()
    ],
    end: [
      endDate.year(),
      endDate.month() + 1,
      endDate.date(),
      endDate.hour(),
      endDate.minute()
    ],
    title: event.title,
    description: event.description,
    location: event.location,
    url: event.mapLink,
    categories: [event.category],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: event.responsibleName, email: '' },
  };

  createEvents([icsEvent], (error, value) => {
    if (error) {
      console.error(error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

export const addToGoogleCalendar = (event: EventFormData) => {
  const startDate = moment(event.datetime).format('YYYYMMDDTHHmmss');
  const endDate = moment(event.datetime).add(1, 'hour').format('YYYYMMDDTHHmmss');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`,
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
};