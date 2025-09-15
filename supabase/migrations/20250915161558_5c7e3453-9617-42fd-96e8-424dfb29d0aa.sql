-- Create comprehensive schema for KeyFrames video editor

-- Create enum for project status
CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');

-- Create enum for media types
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'font', 'element', 'transition', 'sticker');

-- Create enum for workspace roles
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- Workspaces table
CREATE TABLE public.workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workspace members table
CREATE TABLE public.workspace_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role workspace_role NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

-- Projects table (enhanced)
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  canvas_data JSONB DEFAULT '{"layers": [], "duration": 10000, "fps": 30, "resolution": {"width": 1920, "height": 1080}}',
  timeline_data JSONB DEFAULT '{"tracks": [], "duration": 10000}',
  settings JSONB DEFAULT '{"autoSave": true, "quality": "high"}',
  status project_status DEFAULT 'draft',
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Media assets table
CREATE TABLE public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  media_type media_type NOT NULL,
  duration INTEGER, -- for video/audio in milliseconds
  dimensions JSONB, -- {"width": 1920, "height": 1080}
  metadata JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  is_brand_asset BOOLEAN DEFAULT false,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Timeline tracks table
CREATE TABLE public.timeline_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  track_type TEXT NOT NULL, -- 'video', 'audio', 'text', 'effect'
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  height INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Timeline items/clips table
CREATE TABLE public.timeline_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.timeline_tracks(id) ON DELETE CASCADE,
  media_asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  start_time INTEGER NOT NULL, -- milliseconds
  end_time INTEGER NOT NULL, -- milliseconds
  duration INTEGER NOT NULL, -- milliseconds
  properties JSONB DEFAULT '{}', -- transforms, effects, etc.
  layer_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project exports/renders table
CREATE TABLE public.project_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  export_settings JSONB NOT NULL, -- format, resolution, quality, etc.
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  progress INTEGER DEFAULT 0,
  file_url TEXT,
  file_size INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_by UUID NOT NULL
);

-- Project templates table
CREATE TABLE public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  template_data JSONB NOT NULL,
  category TEXT,
  is_public BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

-- Workspaces policies
CREATE POLICY "Users can view workspaces they're members of"
ON public.workspaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = workspaces.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners and admins can update"
ON public.workspaces FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = workspaces.id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Workspace owners can delete"
ON public.workspaces FOR DELETE
USING (owner_id = auth.uid());

-- Workspace members policies
CREATE POLICY "Users can view workspace members of workspaces they belong to"
ON public.workspace_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm2
    WHERE wm2.workspace_id = workspace_members.workspace_id 
    AND wm2.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace owners and admins can manage members"
ON public.workspace_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm
    JOIN public.workspaces w ON w.id = wm.workspace_id
    WHERE wm.workspace_id = workspace_members.workspace_id 
    AND wm.user_id = auth.uid() 
    AND (wm.role IN ('owner', 'admin') OR w.owner_id = auth.uid())
  )
);

-- Projects policies
CREATE POLICY "Users can view projects in their workspaces"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = projects.workspace_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Workspace members can create projects"
ON public.projects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = projects.workspace_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
  AND auth.uid() = owner_id
);

CREATE POLICY "Project owners and workspace admins can update projects"
ON public.projects FOR UPDATE
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = projects.workspace_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Project owners and workspace owners can delete projects"
ON public.projects FOR DELETE
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.workspaces 
    WHERE id = projects.workspace_id AND owner_id = auth.uid()
  )
);

-- Media assets policies
CREATE POLICY "Users can view media assets in their workspaces"
ON public.media_assets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = media_assets.workspace_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Workspace members can upload media assets"
ON public.media_assets FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = media_assets.workspace_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
  AND auth.uid() = uploaded_by
);

CREATE POLICY "Asset uploaders and workspace admins can update media assets"
ON public.media_assets FOR UPDATE
USING (
  uploaded_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = media_assets.workspace_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Asset uploaders and workspace owners can delete media assets"
ON public.media_assets FOR DELETE
USING (
  uploaded_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.workspaces 
    WHERE id = media_assets.workspace_id AND owner_id = auth.uid()
  )
);

-- Timeline tracks policies
CREATE POLICY "Users can manage timeline tracks for accessible projects"
ON public.timeline_tracks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = timeline_tracks.project_id 
    AND wm.user_id = auth.uid()
    AND wm.role IN ('owner', 'admin', 'editor')
  )
);

-- Timeline items policies  
CREATE POLICY "Users can manage timeline items for accessible projects"
ON public.timeline_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = timeline_items.project_id 
    AND wm.user_id = auth.uid()
    AND wm.role IN ('owner', 'admin', 'editor')
  )
);

-- Project exports policies
CREATE POLICY "Users can view exports for accessible projects"
ON public.project_exports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = project_exports.project_id AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create exports for editable projects"
ON public.project_exports FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = project_exports.project_id 
    AND wm.user_id = auth.uid()
    AND wm.role IN ('owner', 'admin', 'editor')
  )
  AND auth.uid() = created_by
);

-- Project templates policies
CREATE POLICY "Users can view public templates or their own"
ON public.project_templates FOR SELECT
USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create templates"
ON public.project_templates FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates"
ON public.project_templates FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates"
ON public.project_templates FOR DELETE
USING (created_by = auth.uid());

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) VALUES 
('media-assets', 'media-assets', true),
('project-thumbnails', 'project-thumbnails', true),
('exported-videos', 'exported-videos', true);

-- Storage policies for media assets
CREATE POLICY "Users can upload to media-assets bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view media-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'media-assets');

CREATE POLICY "Users can update their own media assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own media assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for project thumbnails
CREATE POLICY "Users can upload project thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-thumbnails' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view project thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Users can update their own project thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-thumbnails' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for exported videos
CREATE POLICY "Users can upload exported videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exported-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their exported videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exported-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX idx_projects_workspace_id ON public.projects(workspace_id);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_media_assets_workspace_id ON public.media_assets(workspace_id);
CREATE INDEX idx_media_assets_project_id ON public.media_assets(project_id);
CREATE INDEX idx_timeline_tracks_project_id ON public.timeline_tracks(project_id);
CREATE INDEX idx_timeline_items_project_id ON public.timeline_items(project_id);
CREATE INDEX idx_timeline_items_track_id ON public.timeline_items(track_id);
CREATE INDEX idx_project_exports_project_id ON public.project_exports(project_id);