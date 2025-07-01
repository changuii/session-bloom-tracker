
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReflectionModal } from './ReflectionModal';
import { PomodoroSettings, SessionData, TimerState, SessionType } from '@/types/pomodoro';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSessionComplete: (session: SessionData) => void;
}

export const PomodoroTimer = ({ settings, onSessionComplete }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentSession, setCurrentSession] = useState<SessionType>('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

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
        return `집중 세션 ${sessionCount + 1}`;
      case 'shortBreak':
        return '짧은 휴식';
      case 'longBreak':
        return '긴 휴식';
      default:
        return '집중 세션';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      // Simple beep sound using Web Audio API
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
    const sessionData: SessionData = {
      id: currentSessionId || Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: currentSession,
      duration: getCurrentSessionDuration() / 60,
      completed: true,
      createdAt: Date.now()
    };

    onSessionComplete(sessionData);
    playNotificationSound();

    if (currentSession === 'focus') {
      setShowReflection(true);
    }

    setTimerState('completed');
  }, [currentSession, currentSessionId, onSessionComplete, getCurrentSessionDuration, settings.soundEnabled]);

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
  };

  const pauseTimer = () => {
    setTimerState('paused');
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(getCurrentSessionDuration());
    setCurrentSessionId('');
  };

  const skipSession = () => {
    completeSession();
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft, completeSession]);

  const progress = ((getCurrentSessionDuration() - timeLeft) / getCurrentSessionDuration()) * 100;

  const handleReflectionSubmit = (reflection: string) => {
    // Update the last session with reflection
    const sessionData: SessionData = {
      id: currentSessionId,
      date: new Date().toISOString().split('T')[0],
      type: 'focus',
      duration: settings.focusTime,
      completed: true,
      reflection,
      createdAt: Date.now()
    };

    onSessionComplete(sessionData);
    setShowReflection(false);
    nextSession();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {getSessionLabel()}
            </h2>
            <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <p className="text-sm text-gray-600">
              {timerState === 'running' ? '진행 중' : 
               timerState === 'paused' ? '일시정지' :
               timerState === 'completed' ? '완료' : '준비'}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {timerState === 'idle' || timerState === 'paused' ? (
              <Button 
                onClick={startTimer}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {timerState === 'paused' ? '재개' : '시작'}
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer}
                size="lg"
                variant="outline"
              >
                <Pause className="w-4 h-4 mr-2" />
                일시정지
              </Button>
            )}

            <Button 
              onClick={resetTimer}
              size="lg"
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              리셋
            </Button>

            {timerState === 'completed' && (
              <Button 
                onClick={nextSession}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
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
              className="mt-4 text-gray-500"
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
