import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/hooks/useProjects";
import { TimelineTrack, TimelineItem, useTimeline } from "@/hooks/useTimeline";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from "lucide-react";

interface EditorTimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayPause: () => void;
  selectedLayer: string | null;
  onLayerSelect: (layerId: string | null) => void;
  currentProject: Project | null;
  tracks: TimelineTrack[];
  items: TimelineItem[];
}

const mockTimelineLayers = [
  {
    id: "layer1",
    name: "Welcome Text",
    type: "text",
    visible: true,
    locked: false,
    startTime: 0,
    endTime: 5,
    color: "#3b82f6"
  },
  {
    id: "layer2",
    name: "Background Shape",
    type: "shape",
    visible: true,
    locked: false,
    startTime: 1,
    endTime: 8,
    color: "#10b981"
  },
  {
    id: "layer3",
    name: "Background Music",
    type: "audio",
    visible: true,
    locked: false,
    startTime: 0,
    endTime: 30,
    color: "#f59e0b"
  },
];

export const EditorTimeline = ({
  currentTime,
  duration,
  isPlaying,
  onTimeChange,
  onPlayPause,
  selectedLayer,
  onLayerSelect,
  currentProject,
  tracks,
  items
}: EditorTimelineProps) => {
  const [volume, setVolume] = useState([80]);
  const { createTrack } = useTimeline(currentProject?.id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-64 bg-surface-1 border-t border-border flex flex-col">
      {/* Timeline Controls */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="default" onClick={onPlayPause} className="h-8 w-8 p-0">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Time Display */}
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="w-20">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="h-6"
              />
            </div>
          </div>
        </div>

        {/* Timeline Actions */}
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-3 text-xs"
            onClick={() => createTrack(`Track ${tracks.length + 1}`, 'video')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Track
          </Button>
        </div>
      </div>

      {/* Timeline Area */}
      <div className="flex-1 flex">
        {/* Layer List */}
        <div className="w-48 border-r border-border">
          <div className="h-8 bg-surface-2 border-b border-border flex items-center px-3">
            <span className="text-xs font-medium text-muted-foreground">LAYERS</span>
          </div>
          <ScrollArea className="h-[calc(100%-2rem)]">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`h-12 border-b border-border/50 flex items-center px-3 cursor-pointer transition-colors ${
                  selectedLayer === track.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-surface-2'
                }`}
                onClick={() => onLayerSelect(track.id)}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-3 h-3 rounded-sm bg-primary"
                  />
                  <span className="text-sm text-foreground truncate flex-1">
                    {track.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle visibility
                    }}
                  >
                    {track.is_visible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle lock
                    }}
                  >
                    {track.is_locked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {tracks.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground mb-2">No tracks yet</p>
                <Button
                  size="sm"
                  onClick={() => createTrack('Video Track', 'video')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Track
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 overflow-x-auto">
          {/* Time Ruler */}
          <div className="h-8 bg-surface-2 border-b border-border relative">
            <div className="flex h-full">
              {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-20 border-r border-border/30 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">{i}s</span>
                </div>
              ))}
            </div>
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-primary z-10"
              style={{ left: `${(currentTime / duration) * (Math.ceil(duration) * 80)}px` }}
            />
          </div>

          {/* Timeline Tracks */}
          <ScrollArea className="h-[calc(100%-2rem)]">
            {tracks.map((track) => {
              const trackItems = items.filter(item => item.track_id === track.id);
              return (
                <div key={track.id} className="h-12 border-b border-border/50 relative">
                  {/* Track Background */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-20 border-r border-border/20" />
                    ))}
                  </div>

                  {/* Track Items */}
                  {trackItems.map((item) => (
                    <div
                      key={item.id}
                      className={`absolute top-1 bottom-1 rounded-md border-2 transition-all cursor-pointer ${
                        selectedLayer === item.id 
                          ? 'border-primary bg-primary/20' 
                          : 'border-transparent hover:border-primary/50'
                      }`}
                      style={{
                        left: `${(item.start_time / 1000 / duration) * (Math.ceil(duration) * 80)}px`,
                        width: `${(item.duration / 1000 / duration) * (Math.ceil(duration) * 80)}px`,
                        backgroundColor: 'hsl(var(--primary) / 0.2)'
                      }}
                      onClick={() => onLayerSelect(item.id)}
                    >
                      <div className="h-full flex items-center px-2">
                        <span className="text-xs text-foreground font-medium truncate">
                          Item {item.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Playhead */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary z-10 pointer-events-none"
                    style={{ left: `${(currentTime / duration) * (Math.ceil(duration) * 80)}px` }}
                  />
                </div>
              );
            })}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};