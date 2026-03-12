import { Image, Video, Mic, FileText, X } from 'lucide-react';
import { Button } from './ui/button';

interface AttachmentMenuProps {
  onImageSelect: () => void;
  onVideoSelect: () => void;
  onAudioRecord: () => void;
  onFileSelect: () => void;
  onClose: () => void;
}

export function AttachmentMenu({
  onImageSelect,
  onVideoSelect,
  onAudioRecord,
  onFileSelect,
  onClose,
}: AttachmentMenuProps) {
  return (
    <div className="absolute bottom-full left-0 mb-2 bg-black/95 backdrop-blur-sm border border-rose-300/20 rounded-2xl p-3 shadow-2xl z-50">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onImageSelect}
          className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-rose-300/10 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-rose-300/20 flex items-center justify-center">
            <Image className="w-5 h-5 text-rose-300" />
          </div>
          <span className="text-xs text-rose-200 font-medium">Image</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onVideoSelect}
          className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-rose-300/10 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-rose-300/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-rose-300" />
          </div>
          <span className="text-xs text-rose-200 font-medium">Video</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAudioRecord}
          className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-rose-300/10 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-rose-300/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-rose-300" />
          </div>
          <span className="text-xs text-rose-200 font-medium">Audio</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFileSelect}
          className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-rose-300/10 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-rose-300/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-rose-300" />
          </div>
          <span className="text-xs text-rose-200 font-medium">File</span>
        </Button>
      </div>
    </div>
  );
}