import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export interface Project {
  id: string
  title: string
  description: string | null
  data: any
  user_id: string
  created_at: string
  updated_at: string
}

export const useProjects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
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

  const createProject = async (title: string, description?: string) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          data: { layers: [], duration: 30 },
          user_id: user.id,
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

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

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
        .eq('user_id', user.id)

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
  }, [user])

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  }
}