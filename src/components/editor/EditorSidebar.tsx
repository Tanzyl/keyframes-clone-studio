import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useMediaLibrary, MediaAsset } from "@/hooks/useMediaLibrary";
import { Project } from "@/hooks/useProjects";
import { Workspace } from "@/hooks/useWorkspaces";
import { VideoUpload } from "./VideoUpload";
import { toast } from "@/hooks/use-toast";
import { 
  Search,
  Type,
  Square,
  Circle,
  Triangle,
  Image,
  Video,
  Music,
  Plus,
  FolderOpen,
  Upload,
  Download,
  Trash2,
  Shapes,
  Sparkles
} from "lucide-react";

interface EditorSidebarProps {
  mediaAssets: MediaAsset[];
  currentProject: Project | null;
  currentWorkspace: Workspace | null;
  onToolSelect?: (tool: string) => void;
  onAddElement?: (element: any) => void;
}

const textTemplates = [
  { id: 1, name: "Animated Title", preview: "Sample Text" },
  { id: 2, name: "Subtitle", preview: "Subtitle Text" },
  { id: 3, name: "Call to Action", preview: "Click Here!" },
];

const shapes = [
  { id: 1, name: "Rectangle", icon: "□" },
  { id: 2, name: "Circle", icon: "○" },
  { id: 3, name: "Triangle", icon: "△" },
  { id: 4, name: "Arrow", icon: "→" },
];

