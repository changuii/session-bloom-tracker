import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReflectionModal } from './ReflectionModal';
import { PomodoroSettings, SessionData, TimerState, SessionType } from '@/types/pomodoro';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSessionComplete: (session: SessionData) => void;
  tomatoCount: number;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

export const PomodoroTimer = ({ settings, onSessionComplete, tomatoCount, onSettingsChange }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentSession, setCurrentSession] = useState<SessionType>('focus');
  const [showReflection, setShowReflection] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editingTime, setEditingTime] = useState(settings.focusTime);
  const [customFocusTime, setCustomFocusTime] = useState<number | null>(null);
  const [shouldMoveToNextSession, setShouldMoveToNextSession] = useState(false);
  const { toast } = useToast();

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedTimerState = localStorage.getItem('pomodoro-timer-state');
    if (savedTimerState) {
      const state = JSON.parse(savedTimerState);
      setTimerState(state.timerState || 'idle');
      setCurrentSession(state.currentSession || 'focus');
      setCustomFocusTime(state.customFocusTime || null);
      
      // If timer was running, calculate remaining time
      if (state.timerState === 'running' && state.startTimestamp) {
        const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000);
        const totalDuration = getCurrentSessionDuration();
        const remaining = Math.max(totalDuration - elapsed, 0);
        setTimeLeft(remaining);
        
        if (remaining > 0) {
          setStartTimestamp(state.startTimestamp);
        } else {
          setTimerState('completed');
          setTimeLeft(0);
        }
      } else {
        // For paused or idle state, use the saved timeLeft
        setTimeLeft(state.timeLeft || getCurrentSessionDuration());
      }
    }
  }, [settings.focusTime]);

  // Save timer state to localStorage
  useEffect(() => {
    const savedState = {
      timeLeft,
      timerState,
      currentSession,
      customFocusTime,
      startTimestamp,
      lastSaved: Date.now()
    };
    localStorage.setItem('pomodoro-timer-state', JSON.stringify(savedState));
  }, [timeLeft, timerState, currentSession, customFocusTime, startTimestamp]);

  const getCurrentSessionDuration = () => {
    switch (currentSession) {
      case 'focus':
        return (customFocusTime || settings.focusTime) * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return (customFocusTime || settings.focusTime) * 60;
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'focus':
        return `🍅 ${tomatoCount + 1}번째 토마토`;
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
      showNotification('휴식 완료!', '휴식이 끝났습니다. 다음 토마토를 시작하세요!');
      toast({
        title: '휴식 완료!',
        description: '휴식이 끝났습니다. 다음 토마토를 시작하세요!'
      });
      setTimerState('completed');
      // 휴식 완료 후 다음 세션으로 이동하도록 플래그 설정
      setShouldMoveToNextSession(true);
    }
  }, [currentSession, currentSessionId, onSessionComplete, getCurrentSessionDuration, settings.soundEnabled, settings.notificationEnabled, toast, timeLeft]);

  const nextSession = () => {
    if (currentSession === 'focus') {
      const currentTomatoCount = tomatoCount;
      
      if (currentTomatoCount % settings.longBreakInterval === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setCurrentSession('focus');
      setTimeLeft((customFocusTime || settings.focusTime) * 60);
    }
    
    setTimerState(settings.autoStart ? 'running' : 'idle');
    setCurrentSessionId(Date.now().toString());
  };

  const startTimer = () => {
    setTimerState('running');
    if (currentSessionId === '') {
      setCurrentSessionId(Date.now().toString());
    }
    
    // If resuming from pause, calculate the correct start timestamp
    if (timerState === 'paused') {
      const totalDuration = getCurrentSessionDuration();
      const elapsed = totalDuration - timeLeft;
      const newStartTimestamp = Date.now() - (elapsed * 1000);
      setStartTimestamp(newStartTimestamp);
    } else {
      setStartTimestamp(Date.now());
    }
  };

  const pauseTimer = () => {
    setTimerState('paused');
    if (startTimestamp) {
      // Calculate remaining time based on total session duration and elapsed time
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const totalDuration = getCurrentSessionDuration();
      const remaining = Math.max(totalDuration - elapsed, 0);
      setTimeLeft(remaining);
      setStartTimestamp(null);
    }
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft((customFocusTime || settings.focusTime) * 60);
    setCurrentSessionId('');
    setStartTimestamp(null);
    // 커스텀 시간도 초기화
    setCustomFocusTime(null);
    // 토마토 카운트는 초기화하지 않음 (저장된 값 유지)
    // localStorage에서 타이머 상태 정리
    localStorage.removeItem('pomodoro-timer-state');
    
    // Reset custom time in settings if it was set
    if (customFocusTime && customFocusTime !== settings.focusTime) {
      onSettingsChange({
        ...settings,
        focusTime: settings.focusTime
      });
    }
  };

  const applyEditingTime = () => {
    if (editingTime > 0 && editingTime <= 120) {
      setCustomFocusTime(editingTime);
      setTimeLeft(editingTime * 60);
      
      // Update settings to sync with timer
      onSettingsChange({
        ...settings,
        focusTime: editingTime
      });
      
      setIsEditingTime(false);
      toast({
        title: '시간 설정 완료',
        description: `${editingTime}분으로 설정되었습니다.`
      });
    } else {
      toast({
        title: '잘못된 시간',
        description: '1분에서 120분 사이로 설정해주세요.',
        variant: 'destructive'
      });
    }
  };

  const startEditingTime = () => {
    if (timerState === 'idle' && currentSession === 'focus') {
      setIsEditingTime(true);
      setEditingTime(customFocusTime || Math.floor(timeLeft / 60));
    }
  };

  const skipSession = () => {
    // Calculate actual elapsed time
    let actualDuration = 0;
    
    if (startTimestamp) {
      // If timer was running, calculate elapsed time
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const totalDuration = getCurrentSessionDuration();
      actualDuration = Math.min(elapsed, totalDuration);
    } else if (timerState === 'paused') {
      // If timer was paused, use the difference between total duration and remaining time
      const totalDuration = getCurrentSessionDuration();
      actualDuration = totalDuration - timeLeft;
    }
    
    // Create session data with actual elapsed time
    const sessionData: SessionData = {
      id: currentSessionId || Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'focus',
      duration: actualDuration,
      completed: true,
      createdAt: Date.now()
    };
    
    onSessionComplete(sessionData);
    
    const currentTomatoNumber = tomatoCount + 1;
    showNotification('🍅 토마토 완료!', `집중 토마토 ${currentTomatoNumber}을 완료했습니다. 잘하셨어요!`);
    toast({
      title: '🍅 토마토 완료!',
      description: `집중 토마토 ${currentTomatoNumber}을 완료했습니다!`
    });
    
    setTimerState('completed');
    // 다음 세션으로 이동 (토마토 카운트는 자동으로 동기화됨)
    nextSession();
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

  // Update time when settings change (only if timer is idle)
  useEffect(() => {
    if (timerState === 'idle') {
      setTimeLeft(getCurrentSessionDuration());
      setEditingTime(customFocusTime || settings.focusTime);
    }
  }, [settings.focusTime, settings.shortBreak, settings.longBreak, customFocusTime, timerState]);

  // Handle moving to next session after break completion
  useEffect(() => {
    if (shouldMoveToNextSession) {
      nextSession();
      setShouldMoveToNextSession(false);
    }
  }, [shouldMoveToNextSession]);

  const progress = ((getCurrentSessionDuration() - timeLeft) / getCurrentSessionDuration()) * 100;

  const handleReflectionSubmit = (reflection: string) => {
    const currentTomatoNumber = tomatoCount + 1;
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
    showNotification('🍅 토마토 완료!', `집중 토마토 ${currentTomatoNumber}을 완료했습니다. 잘하셨어요!`);
    toast({
      title: '🍅 토마토 완료!',
      description: `집중 토마토 ${currentTomatoNumber}을 완료했습니다!`
    });
    setShowReflection(false);
    setTimerState('completed');
    // 다음 세션으로 이동 (토마토 카운트는 자동으로 동기화됨)
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
            <div 
              className={`text-6xl font-mono font-bold mb-4 drop-shadow-sm transition-colors ${
                currentSession === 'focus' && timerState === 'idle'
                  ? 'text-red-900 cursor-pointer hover:text-red-700'
                  : 'text-red-900 cursor-default'
              }`}
              onClick={startEditingTime}
              title={currentSession === 'focus' && timerState === 'idle' ? "클릭하여 시간 수정" : ""}
            >
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

            {currentSession === 'focus' ? (
              <Button 
                onClick={resetTimer}
                size="lg"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                리셋
              </Button>
            ) : (
              <Button 
                onClick={() => nextSession()}
                size="lg"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <Square className="w-4 h-4 mr-2" />
                휴식 패스
              </Button>
            )}

            {timerState === 'completed' && (
              <Button 
                onClick={() => nextSession()}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 shadow-lg"
              >
                다음 토마토
              </Button>
            )}
          </div>

          {/* 시간 수정 안내 - 집중 시간이고 타이머가 idle 상태일 때만 표시 */}
          {timerState === 'idle' && currentSession === 'focus' && !isEditingTime && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                ⏰ 시간을 클릭하여 수정할 수 있습니다
              </p>
            </div>
          )}

          {/* 시간 설정 카드 */}
          {isEditingTime && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="w-80 p-6 bg-white shadow-xl border-2 border-red-200">
                <CardContent className="p-0">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-red-800 font-handwriting">
                      ⏰ 시간 설정
                    </h3>
                    
                    <div className="flex items-center justify-center gap-3">
                      <Input
                        type="number"
                        value={editingTime}
                        onChange={(e) => setEditingTime(Number(e.target.value))}
                        min="1"
                        max="120"
                        className="w-24 text-center text-3xl font-mono font-bold text-red-900 border-2 border-red-300 focus:border-red-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            applyEditingTime();
                          } else if (e.key === 'Escape') {
                            setIsEditingTime(false);
                          }
                        }}
                      />
                      <span className="text-2xl font-mono font-bold text-red-900">분</span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      1분에서 120분 사이로 설정할 수 있습니다
                    </p>
                    
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={applyEditingTime}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        ✓ 적용
                      </Button>
                      <Button
                        onClick={() => setIsEditingTime(false)}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        ✕ 취소
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {timerState === 'running' && currentSession === 'focus' && (
            <Button 
              onClick={skipSession}
              variant="ghost"
              size="sm"
              className="mt-4 text-red-500 hover:bg-red-50"
            >
              <Square className="w-3 h-3 mr-1" />
              토마토 완료
            </Button>
          )}
        </CardContent>
      </Card>

      <ReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        onSubmit={handleReflectionSubmit}
        sessionNumber={tomatoCount + 1}
      />
    </div>
  );
};
