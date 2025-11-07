import { useState } from 'react';
import { Reminder, ReminderPriority, ReminderTrigger } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileJson, AlertCircle, Check, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const EXAMPLE_JSON = {
  "title": "외출 전 확인",
  "description": "집을 나서기 전 안전 체크",
  "icon": "🏠",
  "priority": "urgent",
  "trigger": "location",
  "location": {
    "name": "우리집",
    "triggerType": "leave",
    "radius": 100
  },
  "checklist": [
    {
      "text": "가스밸브 잠금",
      "completed": false
    },
    {
      "text": "창문 잠금",
      "completed": false
    },
    {
      "text": "불 끄기",
      "completed": false
    }
  ]
};

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completionCount' | 'totalShown'>) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleParse = async () => {
    setIsParsing(true);
    setError(null);
    
    // Simulate parsing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Validate required fields
      if (!parsed.title || typeof parsed.title !== 'string') {
        throw new Error('제목(title)이 필요합니다');
      }
      
      if (!parsed.icon || typeof parsed.icon !== 'string') {
        throw new Error('아이콘(icon)이 필요합니다');
      }
      
      if (!parsed.priority || !['urgent', 'week', 'routine'].includes(parsed.priority)) {
        throw new Error('올바른 우선순위(priority)가 필요합니다');
      }
      
      if (!parsed.trigger || !['time', 'location', 'both'].includes(parsed.trigger)) {
        throw new Error('올바른 알림 타입(trigger)이 필요합니다');
      }
      
      if (!Array.isArray(parsed.checklist)) {
        throw new Error('체크리스트(checklist)가 배열이어야 합니다');
      }
      
      setPreviewData(parsed);
      setError(null);
      toast.success('✓ JSON 파싱 완료');
    } catch (err: any) {
      setError(err.message || 'JSON 파싱 실패');
      setPreviewData(null);
      toast.error('JSON 파싱 실패', {
        description: err.message,
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    setIsImporting(true);
    
    // Simulate import delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const reminder: Omit<Reminder, 'id' | 'createdAt' | 'completionCount' | 'totalShown'> = {
      title: previewData.title,
      description: previewData.description,
      icon: previewData.icon,
      priority: previewData.priority as ReminderPriority,
      trigger: previewData.trigger as ReminderTrigger,
      time: previewData.time,
      days: previewData.days,
      location: previewData.location,
      groupId: undefined, // Don't import group assignment
      checklist: previewData.checklist.map((item: any, index: number) => ({
        id: `imported-${Date.now()}-${index}`,
        text: item.text,
        completed: false,
      })),
    };

    onImport(reminder);
    handleReset();
    setIsImporting(false);
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setJsonInput('');
    setPreviewData(null);
    setError(null);
    setIsParsing(false);
    setIsImporting(false);
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴 긴급';
      case 'week':
        return '🟡 이번 주';
      case 'routine':
        return '🟢 루틴';
      default:
        return priority;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            리마인더 가져오기
          </DialogTitle>
          <DialogDescription>
            JSON 형식의 리마인더 데이터를 가져옵니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Example Button */}
          <Button
            onClick={() => {
              setJsonInput(JSON.stringify(EXAMPLE_JSON, null, 2));
              toast.info('예시 데이터 로드됨');
            }}
            variant="outline"
            className="w-full gap-2 active:scale-95 transition-transform"
          >
            <Lightbulb className="h-4 w-4" />
            예시 데이터 불러오기
          </Button>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">파일 업로드</Label>
            <div className="flex gap-2">
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="w-full gap-2 active:scale-95 transition-transform"
              >
                <FileJson className="h-4 w-4" />
                JSON 파일 선택
              </Button>
            </div>
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <Label htmlFor="json-input">또는 JSON 붙여넣기</Label>
            <Textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"title": "리마인더 제목", "icon": "📌", ...}'
              className="font-mono text-xs"
              rows={8}
            />
          </div>

          {/* Parse Button */}
          <Button
            onClick={handleParse}
            disabled={!jsonInput.trim() || isParsing}
            className="w-full gap-2 active:scale-95 transition-transform"
            variant="outline"
          >
            {isParsing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                확인 중...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                데이터 확인
              </>
            )}
          </Button>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {previewData && (
            <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
              <h3 className="flex items-center gap-2 mb-3">
                미리보기
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{previewData.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm">{previewData.title}</p>
                    {previewData.description && (
                      <p className="text-xs text-gray-500">{previewData.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getPriorityText(previewData.priority)}
                  </Badge>
                  
                  {previewData.trigger === 'time' && (
                    <Badge variant="outline" className="text-xs">
                      ⏰ {previewData.time || '시간 설정'}
                    </Badge>
                  )}
                  
                  {previewData.trigger === 'location' && (
                    <Badge variant="outline" className="text-xs">
                      📍 {previewData.location?.name || '위치 설정'}
                    </Badge>
                  )}
                  
                  {previewData.trigger === 'both' && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        ⏰ {previewData.time || '시간'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📍 {previewData.location?.name || '위치'}
                      </Badge>
                    </>
                  )}
                </div>

                {previewData.checklist && previewData.checklist.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600 mb-2">
                      체크리스트 ({previewData.checklist.length}개)
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {previewData.checklist.slice(0, 3).map((item: any, index: number) => (
                        <li key={index}>• {item.text}</li>
                      ))}
                      {previewData.checklist.length > 3 && (
                        <li className="text-gray-400">
                          ...외 {previewData.checklist.length - 3}개
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
            className="active:scale-95 transition-transform"
          >
            취소
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!previewData || isImporting}
            className="active:scale-95 transition-transform"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                가져오는 중...
              </>
            ) : (
              '가져오기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
