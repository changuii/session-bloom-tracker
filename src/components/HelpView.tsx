
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Zap
} from 'lucide-react';

interface HelpViewProps {
  onTabChange?: (tab: string) => void;
}

export const HelpView = ({ onTabChange }: HelpViewProps) => {
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

        {/* 포모도로 기법 소개 */}
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
                <Card className="bg-white border-red-200">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">🍅</div>
                    <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">포모도로의 의미</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      이탈리아어로 <span className="font-semibold">"토마토"</span>를 뜻합니다. 
                      시릴로가 사용한 토마토 모양 타이머에서 유래했어요!
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-orange-200">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">⏰</div>
                    <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">과학적 시간 관리</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-semibold">25분 집중 + 5분 휴식</span>의 
                      최적화된 사이클로 뇌의 집중력을 극대화합니다.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-green-200 sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl mb-2">🧠</div>
                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">뇌과학적 효과</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      정기적인 휴식으로 <span className="font-semibold">집중력 회복</span>과 
                      <span className="font-semibold">기억력 향상</span>을 동시에 달성합니다.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">왜 25분일까요?</h4>
                    <p className="text-xs sm:text-sm text-yellow-700">
                      인간의 집중력은 보통 20-30분 정도가 최적입니다. 25분은 
                      <span className="font-semibold">충분히 집중할 수 있으면서도 지치지 않는</span> 
                      마법의 시간이에요! 그리고 5분 휴식은 뇌가 정보를 정리하고 
                      다음 집중을 준비하는 데 딱 좋은 시간입니다. 🎯
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4">
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      🚀 포모도로 기법의 효과
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>집중력 향상:</strong> 명확한 시간 제한으로 더 집중할 수 있어요</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>스트레스 감소:</strong> 정기적인 휴식으로 정신적 피로를 줄여요</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>생산성 증대:</strong> 체계적인 시간 관리로 더 많은 일을 해낼 수 있어요</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>기억력 개선:</strong> 휴식 시간에 뇌가 정보를 정리해요</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-purple-200">
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      🎯 우리 앱의 특별한 점
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">🍅</span>
                        <span><strong>즉시 회고:</strong> 토마토 완료 직후 생생한 기억으로 회고 작성</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">🤖</span>
                        <span><strong>AI 피드백:</strong> 회고 내용을 바탕으로 개인 맞춤 분석</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">📊</span>
                        <span><strong>시각적 통계:</strong> 성장 과정을 한눈에 확인</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">⚙️</span>
                        <span><strong>유연한 설정:</strong> 본인에게 맞는 시간으로 조정 가능</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* 주요 기능 소개 */}
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

        {/* 사용법 가이드 */}
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

        {/* 사용자 후기 */}
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

        {/* 시작하기 CTA */}
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

        {/* FAQ 섹션 */}
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
