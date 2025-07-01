
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reflection: string) => void;
  sessionNumber: number;
}

export const ReflectionModal = ({ isOpen, onClose, onSubmit, sessionNumber }: ReflectionModalProps) => {
  const [reflection, setReflection] = useState('');

  const handleSubmit = () => {
    onSubmit(reflection);
    setReflection('');
  };

  const handleSkip = () => {
    onSubmit('');
    setReflection('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            세션 {sessionNumber} 회고
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reflection" className="text-sm font-medium">
              이번 세션은 어떠셨나요? (선택사항)
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              • 무엇을 했나요?<br/>
              • 어떤 점이 좋았나요?<br/>
              • 다음에 개선할 점은?
            </p>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="예: 수학 문제를 풀었는데 집중이 잘 됐다. 다음엔 더 어려운 문제에 도전해보자."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              저장
            </Button>
            <Button 
              onClick={handleSkip}
              variant="outline"
              className="flex-1"
            >
              건너뛰기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
