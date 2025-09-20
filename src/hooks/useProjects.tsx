import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

export type Project = Tables<'projects'>
export type ProjectInsert = TablesInsert<'projects'>

export const useProjects = (workspaceId?: string) => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = async () => {
    if (!user || !workspaceId) {
      // Provide demo project for unauthenticated users
      if (workspaceId === 'demo-workspace') {
        const demoProject = {
          id: 'demo-project',
          name: 'Demo Project',
          description: 'Your first video project',
          workspace_id: 'demo-workspace',
          owner_id: 'demo-user',
          canvas_data: {
            fps: 30,
            layers: [],
            duration: 30000,
            resolution: { width: 1920, height: 1080 }
          },
          timeline_data: {
            tracks: [],
            duration: 30000
          },
          settings: {
            quality: "high",
            autoSave: true
          },
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          thumbnail_url: null
        };
        setProjects([demoProject as any]);
      }
      return;
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (name: string, description?: string) => {
    if (!user || !workspaceId) return null

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          workspace_id: workspaceId,
          owner_id: user.id,
          canvas_data: {
            fps: 30,
            layers: [],
            duration: 10000,
            resolution: { width: 1920, height: 1080 }
          },
          timeline_data: {
            tracks: [],
            duration: 10000
          },
          settings: {
            quality: "high",
            autoSave: true
          }
        })
        .select()
        .single()

      if (error) throw error
      
      await fetchProjects()
      toast({
        title: "Success",
        description: "Project created successfully",
      })
      
      return data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return null
    }
  }

  const updateProject = async (id: string, updates: Partial<ProjectInsert>) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      await fetchProjects()
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return false
    }
  }

  const deleteProject = async (id: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchProjects()
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [user, workspaceId])

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  }
}