
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { StatsView } from '@/components/StatsView';
import { CalendarView } from '@/components/CalendarView';
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
    soundEnabled: true
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">회고 포모도로</h1>
          <p className="text-gray-600">집중하고, 회고하고, 성장하세요</p>
        </div>

        <Tabs defaultValue="timer" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              타이머
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              통계
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              달력
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
              설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <PomodoroTimer 
              settings={settings} 
              onSessionComplete={addSession}
            />
          </TabsContent>

          <TabsContent value="stats">
            <StatsView sessions={sessions} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView sessions={sessions} />
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
