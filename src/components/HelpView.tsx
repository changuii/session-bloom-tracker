import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface HelpViewProps {
  onTabChange: (tab: string) => void;
}

export const HelpView = ({ onTabChange }: HelpViewProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleQuickStart = (tab: string) => {
    onTabChange(tab);
    setIsSheetOpen(false);
    toast({
      title: "페이지 이동 완료",
      description: `${tab === 'timer' ? '타이머' : tab === 'settings' ? '설정' : '통계'} 페이지로 이동했습니다.`,
    });
  };

  // 데스크톱 버전 (md 이상)
  const DesktopHelp = () => (
    <div className="hidden md:block max-w-4xl mx-auto">
      <div className="grid gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-red-800 flex items-center gap-2">
              🍅 토마토 타이머 사용법
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  🎯 1단계: 타이머 시작
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  집중할 작업을 정하고 25분 포모도로 타이머를 시작하세요.
                </p>
                <Button 
                  onClick={() => handleQuickStart('timer')} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  타이머로 바로가기 →
                </Button>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  ⚙️ 2단계: 설정 조정
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  집중 시간, 휴식 시간, 알림 등을 개인 취향에 맞게 설정하세요.
                </p>
                <Button 
                  onClick={() => handleQuickStart('settings')} 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                >
                  설정으로 바로가기 →
                </Button>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  📝 3단계: 회고 작성
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  완료한 세션에 대해 간단한 회고를 작성하고 AI 피드백을 받아보세요.
                </p>
                <Button 
                  onClick={() => handleQuickStart('reflection')} 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
                >
                  회고로 바로가기 →
                </Button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  📊 4단계: 통계 확인
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  나의 집중 패턴과 성과를 다양한 차트로 분석해보세요.
                </p>
                <Button 
                  onClick={() => handleQuickStart('stats')} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  통계로 바로가기 →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                💡 주요 기능
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">🍅</span>
                <div>
                  <p className="font-medium text-red-800">포모도로 타이머</p>
                  <p className="text-sm text-red-600">25분 집중 + 5분 휴식의 완벽한 리듬</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📝</span>
                <div>
                  <p className="font-medium text-red-800">AI 회고 피드백</p>
                  <p className="text-sm text-red-600">Gemini AI가 제공하는 개인화된 피드백</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-medium text-red-800">상세한 통계</p>
                  <p className="text-sm text-red-600">시간대별, 주간별 집중 패턴 분석</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🔔</span>
                <div>
                  <p className="font-medium text-red-800">브라우저 알림</p>
                  <p className="text-sm text-red-600">세션 완료 시 자동 알림</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                🔧 설정 가이드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">⏰</span>
                <div>
                  <p className="font-medium text-red-800">시간 설정</p>
                  <p className="text-sm text-red-600">집중/휴식 시간을 개인 취향에 맞게 조정</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🔔</span>
                <div>
                  <p className="font-medium text-red-800">알림 설정</p>
                  <p className="text-sm text-red-600">소리 알림과 브라우저 알림 활성화</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="font-medium text-red-800">AI 설정</p>
                  <p className="text-sm text-red-600">Gemini API 키 입력으로 AI 피드백 활성화</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="font-medium text-red-800">스트릭 목표</p>
                  <p className="text-sm text-red-600">일일 목표 토마토 개수 설정</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-800 flex items-center gap-2">
              🎨 토마토 테마의 특별함
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 leading-relaxed">
              이 포모도로 타이머는 토마토를 모티브로 한 따뜻하고 친근한 디자인을 제공합니다. 
              종이 질감의 배경과 손글씨 폰트가 아날로그적인 감성을 더하여, 
              디지털 도구임에도 불구하고 마치 손으로 직접 쓴 일기장처럼 느껴집니다.
              집중할 때마다 쌓이는 토마토 🍅들이 여러분의 성취를 시각적으로 보여드립니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // 모바일 버전 (md 미만)
  const MobileHelp = () => (
    <div className="md:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-0.5 text-[10px] h-6 min-h-0">
            📱 도움말 보기
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="max-h-[90vh] max-w-[370px] mx-auto w-full rounded-t-lg pt-0.5 pb-1 px-0 overflow-y-auto relative"
        >
          <button
            onClick={() => setIsSheetOpen(false)}
            className="absolute right-1 top-1 z-10 p-0.5 rounded-full bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="닫기"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div className="px-0.5 pt-0.5">
            <SheetHeader className="mb-0.5">
              <SheetTitle className="text-[12px] text-red-800 flex items-center gap-0.5">
                🍅 사용법 안내
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-1 space-y-0.5">
              {/* 빠른 시작 가이드 */}
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-bold text-red-800 border-b border-red-200 pb-0.5 px-0.5">
                  🚀 빠른 시작
                </h3>
                <div className="space-y-0.5">
                  <div className="bg-red-50 p-0.5 rounded border border-red-200">
                    <h4 className="font-bold text-red-800 mb-0.5 flex items-center gap-0.5 text-[11px]">
                      <span className="text-xs">🎯</span> 1. 타이머 시작
                    </h4>
                    <p className="text-[10px] text-red-700 mb-0.5 leading-tight">25분 집중 타이머를 시작하세요</p>
                    <Button 
                      onClick={() => handleQuickStart('timer')} 
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-[10px] py-0 px-1 min-h-0 h-6"
                    >
                      바로가기 →
                    </Button>
                  </div>
                  <div className="bg-orange-50 p-0.5 rounded border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-0.5 flex items-center gap-0.5 text-[11px]">
                      <span className="text-xs">⚙️</span> 2. 설정 조정
                    </h4>
                    <p className="text-[10px] text-orange-700 mb-0.5 leading-tight">시간과 알림을 설정하세요</p>
                    <Button 
                      onClick={() => handleQuickStart('settings')} 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] py-0 px-1 min-h-0 h-6"
                    >
                      바로가기 →
                    </Button>
                  </div>
                  <div className="bg-yellow-50 p-0.5 rounded border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-0.5 flex items-center gap-0.5 text-[11px]">
                      <span className="text-xs">📝</span> 3. 회고 작성
                    </h4>
                    <p className="text-[10px] text-yellow-700 mb-0.5 leading-tight">AI 피드백을 받아보세요</p>
                    <Button 
                      onClick={() => handleQuickStart('reflection')} 
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-[10px] py-0 px-1 min-h-0 h-6"
                    >
                      바로가기 →
                    </Button>
                  </div>
                </div>
              </div>
              {/* 주요 기능 */}
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-bold text-red-800 border-b border-red-200 pb-0.5 px-0.5">
                  💡 주요 기능
                </h3>
                <div className="space-y-0.5">
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">🍅</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">포모도로 타이머</p>
                      <p className="text-[10px] text-red-600 leading-tight">25분 집중 + 5분 휴식</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">📝</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">AI 회고 피드백</p>
                      <p className="text-[10px] text-red-600 leading-tight">개인화된 피드백 제공</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">📊</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">상세한 통계</p>
                      <p className="text-[10px] text-red-600 leading-tight">집중 패턴 분석</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">🔔</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">브라우저 알림</p>
                      <p className="text-[10px] text-red-600 leading-tight">세션 완료 시 알림</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 설정 가이드 */}
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-bold text-red-800 border-b border-red-200 pb-0.5 px-0.5">
                  🔧 설정 가이드
                </h3>
                <div className="space-y-0.5">
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">⏰</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">시간 설정</p>
                      <p className="text-[10px] text-red-600 leading-tight">집중/휴식 시간 조정</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">🔔</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">알림 설정</p>
                      <p className="text-[10px] text-red-600 leading-tight">소리/브라우저 알림</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-0.5 bg-white p-0.5 rounded border">
                    <span className="text-xs">🤖</span>
                    <div>
                      <p className="font-bold text-red-800 text-[10px]">AI 설정</p>
                      <p className="text-[10px] text-red-600 leading-tight">Gemini API 키 입력</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 토마토 테마 설명 */}
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-bold text-red-800 border-b border-red-200 pb-0.5 px-0.5">
                  🎨 토마토 테마
                </h3>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-0.5 rounded border border-red-200">
                  <p className="text-[10px] text-red-700 leading-tight">
                    토마토를 모티브로 한 따뜻하고 친근한 디자인으로, 
                    종이 질감과 손글씨 폰트가 아날로그적 감성을 더합니다. 
                    집중할 때마다 쌓이는 토마토 🍅들이 성취를 보여줍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      <DesktopHelp />
      <MobileHelp />
    </>
  );
};
