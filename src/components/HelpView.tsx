import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Timer, 
  BarChart3, 
  Calendar, 
  FileText, 
  Settings, 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  CheckCircle,
  Lightbulb,
  Coffee,
  BookOpen,
  Zap,
  HelpCircle
} from 'lucide-react';

interface HelpViewProps {
  onTabChange?: (tab: string) => void;
}

// Mobile Help Sheet Component
const MobileHelpSheet = ({ onTabChange }: HelpViewProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed top-4 right-4 z-50 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 shadow-lg"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          도움말
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-red-800 font-handwriting">
            🍅 회고 토마토 타이머 사용법
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            쉽고 간편하게 포모도로 타이머를 사용하고 회고를 작성해보세요!
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-4">
          {/* 간단한 시작 가이드 */}
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-800">🚀 빠른 시작</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>🍅 타이머 탭에서 '시작' 버튼 클릭</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>25분 집중 후 자동으로 회고 작성창 등장</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>📊 통계 탭에서 성장 확인</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-xs flex-1"
                  onClick={() => onTabChange?.('timer')}
                >
                  타이머 시작
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-300 text-red-700 hover:bg-red-50 text-xs flex-1"
                  onClick={() => onTabChange?.('stats')}
                >
                  통계 보기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 주요 기능 */}
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-800">✨ 주요 기능</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-red-600" />
                  <span className="font-medium">포모도로 타이머:</span>
                  <span className="text-gray-600">25분 집중 + 5분 휴식</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">즉시 회고:</span>
                  <span className="text-gray-600">토마토 완료 직후 회고 작성</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="font-medium">시각적 통계:</span>
                  <span className="text-gray-600">스트릭, 차트로 성장 확인</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">캘린더:</span>
                  <span className="text-gray-600">날짜별 토마토 기록</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">❓ 자주 묻는 질문</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800 mb-1">Q. 타이머 시간을 바꿀 수 있나요?</p>
                  <p className="text-gray-600">A. 설정 탭에서 집중/휴식 시간을 자유롭게 조정 가능합니다.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Q. 알림이 안 와요</p>
                  <p className="text-gray-600">A. 브라우저 알림 권한을 허용해주세요.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Q. AI 피드백은 어떻게 받나요?</p>
                  <p className="text-gray-600">A. 설정에서 Gemini API 키를 입력하면 회고 분석을 받을 수 있습니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Desktop Help Component (existing full content)
