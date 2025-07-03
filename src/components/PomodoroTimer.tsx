import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReflectionModal } from './ReflectionModal';
import { PomodoroSettings, SessionData, TimerState, SessionType } from '@/types/pomodoro';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
  const pipWindowRef = useRef<Window | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [dontShowGuide, setDontShowGuide] = useState(false);

  // Debug effect for showReflection state
  useEffect(() => {
    console.log('showReflection state changed:', showReflection);
  }, [showReflection]);
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
    console.log('completeSession called with currentSession:', currentSession);
    // Only call onSessionComplete for non-focus sessions, or for focus sessions after reflection
    if (currentSession === 'focus') {
      console.log('Focus session completed, showing reflection modal');
      playNotificationSound();
      setShowReflection(true);
    } else {
      const sessionData: SessionData = {
        id: currentSessionId || Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        type: currentSession,
        duration: getCurrentSessionDuration(),
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
  }, [currentSession, currentSessionId, onSessionComplete, getCurrentSessionDuration, settings.soundEnabled, settings.notificationEnabled, toast]);

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
    console.log('Skip session clicked, showing reflection modal');
    // 토마토 완료 버튼을 클릭해도 회고 창이 나오도록 수정
    playNotificationSound();
    setShowReflection(true);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState === 'running') {
      interval = setInterval(() => {
        if (startTimestamp) {
          const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
          const newTimeLeft = Math.max(getCurrentSessionDuration() - elapsed, 0);
          setTimeLeft(newTimeLeft);
          if (newTimeLeft <= 0) {
            console.log('Timer reached zero, completing session');
            setTimeLeft(0);
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
    } else {
      // If timer was idle or completed, use full duration
      actualDuration = getCurrentSessionDuration();
    }
    
    const sessionData: SessionData = {
      id: currentSessionId,
      date: new Date().toISOString().split('T')[0],
      type: 'focus',
      duration: actualDuration,
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

  // PiP 타이머 렌더 함수 (메인 타이머와 최대한 동일하게)
  const renderPiPTimer = () => {
    const pipWindow = pipWindowRef.current;
    if (!pipWindow) return;
    const pipDoc = pipWindow.document;
    pipDoc.body.innerHTML = '';
    // 폰트 링크 추가 (Pretendard, Noto Sans KR)
    const fontPretendard = document.createElement('link');
    fontPretendard.rel = 'stylesheet';
    fontPretendard.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css';
    pipDoc.head.appendChild(fontPretendard);
    const fontNotoSans = document.createElement('link');
    fontNotoSans.rel = 'stylesheet';
    fontNotoSans.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap';
    pipDoc.head.appendChild(fontNotoSans);
    // 스타일 복사 (메인 타이머와 완전히 동일하게)
    const styles = document.createElement('style');
    styles.textContent = `
      body, .pip-card, .pip-title, .pip-timer, .pip-state {
        font-family: Pretendard, 'Noto Sans KR', Arial, sans-serif !important;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }
      body {
        margin: 0;
        padding: 0;
        background: #fff5f5;
        color: #991b1b;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .pip-card {
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 4px 24px 0 #f8717133;
        padding: 2rem 2.5rem;
        max-width: 400px;
        width: 100%;
        text-align: center;
      }
      .pip-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #b91c1c;
      }
      .pip-timer {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        color: #7f1d1d;
        letter-spacing: -0.04em;
      }
      .pip-progress {
        width: 100%;
        height: 12px;
        background: #fecaca;
        border-radius: 9999px;
        margin-bottom: 1.5rem;
        overflow: hidden;
      }
      .pip-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #fecaca 0%, #fca5a5 50%, #f87171 100%);
        transition: width 0.2s;
      }
      .pip-state {
        font-size: 1rem;
        color: #dc2626;
        font-weight: 600;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
      }
    `;
    pipDoc.head.appendChild(styles);
    // 타이머 UI (토마토 이모지는 무조건 1개)
    const pipContent = document.createElement('div');
    pipContent.className = 'pip-card';
    pipContent.innerHTML = `
      <div class="pip-title">
        <span>🍅</span>
        <span>${getSessionLabel().replace(/🍅+/g, '').trim()}</span>
      </div>
      <div class="pip-timer">${formatTime(timeLeft)}</div>
      <div class="pip-progress">
        <div class="pip-progress-bar" style="width: ${(timeLeft / getCurrentSessionDuration()) * 100}%"></div>
      </div>
      <div class="pip-state">
        <span>${timerState === 'running' ? '⏳' : timerState === 'paused' ? '⏸️' : timerState === 'completed' ? '✅' : '⏳'}</span>
        <span>${timerState === 'running' ? '진행 중' : timerState === 'paused' ? '일시정지' : timerState === 'completed' ? '완료' : '준비'}</span>
      </div>
    `;
    pipDoc.body.appendChild(pipContent);
  };

  // PiP 열기 함수
  const openPiP = async () => {
    if (!('documentPictureInPicture' in window)) {
      alert('이 브라우저는 Document Picture-in-Picture API를 지원하지 않습니다.');
      return;
    }
    try {
      if (typeof (window as any).documentPictureInPicture.getWindow === 'function') {
        const existingPiP = await (window as any).documentPictureInPicture.getWindow();
        if (existingPiP) {
          existingPiP.close();
        }
      }
      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 400,
        height: 350,
      });
      pipWindowRef.current = pipWindow;
      renderPiPTimer();
    } catch (error) {
      alert('PiP 창을 열 수 없습니다: ' + error);
    }
  };

  // PiP 창이 열려 있으면 타이머 상태가 바뀔 때마다 PiP도 동기화
  useEffect(() => {
    if (pipWindowRef.current) {
      renderPiPTimer();
    }
    // eslint-disable-next-line
  }, [timeLeft, timerState, currentSession]);

  useEffect(() => {
    if (!localStorage.getItem('hasSeenGuide')) {
      setShowGuideModal(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuideModal(false);
    if (dontShowGuide) {
      localStorage.setItem('hasSeenGuide', 'true');
    }
  };

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

            {/* PIP 버튼: 진행중일 때만 노출 */}
            {timerState === 'running' && (
              <Button
                onClick={openPiP}
                size="lg"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                PIP
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

      {/* 사용법 안내 모달 */}
      <Dialog open={showGuideModal} onOpenChange={setShowGuideModal}>
        <DialogContent className="max-w-2xl p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-6">서비스 사용법 안내</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⏱️</span>
              <div className="text-lg text-gray-800 leading-relaxed">
                <b>타이머 시작/일시정지/리셋</b><br/>
                시작, 일시정지, 리셋 버튼으로 타이머를 조작할 수 있습니다.
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">⏳</span>
              <div className="text-lg text-gray-800 leading-relaxed">
                <b>시간 수정</b><br/>
                타이머가 대기 중일 때(“시작” 전), 시간(분)을 클릭하면 원하는 시간으로 변경할 수 있습니다.
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🍅</span>
              <div className="text-lg text-gray-800 leading-relaxed">
                <b>세션 라벨</b><br/>
                현재 세션(예: “2번째 토마토”, “짧은 휴식”, “긴 휴식”)이 상단에 표시됩니다.
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🖼️</span>
              <div className="text-lg text-gray-800 leading-relaxed">
                <b>작은 창(PIP) 모드</b><br/>
                타이머가 진행 중일 때 “PIP” 버튼을 누르면 타이머를 작은 창(항상 위)에 띄울 수 있습니다.
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">✍️</span>
              <div className="text-lg text-gray-800 leading-relaxed">
                <b>회고 작성</b><br/>
                집중 세션이 끝나면 회고(Reflection) 창이 자동으로 열립니다. 회고를 작성하면 세션 기록이 저장됩니다.
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">💾</span>
              <div className="text-lg text-gray-800 leading-relaxed">
                <b>자동 저장/복원</b><br/>
                타이머 상태는 자동 저장되어 새로고침해도 이어서 사용할 수 있습니다.
              </div>
            </div>
          </div>
          <div className="text-base text-gray-600 mb-6">
            💡 <b>추가 안내</b>: 휴식 세션에서는 “휴식 패스” 버튼으로 바로 다음 세션으로 넘어갈 수 있습니다.<br/>
            세션이 끝나면 브라우저 알림과 소리로 알려줍니다(설정에 따라).
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="dontShowGuide"
              checked={dontShowGuide}
              onChange={e => setDontShowGuide(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="dontShowGuide" className="text-base text-gray-500">다시 보지 않기</label>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseGuide} variant="default" className="text-lg px-6 py-2">닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
