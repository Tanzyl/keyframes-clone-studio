import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderOpen,
  Image,
  Video,
  Music,
  Type,
  Shapes,
  Sparkles,
  Search,
  Upload,
  Play,
  Plus
} from "lucide-react";

const mediaItems = [
  { id: 1, type: "image", name: "Background 1", duration: null, thumbnail: "/placeholder.svg" },
  { id: 2, type: "video", name: "Intro Clip", duration: "5.2s", thumbnail: "/placeholder.svg" },
  { id: 3, type: "audio", name: "Background Music", duration: "30s", thumbnail: null },
  { id: 4, type: "image", name: "Logo", duration: null, thumbnail: "/placeholder.svg" },
];

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

export const EditorSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-80 bg-surface-1 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="media" className="flex-1 flex flex-col">
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

        <div className="flex-1 overflow-hidden">
          <TabsContent value="media" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
              
              <div className="flex space-x-2">
                <Button size="sm" variant={searchTerm === "" ? "default" : "ghost"} className="flex-1">
                  All
                </Button>
                <Button size="sm" variant="ghost" className="flex-1">
                  <Image className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="flex-1">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="flex-1">
                  <Music className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer border border-border rounded-lg p-2 hover:bg-surface-2 transition-colors"
                    >
                      <div className="aspect-square bg-surface-2 rounded-md mb-2 flex items-center justify-center">
                        {item.type === "image" && <Image className="h-6 w-6 text-muted-foreground" />}
                        {item.type === "video" && <Video className="h-6 w-6 text-muted-foreground" />}
                        {item.type === "audio" && <Music className="h-6 w-6 text-muted-foreground" />}
                      </div>
                      <div className="text-xs text-foreground font-medium truncate">
                        {item.name}
                      </div>
                      {item.duration && (
                        <div className="text-xs text-muted-foreground">
                          {item.duration}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="text" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Text
              </Button>
              
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {textTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-border rounded-lg p-3 hover:bg-surface-2 cursor-pointer transition-colors"
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
              <Button className="w-full btn-hero">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-3">
                  <div className="font-medium text-sm mb-2">AI Scene Generator</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Create scenes with AI prompts
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Try Now
                  </Button>
                </div>
                
                <div className="border border-border rounded-lg p-3">
                  <div className="font-medium text-sm mb-2">Auto Animations</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Smart keyframe generation
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};