const DesktopHelpView = ({ onTabChange }: HelpViewProps) => {
  const features = [
    {
      icon: <Timer className="w-6 h-6 text-red-600" />,
      title: "🍅 포모도로 타이머",
      description: "25분 집중, 5분 휴식의 과학적인 시간 관리로 최고의 집중력을 경험하세요.",
      benefits: ["자동 토마토 전환", "브라우저 알림", "커스터마이징 가능"]
    },
    {
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      title: "📝 즉시 회고 작성",
      description: "토마토 완료 직후 생생한 기억을 바탕으로 회고를 작성하고 성장을 기록하세요.",
      benefits: ["토마토별 회고", "AI 피드백", "하루 회고 모아보기"]
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-600" />,
      title: "📊 시각적 통계",
      description: "스트릭, 차트, 달력으로 당신의 성장을 한눈에 확인하고 동기부여를 받으세요.",
      benefits: ["일별/주별/월별 통계", "집중 시간 분석", "성장 추이 확인"]
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "📅 캘린더 뷰",
      description: "달력에서 날짜별 토마토 개수와 회고를 확인하고 패턴을 파악하세요.",
      benefits: ["날짜별 기록", "토마토 시각화", "회고 히스토리"]
    }
  ];

  const testimonials = [
    {
      name: "김지수",
      role: "컴퓨터공학과 대학생",
      content: "타이머와 회고가 한 앱에서 연결되어서 정말 편해요. 매일 얼마나 집중했는지 시각적으로 보니 동기부여가 됩니다!",
      avatar: "🎓"
    },
    {
      name: "부기",
      role: "우아한테크코스 수강생",
      content: "토마토 직후 바로 회고를 쓰니까 기억이 생생해서 좋아요. AI 피드백도 받을 수 있어서 더욱 체계적으로 학습할 수 있습니다.",
      avatar: "💻"
    },
    {
      name: "박민호",
      role: "스터디 그룹 리더",
      content: "팀원들의 학습 현황을 객관적으로 파악할 수 있어서 피드백하기 좋아요. 모두가 꾸준히 성장하는 모습을 보니 뿌듯합니다.",
      avatar: "👨‍💼"
    }
  ];

  const howToUse = [
    {
      step: 1,
      title: "타이머 시작하기",
      description: "🍅 타이머 탭에서 '시작' 버튼을 눌러 25분 집중 토마토를 시작하세요.",
      tip: "설정에서 집중 시간을 조정할 수 있어요!"
    },
    {
      step: 2,
      title: "집중하고 완료하기",
      description: "타이머가 끝나면 자동으로 회고 작성창이 나타납니다. 방금 한 일을 간단히 기록하세요.",
      tip: "짧게라도 꾸준히 기록하는 것이 중요해요!"
    },
    {
      step: 3,
      title: "통계 확인하기",
      description: "📊 통계 탭에서 오늘의 집중 시간, 스트릭, 주간 변화율을 확인하세요.",
      tip: "매일 조금씩이라도 꾸준히 하면 큰 변화를 볼 수 있어요!"
    },
    {
      step: 4,
      title: "회고 정리하기",
      description: "📝 회고 탭에서 날짜별로 회고를 모아보고, AI 피드백도 받아보세요.",
      tip: "정기적으로 회고를 읽어보면 자신의 패턴을 파악할 수 있어요!"
    }
  ];

  return (
    <Card className="border-2 border-red-200 bg-white max-w-full overflow-hidden">
      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 font-handwriting">
            🍅 회고 토마토 타이머 사용법
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            쉽고 간편하게 포모도로 타이머를 사용하고, 
            매 토마토마다 회고를 작성해 최고의 학습 효과를 경험하세요!
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
            <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs sm:text-sm">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              집중력 향상
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              지속적 성장
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              팀 관리
            </Badge>
          </div>
        </div>

        
        
        <Separator />

        
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            🍅 포모도로 기법이란?
          </h2>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 rounded-xl border-2 border-red-200">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2">
                  🕰️ 1980년대 후반, 이탈리아 대학생의 혁신적인 발견
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed px-2">
                  프란체스코 시릴로(Francesco Cirillo)라는 이탈리아 대학생이 
                  <span className="font-semibold text-red-600">토마토 모양의 요리용 타이머</span>를 발견했습니다. 
                  이 작은 토마토 타이머로 25분간 집중해서 공부한 후 5분간 휴식하는 방법을 시도해보니, 
                  놀랍게도 집중력이 크게 향상되었죠! 🎯
                </p>
              </div>
              
              
            </div>
          </div>
        </div>

        <Separator />

        
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            🚀 주요 기능을 한눈에!
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            📖 간단한 사용법
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {howToUse.map((step, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                  {step.step}
                </div>
                <CardHeader className="pb-3 pr-12 sm:pr-16">
                  <CardTitle className="text-base sm:text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
                  <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-yellow-800">{step.tip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            💬 많은 사용자들이 애용하고 있습니다
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-red-100 hover:border-red-200 transition-colors">
                <CardContent className="pt-4 sm:pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl">{testimonial.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        
        <div className="text-center space-y-3 sm:space-y-4 bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 lg:p-8 rounded-2xl border-2 border-red-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            🎯 지금 바로 시작해보세요!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-2">
            복잡한 설정 없이, 바로 타이머를 시작하고 회고를 작성할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-sm sm:text-base"
              onClick={() => onTabChange?.('timer')}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              타이머 시작하기
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50 text-sm sm:text-base"
              onClick={() => onTabChange?.('stats')}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              통계 보기
            </Button>
          </div>
        </div>

        
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            ❓ 자주 묻는 질문
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">데이터는 어디에 저장되나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  모든 데이터는 브라우저의 로컬스토리지에 저장됩니다. 
                  브라우저 캐시를 삭제하면 데이터가 사라지니 주의해주세요.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">AI 피드백은 어떻게 받나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  설정에서 Gemini API 키를 입력하면, 
                  회고 내용을 바탕으로 AI가 학습 패턴과 개선점을 분석해드립니다.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">타이머 시간을 조정할 수 있나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  설정 탭에서 집중 시간, 휴식 시간, 긴 휴식 간격 등을 
                  자유롭게 조정할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">알림이 안 와요</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600">
                  브라우저에서 알림 권한을 허용해주세요. 
                  설정에서 알림과 소리 옵션을 확인할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const HelpView = ({ onTabChange }: HelpViewProps) => {
  return (
    <>
      {/* Mobile: Show Sheet */}
      <div className="block md:hidden">
        <MobileHelpSheet onTabChange={onTabChange} />
      </div>
      
      {/* Desktop: Show Full Content */}
      <div className="hidden md:block">
        <DesktopHelpView onTabChange={onTabChange} />
      </div>
    </>
  );
};