export const EditorSidebar = ({ mediaAssets, currentProject, currentWorkspace, onToolSelect, onAddElement }: EditorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading } = useMediaLibrary(currentWorkspace?.id);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !currentProject) return;

    for (const file of Array.from(files)) {
      await uploadFile(file, currentProject.id);
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.original_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = mediaFilter === "all" || 
      (mediaFilter === "image" && asset.media_type === 'image') ||
      (mediaFilter === "video" && asset.media_type === 'video') ||
      (mediaFilter === "audio" && asset.media_type === 'audio');
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-80 bg-surface-1 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="media" className="flex-1 flex flex-col">
        <ResizablePanelGroup direction="vertical" className="flex-1">
          <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
            <TabsList className="grid grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="media" className="text-xs">
                <FolderOpen className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs">
                <Type className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="shapes" className="text-xs">
                <Shapes className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <Sparkles className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={85}>
            <div className="overflow-hidden h-full">
              <TabsContent value="media" className="h-full m-0">
                <div className="p-4 space-y-4 h-full flex flex-col">
                  <VideoUpload 
                    workspaceId={currentWorkspace?.id}
                    projectId={currentProject?.id}
                    onUploadComplete={(asset) => {
                      toast({
                        title: "Media Added",
                        description: "File has been added to your media library",
                      });
                    }}
                  />
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={mediaFilter === "all" ? "default" : "ghost"} 
                      className="flex-1"
                      onClick={() => setMediaFilter("all")}
                    >
                      All
                    </Button>
                    <Button 
                      size="sm" 
                      variant={mediaFilter === "image" ? "default" : "ghost"} 
                      className="flex-1"
                      onClick={() => setMediaFilter("image")}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={mediaFilter === "video" ? "default" : "ghost"} 
                      className="flex-1"
                      onClick={() => setMediaFilter("video")}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={mediaFilter === "audio" ? "default" : "ghost"} 
                      className="flex-1"
                      onClick={() => setMediaFilter("audio")}
                    >
                      <Music className="h-4 w-4" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1">
                    {uploading && (
                      <div className="text-center text-muted-foreground py-8">
                        Uploading files...
                      </div>
                    )}
                    
                    {!uploading && filteredAssets.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        {searchQuery ? "No media found" : "Upload files to get started"}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {filteredAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="relative group cursor-pointer border border-border rounded-lg p-2 hover:bg-surface-2 transition-colors"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', asset.file_url || '');
                            e.dataTransfer.setData('application/json', JSON.stringify(asset));
                          }}
                        >
                          <div className="aspect-square bg-surface-2 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                            {asset.media_type === 'image' && asset.file_url ? (
                              <img 
                                src={asset.file_url} 
                                alt={asset.name}
                                className="w-full h-full object-cover"
                              />
                            ) : asset.media_type === 'video' ? (
                              <Video className="h-6 w-6 text-blue-500" />
                            ) : asset.media_type === 'audio' ? (
                              <Music className="h-6 w-6 text-green-500" />
                            ) : (
                              <FolderOpen className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-xs text-foreground font-medium truncate">
                            {asset.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(asset.file_size)}
                          </div>
                          
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
                                onClick={() => asset.file_url && window.open(asset.file_url, '_blank')}
                              >
                                <Download className="h-3 w-3 text-white" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="text" className="h-full m-0">
                <div className="p-4 space-y-4 h-full flex flex-col">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      onToolSelect?.('text');
                      onAddElement?.({ type: 'text', content: 'Your Text Here' });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-2">
                      {textTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-border rounded-lg p-3 hover:bg-surface-2 cursor-pointer transition-colors"
                          onClick={() => {
                            onToolSelect?.('text');
                            onAddElement?.({ 
                              type: 'text', 
                              content: template.preview,
                              template: template.name,
                              fontSize: template.name.includes('Title') ? 32 : 24,
                              fontWeight: template.name.includes('Title') ? 'bold' : 'normal'
                            });
                          }}
                        >
                          <div className="font-medium text-sm mb-1">{template.name}</div>
                          <div className="text-xs text-muted-foreground bg-surface-2 rounded px-2 py-1">
                            {template.preview}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="shapes" className="h-full m-0">
                <div className="p-4 space-y-4 h-full flex flex-col">
                  <ScrollArea className="flex-1">
                    <div className="grid grid-cols-2 gap-2">
                      {shapes.map((shape) => (
                        <div
                          key={shape.id}
                          className="aspect-square border border-border rounded-lg flex flex-col items-center justify-center hover:bg-surface-2 cursor-pointer transition-colors"
                          onClick={() => {
                            onToolSelect?.(shape.name.toLowerCase());
                            onAddElement?.({ 
                              type: 'shape', 
                              shapeType: shape.name.toLowerCase(),
                              fill: shape.name === 'Rectangle' ? '#3b82f6' : 
                                    shape.name === 'Circle' ? '#ef4444' : 
                                    shape.name === 'Triangle' ? '#10b981' : '#8b5cf6'
                            });
                          }}
                        >
                          <div className="text-2xl mb-1">{shape.icon}</div>
                          <div className="text-xs text-muted-foreground">{shape.name}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="h-full m-0">
                <div className="p-4 space-y-4 h-full flex flex-col">
                  <Button 
                    className="w-full btn-hero"
                    onClick={() => {
                      onAddElement?.({ 
                        type: 'ai-generated', 
                        prompt: 'Generate a creative scene' 
                      });
                      toast({
                        title: "AI Generation Started",
                        description: "Creating AI-generated content...",
                      });
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                  
                  <div className="space-y-3">
                    <div className="border border-border rounded-lg p-3">
                      <div className="font-medium text-sm mb-2">AI Scene Generator</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Create scenes with AI prompts
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          onAddElement?.({ 
                            type: 'ai-scene', 
                            prompt: 'Create a cinematic scene' 
                          });
                          toast({
                            title: "AI Scene Generation",
                            description: "Generating AI scene...",
                          });
                        }}
                      >
                        Try Now
                      </Button>
                    </div>
                    
                    <div className="border border-border rounded-lg p-3">
                      <div className="font-medium text-sm mb-2">Auto Animations</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Smart keyframe generation
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          onAddElement?.({ 
                            type: 'auto-animation',
                            duration: 2000,
                            effect: 'fade-in'
                          });
                          toast({
                            title: "Auto Animation Applied",
                            description: "Smart keyframes generated",
                          });
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
};