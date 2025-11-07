import { useState, useEffect } from 'react';
import { Reminder } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Copy,
  Share2,
  FileJson,
  FileText,
  Check,
  Download,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: Reminder | null;
}

export function ShareDialog({ open, onOpenChange, reminder }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  
  // Check if Web Share API is available and working
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      // Test if share is actually allowed
      setCanShare(true);
    }
  }, []);

  if (!reminder) return null;

  // Helper functions
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

  const getDaysText = (days: number[]): string => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    if (days.length === 7) return '매일';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return '평일';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return '주말';
    return days.map(d => dayNames[d]).join(', ');
  };

  // Generate text format
  const generateTextFormat = () => {
    let text = `📌 ${reminder.title}\n`;
    
    if (reminder.description) {
      text += `\n${reminder.description}\n`;
    }
    
    text += `\n우선순위: ${getPriorityText(reminder.priority)}\n`;
    
    if (reminder.trigger === 'time' || reminder.trigger === 'both') {
      text += `⏰ 시간: ${reminder.time || '설정 안 됨'}`;
      if (reminder.days && reminder.days.length > 0) {
        text += ` (${getDaysText(reminder.days)})`;
      }
      text += '\n';
    }
    
    if (reminder.trigger === 'location' || reminder.trigger === 'both') {
      text += `📍 위치: ${reminder.location?.name || '설정 안 됨'}`;
      if (reminder.location?.triggerType) {
        text += ` (${reminder.location.triggerType === 'arrive' ? '도착 시' : '떠날 때'})`;
      }
      text += '\n';
    }
    
    if (reminder.checklist.length > 0) {
      text += `\n✓ 체크리스트:\n`;
      reminder.checklist.forEach((item, index) => {
        text += `${index + 1}. ${item.text}${item.completed ? ' ✓' : ''}\n`;
      });
    }
    
    text += `\n📊 완료율: ${reminder.totalShown > 0 ? Math.round((reminder.completionCount / reminder.totalShown) * 100) : 0}%`;
    text += ` (${reminder.completionCount}/${reminder.totalShown})`;
    
    return text;
  };

  // Generate JSON format
  const generateJSONFormat = () => {
    const exportData = {
      title: reminder.title,
      description: reminder.description,
      icon: reminder.icon,
      priority: reminder.priority,
      trigger: reminder.trigger,
      time: reminder.time,
      days: reminder.days,
      location: reminder.location,
      checklist: reminder.checklist.map(item => ({
        text: item.text,
        completed: false, // Reset completion status for import
      })),
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const textFormat = generateTextFormat();
  const jsonFormat = generateJSONFormat();

  const copyToClipboard = async (text: string) => {
    // Try modern clipboard API first, but immediately fall back on error
    let clipboardSuccess = false;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        clipboardSuccess = true;
      }
    } catch (error: any) {
      // Clipboard API failed (likely due to permissions policy)
      console.log('Clipboard API blocked, using fallback');
    }
    
    // If modern API failed, use fallback method
    if (!clipboardSuccess) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            clipboardSuccess = true;
          }
        } finally {
          document.body.removeChild(textArea);
        }
      } catch (error: any) {
        console.error('Fallback copy failed:', error);
      }
    }
    
    if (clipboardSuccess) {
      setCopied(true);
      toast.success('클립보드에 복사됨');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('자동 복사 실패', {
        description: '텍스트 영역을 클릭하여 수동으로 복사해주세요',
      });
    }
  };

  const shareViaWebShare = async () => {
    // Check if Web Share API is supported
    if (!navigator.share || !canShare) {
      // Fallback to download
      toast.info('공유 대신 다운로드', {
        description: '파일로 다운로드합니다',
      });
      downloadAsFile(textFormat, `reminder-${reminder.id}.txt`);
      return;
    }

    try {
      await navigator.share({
        title: `리마인더: ${reminder.title}`,
        text: textFormat,
      });
      toast.success('공유 완료');
    } catch (error: any) {
      // User cancelled the share - silently ignore
      if (error.name === 'AbortError') {
        return;
      }
      
      // If share is blocked (NotAllowedError), fall back to download
      if (error.name === 'NotAllowedError') {
        console.log('Share API blocked by permissions policy, disabling share button');
        setCanShare(false); // Disable share button for future attempts
        toast.info('공유 기능 제한됨', {
          description: '파일로 다운로드합니다',
        });
        downloadAsFile(textFormat, `reminder-${reminder.id}.txt`);
      } else {
        // For other unexpected errors, log and try to copy
        console.error('Share failed:', error);
        await copyToClipboard(textFormat);
      }
    }
  };

  const downloadAsFile = (content: string, filename: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('다운로드 완료');
    } catch (error: any) {
      console.error('Download failed:', error);
      toast.error('다운로드 실패', {
        description: '다시 시도해주세요',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            리마인더 공유
          </DialogTitle>
          <DialogDescription>
            리마인더를 텍스트 또는 JSON 형식으로 공유하고 내보낼 수 있습니다
          </DialogDescription>
        </DialogHeader>

        {/* Reminder Preview */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{reminder.icon}</span>
            <div className="flex-1">
              <h3 className="text-sm">{reminder.title}</h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {getPriorityText(reminder.priority)}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="text" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <FileText className="h-4 w-4" />
              텍스트
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex-1 overflow-hidden flex flex-col gap-3 mt-3">
            <div className="relative flex-1">
              <Textarea
                value={textFormat}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                className="h-full font-mono text-xs resize-none cursor-text"
                rows={12}
              />
              <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded pointer-events-none">
                클릭하여 선택
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(textFormat)}
                className="flex-1 gap-2 active:scale-95 transition-transform"
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    복사
                  </>
                )}
              </Button>
              
              <Button
                onClick={shareViaWebShare}
                className="flex-1 gap-2 active:scale-95 transition-transform"
              >
                {canShare ? (
                  <>
                    <Share2 className="h-4 w-4" />
                    공유
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    저장
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => downloadAsFile(textFormat, `reminder-${reminder.id}.txt`)}
                variant="outline"
                size="icon"
                className="active:scale-95 transition-transform"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="json" className="flex-1 overflow-hidden flex flex-col gap-3 mt-3">
            <div className="relative flex-1">
              <Textarea
                value={jsonFormat}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                className="h-full font-mono text-xs resize-none cursor-text"
                rows={12}
              />
              <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded pointer-events-none">
                클릭하여 선택
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(jsonFormat)}
                className="flex-1 gap-2 active:scale-95 transition-transform"
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    복사
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => downloadAsFile(jsonFormat, `reminder-${reminder.id}.json`)}
                className="flex-1 gap-2 active:scale-95 transition-transform"
              >
                <Download className="h-4 w-4" />
                다운로드
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              💡 JSON 형식은 다른 앱에서 가져올 수 있습니다
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
