import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReflectionModal } from './ReflectionModal';
import { PomodoroSettings, SessionData, TimerState, SessionType } from '@/types/pomodoro';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSessionComplete: (session: SessionData) => void;
}

export const PomodoroTimer = ({ settings, onSessionComplete }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentSession, setCurrentSession] = useState<SessionType>('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const { toast } = useToast();

  const getCurrentSessionDuration = () => {
    switch (currentSession) {
      case 'focus':
        return settings.focusTime * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return settings.focusTime * 60;
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'focus':
        return `🍅 집중 토마토 ${sessionCount + 1}`;
      case 'shortBreak':
        return '☕ 짧은 휴식';
      case 'longBreak':
        return '🌿 긴 휴식';
      default:
        return '🍅 집중 토마토';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showNotification = (title: string, body: string) => {
    if (settings.notificationEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const completeSession = useCallback(() => {
    // Only call onSessionComplete for non-focus sessions, or for focus sessions after reflection
    if (currentSession === 'focus') {
      playNotificationSound();
      setShowReflection(true);
    } else {
      const sessionData: SessionData = {
        id: currentSessionId || Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        type: currentSession,
        duration: getCurrentSessionDuration() - timeLeft,
        completed: true,
        createdAt: Date.now()
      };
      onSessionComplete(sessionData);
      showNotification('휴식 완료!', '휴식이 끝났습니다. 다음 세션을 시작하세요!');
      toast({
        title: '휴식 완료!',
        description: '휴식이 끝났습니다. 다음 세션을 시작하세요!'
      });
      setTimerState('completed');
    }
  }, [currentSession, currentSessionId, onSessionComplete, getCurrentSessionDuration, settings.soundEnabled, settings.notificationEnabled, toast, timeLeft]);

  const nextSession = () => {
    if (currentSession === 'focus') {
      const nextSessionCount = sessionCount + 1;
      setSessionCount(nextSessionCount);
      
      if (nextSessionCount % settings.longBreakInterval === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setCurrentSession('focus');
      setTimeLeft(settings.focusTime * 60);
    }
    
    setTimerState(settings.autoStart ? 'running' : 'idle');
    setCurrentSessionId(Date.now().toString());
  };

  const startTimer = () => {
    setTimerState('running');
    if (currentSessionId === '') {
      setCurrentSessionId(Date.now().toString());
    }
    setStartTimestamp(Date.now());
  };

  const pauseTimer = () => {
    setTimerState('paused');
    if (startTimestamp) {
      // Adjust timeLeft based on real elapsed time
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      setTimeLeft((prev) => Math.max(prev - elapsed, 0));
      setStartTimestamp(null);
    }
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(getCurrentSessionDuration());
    setCurrentSessionId('');
    setStartTimestamp(null);
  };

  const skipSession = () => {
    completeSession();
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        if (startTimestamp) {
          const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
          const newTimeLeft = Math.max(getCurrentSessionDuration() - elapsed, 0);
          setTimeLeft(newTimeLeft);
          if (newTimeLeft <= 0) {
            completeSession();
            clearInterval(interval);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState, startTimestamp, getCurrentSessionDuration, completeSession]);

  // When timer is started or session changes, reset timeLeft and startTimestamp
  useEffect(() => {
    if (timerState === 'idle' || timerState === 'completed') {
      setTimeLeft(getCurrentSessionDuration());
      setStartTimestamp(null);
    }
  }, [currentSession, timerState, getCurrentSessionDuration]);

  const progress = ((getCurrentSessionDuration() - timeLeft) / getCurrentSessionDuration()) * 100;

  const handleReflectionSubmit = (reflection: string) => {
    const sessionData: SessionData = {
      id: currentSessionId,
      date: new Date().toISOString().split('T')[0],
      type: 'focus',
      duration: getCurrentSessionDuration() - timeLeft,
      completed: true,
      reflection,
      createdAt: Date.now()
    };
    onSessionComplete(sessionData);
    showNotification('🍅 토마토 완료!', `집중 세션 ${sessionCount + 1}을 완료했습니다. 잘하셨어요!`);
    toast({
      title: '🍅 토마토 완료!',
      description: `집중 세션 ${sessionCount + 1}을 완료했습니다!`
    });
    setShowReflection(false);
    setTimerState('completed');
    nextSession();
  };

  // Update browser tab title with remaining time
  useEffect(() => {
    if (timerState === 'running') {
      document.title = `${formatTime(timeLeft)} - tomato!`;
    } else if (timerState === 'paused') {
      document.title = `⏸️ ${formatTime(timeLeft)} - tomato!`;
    } else if (timerState === 'completed') {
      document.title = `✅ tomato!`;
    } else {
      document.title = 'tomato!';
    }
  }, [timerState, timeLeft]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-red-800 mb-2 font-handwriting">
              {getSessionLabel()}
            </h2>
            <div className="text-6xl font-mono font-bold text-red-900 mb-4 drop-shadow-sm">
              {formatTime(timeLeft)}
            </div>
            <Progress 
              value={progress} 
              className="h-3 mb-4" 
              style={{
                background: 'linear-gradient(90deg, #fecaca 0%, #fca5a5 50%, #f87171 100%)'
              }}
            />
            <p className="text-sm text-red-600 font-medium">
              {timerState === 'running' ? '🔥 진행 중' : 
               timerState === 'paused' ? '⏸️ 일시정지' :
               timerState === 'completed' ? '✅ 완료' : '⏳ 준비'}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {timerState === 'idle' || timerState === 'paused' ? (
              <Button 
                onClick={startTimer}
                size="lg"
                className="bg-red-600 hover:bg-red-700 shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {timerState === 'paused' ? '재개' : '시작'}
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer}
                size="lg"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Pause className="w-4 h-4 mr-2" />
                일시정지
              </Button>
            )}

            <Button 
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              리셋
            </Button>

            {timerState === 'completed' && (
              <Button 
                onClick={nextSession}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 shadow-lg"
              >
                다음 세션
              </Button>
            )}
          </div>

          {timerState === 'running' && (
            <Button 
              onClick={skipSession}
              variant="ghost"
              size="sm"
              className="mt-4 text-red-500 hover:bg-red-50"
            >
              <Square className="w-3 h-3 mr-1" />
              세션 완료
            </Button>
          )}
        </CardContent>
      </Card>

      <ReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        onSubmit={handleReflectionSubmit}
        sessionNumber={sessionCount}
      />
    </div>
  );
};
