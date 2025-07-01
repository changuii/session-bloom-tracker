import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { StatsView } from '@/components/StatsView';
import { CalendarView } from '@/components/CalendarView';
import { ReflectionView } from '@/components/ReflectionView';
import { SettingsView } from '@/components/SettingsView';
import { SessionData, PomodoroSettings } from '@/types/pomodoro';

const Index = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [settings, setSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    autoStart: false,
    soundEnabled: true,
    notificationEnabled: true,
    streakThreshold: 25
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoro-sessions');
    const savedSettings = localStorage.getItem('pomodoro-settings');
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  const addSession = (session: SessionData) => {
    setSessions(prev => [...prev, session]);
  };

  const updateSession = (sessionId: string, updates: Partial<SessionData>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  };

  // Mock data insertion for testing
  const insertMockData = () => {
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const mockSessions: SessionData[] = [
      // 오늘
      { id: 'm1', date: dateStr(today), type: 'focus', duration: 25 * 60, completed: true, createdAt: today.getTime() - 3600 * 1000, reflection: '오늘은 집중이 잘 됐다. 할 일을 모두 끝냈다.' },
      { id: 'm2', date: dateStr(today), type: 'focus', duration: 5 * 60, completed: true, createdAt: today.getTime() - 3000 * 1000, reflection: '짧은 세션이었지만 의미 있었다.' },
      // 어제
      { id: 'm3', date: dateStr(new Date(today.getTime() - 86400 * 1000)), type: 'focus', duration: 15 * 60, completed: true, createdAt: today.getTime() - 90000 * 1000, reflection: '어제는 약간 산만했지만 끝까지 해냈다.' },
      // 2일 전
      { id: 'm4', date: dateStr(new Date(today.getTime() - 2 * 86400 * 1000)), type: 'focus', duration: 10 * 60, completed: true, createdAt: today.getTime() - 180000 * 1000, reflection: '짧았지만 집중력이 좋았다.' },
      // 7일 전 (지난주)
      { id: 'm5', date: dateStr(new Date(today.getTime() - 7 * 86400 * 1000)), type: 'focus', duration: 30 * 60, completed: true, createdAt: today.getTime() - 630000 * 1000, reflection: '지난주에는 긴 세션도 잘 소화했다.' },
      // 8일 전 (지난주)
      { id: 'm6', date: dateStr(new Date(today.getTime() - 8 * 86400 * 1000)), type: 'focus', duration: 20 * 60, completed: true, createdAt: today.getTime() - 700000 * 1000, reflection: '8일 전에는 약간 힘들었지만 끝까지 했다.' },
      // 추가 Mock 데이터 (다양한 회고)
      { id: 'm7', date: dateStr(today), type: 'focus', duration: 12 * 60, completed: true, createdAt: today.getTime() - 2000 * 1000, reflection: '오늘은 집중이 잘 안 됐지만 끝까지 해냈다.' },
      { id: 'm8', date: dateStr(today), type: 'focus', duration: 8 * 60, completed: true, createdAt: today.getTime() - 1000 * 1000, reflection: '짧은 시간이라도 꾸준히 하니 뿌듯하다.' },
      { id: 'm9', date: dateStr(new Date(today.getTime() - 86400 * 1000)), type: 'focus', duration: 18 * 60, completed: true, createdAt: today.getTime() - 95000 * 1000, reflection: '어제는 집중이 잘 됐고, 목표를 달성했다.' },
      { id: 'm10', date: dateStr(new Date(today.getTime() - 2 * 86400 * 1000)), type: 'focus', duration: 7 * 60, completed: true, createdAt: today.getTime() - 185000 * 1000, reflection: '2일 전에는 피곤했지만 포기하지 않았다.' },
      { id: 'm11', date: dateStr(new Date(today.getTime() - 7 * 86400 * 1000)), type: 'focus', duration: 22 * 60, completed: true, createdAt: today.getTime() - 635000 * 1000, reflection: '지난주에는 새로운 방법을 시도해봤다.' },
      { id: 'm12', date: dateStr(new Date(today.getTime() - 8 * 86400 * 1000)), type: 'focus', duration: 16 * 60, completed: true, createdAt: today.getTime() - 705000 * 1000, reflection: '8일 전에는 집중이 흐트러졌지만 다시 잡았다.' },
    ];
    setSessions(prev => [...prev, ...mockSessions]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 bg-paper-texture">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] mb-2 font-handwriting">🍅 회고 토마토 타이머</h1>
          <p className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.18)]">집중하고, 회고하고, 성장하세요</p>
        </div>

        <div className="mb-4 flex justify-end">
          <button onClick={insertMockData} className="px-4 py-2 rounded bg-green-600 text-white font-bold shadow hover:bg-green-700 transition">Mock 데이터 삽입</button>
        </div>

        <Tabs defaultValue="timer" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/20 border border-white/30 backdrop-blur-2xl shadow-2xl">
            <TabsTrigger value="timer" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              🍅 타이머
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              📊 통계
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              📅 달력
            </TabsTrigger>
            <TabsTrigger value="reflection" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              📝 회고
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              ⚙️ 설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <PomodoroTimer 
              settings={settings} 
              onSessionComplete={addSession}
            />
          </TabsContent>

          <TabsContent value="stats">
            <StatsView sessions={sessions} settings={settings} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView sessions={sessions} />
          </TabsContent>

          <TabsContent value="reflection">
            <ReflectionView 
              sessions={sessions} 
              onUpdateSession={updateSession}
              geminiApiKey={settings.geminiApiKey}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsView 
              settings={settings} 
              onSettingsChange={setSettings} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
