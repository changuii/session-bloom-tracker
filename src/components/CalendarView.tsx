
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
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of month
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

    // Get selected date data
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

  const getIntensityClass = (focusTime: number) => {
    if (focusTime === 0) return 'bg-gray-100';
    if (focusTime < 30) return 'bg-green-200';
    if (focusTime < 60) return 'bg-green-300';
    if (focusTime < 120) return 'bg-green-400';
    return 'bg-green-500';
  };

  const monthName = currentDate.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
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
                  <div className={`w-full h-full rounded flex flex-col items-center justify-center text-xs transition-colors hover:opacity-80 ${getIntensityClass(day.focusTime)}`}>
                    <span className="font-medium">{day.day}</span>
                    {day.hasData && (
                      <span className="text-xs text-gray-600">
                        {Math.round(day.focusTime)}분
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500">
            <span>적음</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <div className="w-3 h-3 bg-green-300 rounded"></div>
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <div className="w-3 h-3 bg-green-500 rounded"></div>
            </div>
            <span>많음</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && new Date(selectedDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDateData.sessions.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(selectedDateData.totalFocusTime)}분
                  </div>
                  <div className="text-sm text-gray-500">총 집중 시간</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedDateData.sessions.length}개
                  </div>
                  <div className="text-sm text-gray-500">완료 세션</div>
                </div>
              </div>

              {selectedDateData.reflections.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">이날의 회고</h4>
                  <div className="space-y-2">
                    {selectedDateData.reflections.map((reflection, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                        {reflection}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              이날은 완료된 세션이 없습니다.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
