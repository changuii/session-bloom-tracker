
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SessionData } from '@/types/pomodoro';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  sessions: SessionData[];
}

export const CalendarView = ({ sessions }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { calendarData, selectedDateData } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      const dayFocusSessions = sessions.filter(s => 
        s.date === dateStr && s.type === 'focus' && s.completed
      );
      const focusTime = dayFocusSessions.reduce((total, session) => total + session.duration, 0);
      
      calendarDays.push({
        day,
        dateStr,
        focusTime,
        sessionCount: dayFocusSessions.length,
        hasData: dayFocusSessions.length > 0
      });
    }

    const selectedSessions = selectedDate ? 
      sessions.filter(s => s.date === selectedDate && s.type === 'focus' && s.completed) : [];
    
    const selectedDateData = {
      sessions: selectedSessions,
      totalFocusTime: selectedSessions.reduce((total, s) => total + s.duration, 0),
      reflections: selectedSessions.filter(s => s.reflection).map(s => s.reflection!)
    };

    return { calendarData: calendarDays, selectedDateData };
  }, [currentDate, sessions, selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderTomatoes = (sessionCount: number) => {
    return Array.from({ length: Math.min(sessionCount, 6) }, (_, i) => (
      <span key={i} className="text-red-500 text-xs">🍅</span>
    ));
  };

  const monthName = currentDate.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-800 font-handwriting">📅 {monthName}</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-red-600 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`aspect-square p-1 ${day ? 'cursor-pointer' : ''}`}
                onClick={() => day && setSelectedDate(day.dateStr)}
              >
                {day && (
                  <div className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-xs transition-all hover:scale-105 border-2 ${
                    day.hasData 
                      ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                      : 'bg-white border-red-100 hover:bg-red-50'
                  }`}>
                    <span className="font-medium text-red-800 mb-1">{day.day}</span>
                    {day.hasData && (
                      <div className="flex flex-wrap justify-center gap-0.5">
                        {renderTomatoes(day.sessionCount)}
                        {day.sessionCount > 6 && (
                          <span className="text-xs text-red-400">+{day.sessionCount - 6}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6 text-xs text-red-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-red-100 rounded"></div>
              <span>토마토 없음</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded flex items-center justify-center">
                <span className="text-red-500" style={{ fontSize: '8px' }}>🍅</span>
              </div>
              <span>토마토 완료</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-handwriting">
              📅 {selectedDate && new Date(selectedDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDateData.sessions.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">
                    {Math.round(selectedDateData.totalFocusTime)}분
                  </div>
                  <div className="text-sm text-red-600">총 집중 시간</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700 flex items-center justify-center">
                    🍅 {selectedDateData.sessions.length}
                  </div>
                  <div className="text-sm text-orange-600">완료 토마토</div>
                </div>
              </div>

              {selectedDateData.reflections.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-red-800">📝 이날의 회고</h4>
                  <div className="space-y-2">
                    {selectedDateData.reflections.map((reflection, index) => (
                      <div key={index} className="bg-red-50 p-3 rounded-lg text-sm text-red-700 border border-red-200">
                        🍅 <strong>토마토 {index + 1}:</strong> {reflection}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-400 py-8">
              <div className="text-4xl mb-2">🍅</div>
              <p>이날은 완료된 토마토가 없습니다.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
