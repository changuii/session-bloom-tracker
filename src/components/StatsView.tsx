
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionData } from '@/types/pomodoro';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  sessions: SessionData[];
}

export const StatsView = ({ sessions }: StatsViewProps) => {
  const stats = useMemo(() => {
    const focusSessions = sessions.filter(s => s.type === 'focus' && s.completed);
    const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0);
    const totalSessions = focusSessions.length;

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    const dates = [...new Set(focusSessions.map(s => s.date))].sort().reverse();
    
    let currentStreak = 0;
    let currentDate = new Date();
    
    for (const date of dates) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (date === dateStr) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Weekly chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const weeklyData = last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' });
      const dayFocusTime = focusSessions
        .filter(s => s.date === date)
        .reduce((total, session) => total + session.duration, 0);
      
      return {
        day: dayName,
        focusTime: Math.round(dayFocusTime),
        date
      };
    });

    return {
      totalFocusTime,
      totalSessions,
      currentStreak,
      weeklyData,
      averageSessionLength: totalSessions > 0 ? Math.round(totalFocusTime / totalSessions) : 0
    };
  }, [sessions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 집중 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(stats.totalFocusTime / 60)}시간 {stats.totalFocusTime % 60}분
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">완료한 세션</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalSessions}개
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">현재 스트릭</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.currentStreak}일
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">평균 세션</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageSessionLength}분
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주간 집중 시간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}분`, '집중 시간']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      const date = payload[0].payload.date;
                      return new Date(date).toLocaleDateString('ko-KR');
                    }
                    return label;
                  }}
                />
                <Bar dataKey="focusTime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {stats.totalSessions === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">
              <p className="text-lg mb-2">아직 완료된 세션이 없습니다</p>
              <p className="text-sm">첫 번째 포모도로 세션을 시작해보세요! 🍅</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
