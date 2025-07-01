import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PomodoroSettings, SessionData, TimeSlotStats } from '@/types/pomodoro';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface StatsViewProps {
  sessions: SessionData[];
  settings: PomodoroSettings;
}

export const StatsView = ({ sessions, settings }: StatsViewProps) => {
  const stats = useMemo(() => {
    const focusSessions = sessions.filter(s => s.type === 'focus' && s.completed);
    const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0); // in seconds
    const totalSessions = focusSessions.length;

    // Calculate streak
    const today = new Date();
    const dates = [...new Set(focusSessions.map(s => s.date))].sort().reverse();
    
    let currentStreak = 0;
    let currentDate = new Date(today);
    
    for (const date of dates) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayFocusTime = focusSessions
        .filter(s => s.date === dateStr)
        .reduce((total, session) => total + session.duration, 0);
      
      if (date === dateStr && dayFocusTime >= settings.streakThreshold) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (date !== dateStr) {
        break;
      } else {
        currentDate.setDate(currentDate.getDate() - 1);
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
        focusTime: Math.round(dayFocusTime / 60), // minutes
        date,
        tomatoes: focusSessions.filter(s => s.date === date).length
      };
    });

    // Monthly chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const monthlyData = last30Days.map(date => {
      const dayFocusTime = focusSessions
        .filter(s => s.date === date)
        .reduce((total, session) => total + session.duration, 0);
      return {
        date: new Date(date).getDate(),
        focusTime: Math.round(dayFocusTime / 60) // minutes
      };
    });

    // Time slot analysis
    const timeSlots: TimeSlotStats = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    
    focusSessions.forEach(session => {
      const hour = new Date(session.createdAt).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning += session.duration;
      else if (hour >= 12 && hour < 18) timeSlots.afternoon += session.duration;
      else if (hour >= 18 && hour < 24) timeSlots.evening += session.duration;
      else timeSlots.night += session.duration;
    });

    const timeSlotData = [
      { name: '오전 (6-12시)', value: Math.round(timeSlots.morning / 60), color: '#fbbf24' },
      { name: '오후 (12-18시)', value: Math.round(timeSlots.afternoon / 60), color: '#f97316' },
      { name: '저녁 (18-24시)', value: Math.round(timeSlots.evening / 60), color: '#ef4444' },
      { name: '심야 (0-6시)', value: Math.round(timeSlots.night / 60), color: '#7c3aed' }
    ].filter(slot => slot.value > 0);

    // Weekly comparison
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekTime = focusSessions
      .filter(s => new Date(s.date) >= thisWeekStart)
      .reduce((total, session) => total + session.duration, 0) / 60; // minutes
    
    const lastWeekTime = focusSessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= lastWeekStart && sessionDate < thisWeekStart;
      })
      .reduce((total, session) => total + session.duration, 0) / 60; // minutes

    let weeklyChange = 0;
    if (lastWeekTime > 0) {
      weeklyChange = ((thisWeekTime - lastWeekTime) / lastWeekTime) * 100;
    } else if (thisWeekTime > 0) {
      weeklyChange = thisWeekTime * 100;
    } else {
      weeklyChange = 0;
    }

    return {
      totalFocusTime,
      totalSessions,
      currentStreak,
      weeklyData,
      monthlyData,
      timeSlotData,
      averageSessionLength: totalSessions > 0 ? Math.round((totalFocusTime / 60) / totalSessions) : 0,
      thisWeekTime: Math.round(thisWeekTime),
      lastWeekTime: Math.round(lastWeekTime),
      weeklyChange: Math.round(weeklyChange)
    };
  }, [sessions, settings.streakThreshold]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">총 집중 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {Math.floor(stats.totalFocusTime / 3600)}시간 {Math.floor((stats.totalFocusTime % 3600) / 60)}분 {stats.totalFocusTime % 60}초
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">완료한 토마토</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 flex items-center">
              🍅 {stats.totalSessions}개
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">현재 스트릭</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 flex items-center">
              🔥 {stats.currentStreak}일
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">평균 토마토</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageSessionLength}분
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800 font-handwriting">📊 주간 집중 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fed7d7" />
                  <XAxis dataKey="day" stroke="#c53030" />
                  <YAxis stroke="#c53030" />
                  <Tooltip 
                    formatter={(value) => [`${value}분`, '집중 시간']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const date = payload[0].payload.date;
                        return new Date(date).toLocaleDateString('ko-KR');
                      }
                      return label;
                    }}
                    contentStyle={{ backgroundColor: '#fed7d7', border: '1px solid #fc8181' }}
                  />
                  <Bar dataKey="focusTime" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-800 font-handwriting">🕐 시간대별 집중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.timeSlotData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.timeSlotData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}분`, '집중 시간']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">📈 월간 집중 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7d7" />
                <XAxis dataKey="date" stroke="#c53030" />
                <YAxis stroke="#c53030" />
                <Tooltip 
                  formatter={(value) => [`${value}분`, '집중 시간']}
                  contentStyle={{ backgroundColor: '#fed7d7', border: '1px solid #fc8181' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focusTime" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">📊 주간 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{stats.thisWeekTime}분</div>
              <div className="text-sm text-red-600">이번 주</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{stats.lastWeekTime}분</div>
              <div className="text-sm text-orange-600">지난 주</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className={`text-2xl font-bold ${stats.weeklyChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {stats.weeklyChange >= 0 ? '+' : ''}{stats.weeklyChange}%
              </div>
              <div className="text-sm text-purple-600">변화율</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.totalSessions === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-400 mb-4">
              🍅
            </div>
            <div className="text-red-500">
              <p className="text-lg mb-2">아직 완료된 토마토가 없습니다</p>
              <p className="text-sm">첫 번째 토마토 세션을 시작해보세요!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
