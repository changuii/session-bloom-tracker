
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 bg-paper-texture">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-800 mb-2 font-handwriting">🍅 회고 토마토 타이머</h1>
          <p className="text-red-600">집중하고, 회고하고, 성장하세요</p>
        </div>

        <Tabs defaultValue="timer" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm shadow-sm">
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
