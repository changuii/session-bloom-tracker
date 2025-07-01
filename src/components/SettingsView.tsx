
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PomodoroSettings } from '@/types/pomodoro';

interface SettingsViewProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

export const SettingsView = ({ settings, onSettingsChange }: SettingsViewProps) => {
  const updateSetting = (key: keyof PomodoroSettings, value: number | boolean) => {
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
      soundEnabled: true
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>타이머 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="focusTime">집중 시간 (분)</Label>
              <Input
                id="focusTime"
                type="number"
                value={settings.focusTime}
                onChange={(e) => updateSetting('focusTime', parseInt(e.target.value))}
                min="1"
                max="60"
              />
            </div>
            <div>
              <Label htmlFor="shortBreak">짧은 휴식 (분)</Label>
              <Input
                id="shortBreak"
                type="number"
                value={settings.shortBreak}
                onChange={(e) => updateSetting('shortBreak', parseInt(e.target.value))}
                min="1"
                max="30"
              />
            </div>
            <div>
              <Label htmlFor="longBreak">긴 휴식 (분)</Label>
              <Input
                id="longBreak"
                type="number"
                value={settings.longBreak}
                onChange={(e) => updateSetting('longBreak', parseInt(e.target.value))}
                min="1"
                max="60"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="longBreakInterval">긴 휴식 주기 (세션 수)</Label>
            <Input
              id="longBreakInterval"
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => updateSetting('longBreakInterval', parseInt(e.target.value))}
              min="2"
              max="10"
              className="max-w-xs"
            />
            <p className="text-sm text-gray-500 mt-1">
              {settings.longBreakInterval}번의 집중 세션마다 긴 휴식
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>기타 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoStart">자동 시작</Label>
              <p className="text-sm text-gray-500">휴식 후 자동으로 다음 세션 시작</p>
            </div>
            <Switch
              id="autoStart"
              checked={settings.autoStart}
              onCheckedChange={(checked) => updateSetting('autoStart', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="soundEnabled">알림 소리</Label>
              <p className="text-sm text-gray-500">세션 완료 시 소리 알림</p>
            </div>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button onClick={resetToDefault} variant="outline">
              기본값으로 복원
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                  localStorage.removeItem('pomodoro-sessions');
                  localStorage.removeItem('pomodoro-settings');
                  window.location.reload();
                }
              }}
            >
              모든 데이터 삭제
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            데이터는 브라우저에 로컬로 저장됩니다. 브라우저 데이터를 삭제하면 모든 기록이 사라집니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
