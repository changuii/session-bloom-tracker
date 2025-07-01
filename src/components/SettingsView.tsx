import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PomodoroSettings } from '@/types/pomodoro';
import { useToast } from '@/hooks/use-toast';

interface SettingsViewProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

export const SettingsView = ({ settings, onSettingsChange }: SettingsViewProps) => {
  const { toast } = useToast();

  const updateSetting = (key: keyof PomodoroSettings, value: number | boolean | string) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const resetToDefault = () => {
    onSettingsChange({
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStart: false,
      soundEnabled: true,
      notificationEnabled: true,
      streakThreshold: 25
    });
    toast({
      title: '설정 초기화',
      description: '모든 설정이 기본값으로 복원되었습니다.'
    });
  };

  const testNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🍅 알림 테스트', {
          body: '알림이 정상적으로 작동합니다!',
          icon: '/favicon.ico'
        });
        toast({
          title: '알림 테스트',
          description: '브라우저 알림이 전송되었습니다.'
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('🍅 알림 허용 완료', {
              body: '이제 토마토 완료 시 알림을 받을 수 있습니다!',
              icon: '/favicon.ico'
            });
          }
        });
      } else {
        toast({
          title: '알림 차단됨',
          description: '브라우저 설정에서 알림을 허용해주세요.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">🍅 타이머 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="focusTime" className="text-red-700">집중 시간 (분)</Label>
              <Input
                id="focusTime"
                type="number"
                value={settings.focusTime}
                onChange={(e) => updateSetting('focusTime', parseInt(e.target.value))}
                min="1"
                max="60"
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div>
              <Label htmlFor="shortBreak" className="text-red-700">짧은 휴식 (분)</Label>
              <Input
                id="shortBreak"
                type="number"
                value={settings.shortBreak}
                onChange={(e) => updateSetting('shortBreak', parseInt(e.target.value))}
                min="1"
                max="30"
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div>
              <Label htmlFor="longBreak" className="text-red-700">긴 휴식 (분)</Label>
              <Input
                id="longBreak"
                type="number"
                value={settings.longBreak}
                onChange={(e) => updateSetting('longBreak', parseInt(e.target.value))}
                min="1"
                max="60"
                className="border-red-200 focus:border-red-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="longBreakInterval" className="text-red-700">긴 휴식 주기 (토마토 수)</Label>
            <Input
              id="longBreakInterval"
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => updateSetting('longBreakInterval', parseInt(e.target.value))}
              min="2"
              max="10"
              className="max-w-xs border-red-200 focus:border-red-400"
            />
            <p className="text-sm text-red-500 mt-1">
              {settings.longBreakInterval}번의 집중 토마토마다 긴 휴식
            </p>
          </div>

          <div>
            <Label htmlFor="streakThreshold" className="text-red-700">스트릭 기준 (일일 최소 집중 시간)</Label>
            <Input
              id="streakThreshold"
              type="number"
              value={settings.streakThreshold}
              onChange={(e) => updateSetting('streakThreshold', parseInt(e.target.value))}
              min="1"
              max="480"
              className="max-w-xs border-red-200 focus:border-red-400"
            />
            <p className="text-sm text-red-500 mt-1">
              하루에 {settings.streakThreshold}분 이상 집중 시 스트릭으로 인정
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">🔔 알림 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="soundEnabled" className="text-red-700">알림 소리</Label>
              <p className="text-sm text-red-500">토마토 완료 시 소리 알림</p>
            </div>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notificationEnabled" className="text-red-700">브라우저 알림</Label>
              <p className="text-sm text-red-500">토마토 완료 시 브라우저 알림</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="notificationEnabled"
                checked={settings.notificationEnabled}
                onCheckedChange={(checked) => updateSetting('notificationEnabled', checked)}
              />
              <Button
                onClick={testNotification}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                테스트
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoStart" className="text-red-700">자동 시작</Label>
              <p className="text-sm text-red-500">휴식 후 자동으로 다음 토마토 시작</p>
            </div>
            <Switch
              id="autoStart"
              checked={settings.autoStart}
              onCheckedChange={(checked) => updateSetting('autoStart', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">🤖 AI 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="geminiApiKey" className="text-red-700">Gemini API 키</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="geminiApiKey"
                type="password"
                placeholder="회고 AI 피드백을 위한 Gemini API 키"
                value={settings.geminiApiKey || ''}
                onChange={(e) => updateSetting('geminiApiKey', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
              <Button 
                variant="outline" 
                onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                API 키 발급
              </Button>
            </div>
            <p className="text-sm text-red-500 mt-1">
              회고 페이지에서 AI 피드백을 받기 위해 필요합니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">💾 데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={resetToDefault} 
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              기본값으로 복원
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm('⚠️ 모든 토마토 기록과 회고를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
                  localStorage.removeItem('pomodoro-sessions');
                  localStorage.removeItem('pomodoro-settings');
                  toast({
                    title: '데이터 삭제 완료',
                    description: '모든 데이터가 삭제되었습니다. 페이지를 새로고침합니다.',
                  });
                  setTimeout(() => window.location.reload(), 2000);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              모든 데이터 삭제
            </Button>
          </div>
          <p className="text-sm text-red-500">
            📱 데이터는 브라우저에 로컬로 저장됩니다. 브라우저 데이터를 삭제하면 모든 기록이 사라집니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
