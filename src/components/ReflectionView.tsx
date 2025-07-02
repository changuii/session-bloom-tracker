import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SessionData } from '@/types/pomodoro';
import { Calendar, Search, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReflectionViewProps {
  sessions: SessionData[];
  onUpdateSession: (sessionId: string, updates: Partial<SessionData>) => void;
  geminiApiKey?: string;
}

export const ReflectionView = ({ sessions, onUpdateSession, geminiApiKey }: ReflectionViewProps) => {
  const [searchDate, setSearchDate] = useState('');
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [editingReflection, setEditingReflection] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const { toast } = useToast();

  const filteredSessions = useMemo(() => {
    const focusSessions = sessions.filter(s => s.type === 'focus' && s.completed);
    
    if (!searchDate) return focusSessions;
    
    return focusSessions.filter(s => s.date.includes(searchDate));
  }, [sessions, searchDate]);

  const dailyReflections = useMemo(() => {
    const grouped = filteredSessions.reduce((acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = [];
      }
      acc[session.date].push(session);
      return acc;
    }, {} as Record<string, SessionData[]>);

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, sessions]) => ({
        date,
        sessions,
        totalFocusTime: sessions.reduce((sum, s) => sum + s.duration, 0),
        reflections: sessions.filter(s => s.reflection).map(s => s.reflection!),
        hasReflections: sessions.some(s => s.reflection)
      }));
  }, [filteredSessions]);

  const handleEditReflection = (session: SessionData) => {
    setSelectedSession(session);
    setEditingReflection(session.reflection || '');
  };

  const handleSaveReflection = () => {
    if (selectedSession) {
      onUpdateSession(selectedSession.id, { reflection: editingReflection });
      setSelectedSession(null);
      setEditingReflection('');
      toast({
        title: '회고 수정 완료',
        description: '회고가 성공적으로 수정되었습니다.'
      });
    }
  };

  const getAIFeedback = async (reflections: string[]) => {
    const apiKey = geminiApiKey || tempApiKey;
    if (!apiKey) {
      toast({
        title: 'API 키 필요',
        description: 'Gemini API 키를 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    if (reflections.length === 0) {
      toast({
        title: '회고 내용 없음',
        description: '분석할 회고 내용이 없습니다.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoadingAI(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `다음은 사용자의 포모도로 학습 회고들입니다. 이를 분석해서 학습 패턴, 강점, 개선점, 앞으로의 방향성에 대해 건설적이고 구체적인 피드백을 한국어로 200자 내외로 작성해주세요.

회고 내용들:
${reflections.map((r, i) => `${i + 1}. ${r}`).join('\n')}

피드백 형식:
- 학습 패턴: [패턴 분석]
- 강점: [발견된 강점]
- 개선점: [구체적 개선사항]
- 제안: [앞으로의 방향성]`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || 'AI 피드백을 생성할 수 없습니다.';
      
      return feedback;
    } catch (error) {
      console.error('AI 피드백 오류:', error);
      toast({
        title: 'AI 피드백 오류',
        description: 'AI 피드백을 가져오는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAIFeedback = async (reflections: string[]) => {
    const feedback = await getAIFeedback(reflections);
    if (feedback) {
      toast({
        title: '🤖 AI 피드백',
        description: feedback,
        duration: 10000
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 font-handwriting">📝 회고 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search-date">날짜 검색</Label>
              <Input
                id="search-date"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <Button 
              onClick={() => setSearchDate('')}
              variant="outline"
              className="self-end border-red-300 text-red-700 hover:bg-red-50"
            >
              <Search className="w-4 h-4 mr-2" />
              전체 보기
            </Button>
          </div>

          {!geminiApiKey && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Label htmlFor="temp-api-key" className="text-orange-800 font-medium">
                AI 피드백을 위한 Gemini API 키 (임시)
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="temp-api-key"
                  type="password"
                  placeholder="Gemini API 키를 입력하세요"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="border-orange-300"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  API 키 발급
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {dailyReflections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">아직 회고가 없습니다</h3>
              <p className="text-red-600">첫 번째 토마토 세션을 완료하고 회고를 작성해보세요! 🍅</p>
            </CardContent>
          </Card>
        ) : (
          dailyReflections.map(({ date, sessions, totalFocusTime, reflections, hasReflections }) => (
            <Card key={date}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-red-800 font-handwriting">
                    📅 {new Date(date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-red-600">
                      🍅 {sessions.length}개 완료 • {Math.round(totalFocusTime / 60)}분 집중
                    </div>
                    {hasReflections && (
                      <Button
                        onClick={() => handleAIFeedback(reflections)}
                        disabled={isLoadingAI}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isLoadingAI ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Bot className="w-3 h-3 mr-1" />
                        )}
                        AI 피드백
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div key={session.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-red-800">
                          🍅 토마토 {index + 1} ({Math.round(session.duration / 60)}분)
                        </h4>
                        <Button
                          onClick={() => handleEditReflection(session)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-100"
                        >
                          {session.reflection ? '수정' : '회고 작성'}
                        </Button>
                      </div>
                      {session.reflection ? (
                        <p className="text-red-700 bg-white p-3 rounded border border-red-200">
                          {session.reflection}
                        </p>
                      ) : (
                        <p className="text-red-400 italic">회고가 작성되지 않았습니다.</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="bg-white border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-handwriting">
              🍅 회고 {selectedSession ? '수정' : '작성'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reflection-edit" className="text-red-700">회고 내용</Label>
              <Textarea
                id="reflection-edit"
                value={editingReflection}
                onChange={(e) => setEditingReflection(e.target.value)}
                placeholder="이번 토마토 세션은 어떠셨나요?"
                className="min-h-[120px] border-red-200 focus:border-red-400"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveReflection}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                저장
              </Button>
              <Button 
                onClick={() => setSelectedSession(null)}
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
