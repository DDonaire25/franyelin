import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { EventDetails } from './components/EventDetails';
import { useEvents } from './hooks/useEvents';
import { EventFormData } from './types';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventFormData | undefined>();
  const { events, addEvent, updateEvent, deleteEvent, filters, setFilters } = useEvents();

  const handleEdit = (event: EventFormData) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSubmit = (eventData: Omit<EventFormData, 'id'>) => {
    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(undefined);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Agenda Cultural</h1>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Evento
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <EventList
                events={events}
                onEdit={handleEdit}
                onDelete={deleteEvent}
                filters={filters}
                onFilterChange={setFilters}
              />
            } />
            <Route path="/event/:id" element={
              <EventDetails events={events} onEdit={handleEdit} onDelete={deleteEvent} />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Modal Form */}
        {isFormOpen && (
          <EventForm
            onSubmit={handleSubmit}
            onClose={handleCloseForm}
            initialData={editingEvent}
          />
        )}
      </div>
    </Router>
  );
}

export default App;