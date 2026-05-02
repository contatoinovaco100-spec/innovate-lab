import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { CalendarEvent, Task } from '../types';
import { getDaysInMonth, getFirstDayOfMonth, MONTHS, WEEKDAYS, generateId, getTodayString, formatDate } from '../utils/helpers';
import Modal from './Modal';

interface AgendaProps {
  events: CalendarEvent[];
  setEvents: (evts: CalendarEvent[] | ((prev: CalendarEvent[]) => CalendarEvent[])) => void;
  tasks: Task[];
}

const EVENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Agenda: React.FC<AgendaProps> = ({ events, setEvents, tasks }) => {
  const today = getTodayString();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('1h');
  const [color, setColor] = useState(EVENT_COLORS[0]);

  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const dayEvents = events.filter(e => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const dayTasks = tasks.filter(t => t.date === selectedDate);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newEvt: CalendarEvent = {
      id: generateId(),
      title: title.trim(),
      date: selectedDate,
      time,
      duration,
      color,
    };
    setEvents((prev: CalendarEvent[]) => [...prev, newEvt]);
    setTitle(''); setTime('09:00'); setDuration('1h'); setColor(EVENT_COLORS[0]);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents((prev: CalendarEvent[]) => prev.filter(e => e.id !== id));
  };

  const hasEvents = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(e => e.date === dateStr);
  };

  return (
    <div className="animate-in flex-col gap-24">
      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Agenda</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
          <Plus size={14} /> Novo Evento
        </button>
      </div>

      <div className="grid-main">
        {/* Calendar */}
        <div className="card">
          <div className="calendar-header">
            <button className="btn btn-ghost btn-icon" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{MONTHS[currentMonth]} {currentYear}</span>
            <button className="btn btn-ghost btn-icon" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>
          <div className="calendar-grid">
            {WEEKDAYS.map(d => <div key={d} className="calendar-weekday">{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              return (
                <button
                  key={day}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  {day}
                  {hasEvents(day) && <div className="calendar-day-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Detail */}
        <div className="flex-col gap-16">
          <div className="card">
            <div className="card-title">
              {formatDate(selectedDate)}
              {selectedDate === today && <span className="badge badge-success">Hoje</span>}
            </div>

            {dayEvents.length === 0 && dayTasks.length === 0 ? (
              <div className="empty-state"><p>Nada agendado para esse dia</p></div>
            ) : (
              <>
                {dayEvents.map(ev => (
                  <div key={ev.id} className="event-item" style={{ justifyContent: 'space-between' }}>
                    <div className="flex-row gap-12">
                      <div className="event-color" style={{ background: ev.color }} />
                      <div>
                        <div className="event-title">{ev.title}</div>
                        <div className="event-time">
                          <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                          {ev.time} · {ev.duration}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(ev.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {dayTasks.length > 0 && (
                  <div style={{ marginTop: dayEvents.length > 0 ? 16 : 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase' }}>Tarefas do dia</div>
                    {dayTasks.map(task => (
                      <div key={task.id} className="task-item">
                        <div className={`priority-dot priority-${task.priority}`} />
                        <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Evento">
        <div className="modal-body">
          <div className="input-group">
            <label className="input-label">Título</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Reunião, Consulta..." />
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Horário</label>
              <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Duração</label>
              <select className="input" value={duration} onChange={e => setDuration(e.target.value)}>
                <option value="30min">30 min</option>
                <option value="1h">1 hora</option>
                <option value="2h">2 horas</option>
                <option value="3h">3 horas</option>
                <option value="dia todo">Dia todo</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Cor</label>
            <div className="flex-row gap-8">
              {EVENT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: c,
                    border: color === c ? '2px solid var(--text)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleAdd}>Salvar</button>
        </div>
      </Modal>
    </div>
  );
};

export default Agenda;
