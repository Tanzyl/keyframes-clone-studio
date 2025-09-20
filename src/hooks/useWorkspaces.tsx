import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

export type Workspace = Tables<'workspaces'>
export type WorkspaceInsert = TablesInsert<'workspaces'>

export const useWorkspaces = () => {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchWorkspaces = async () => {
    if (!user) {
      // Provide demo workspace for unauthenticated users
      const demoWorkspace = {
        id: 'demo-workspace',
        name: 'Demo Workspace',
        description: 'Demo workspace for testing',
        owner_id: 'demo-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setWorkspaces([demoWorkspace as any]);
      setCurrentWorkspace(demoWorkspace as any);
      return;
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setWorkspaces(data || [])
      
      // Set first workspace as current if none selected
      if (data && data.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(data[0])
      }
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

  const createWorkspace = async (name: string, description?: string) => {
    if (!user) return null

    try {
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name,
          description,
          owner_id: user.id,
        })
        .select()
        .single()

      if (workspaceError) throw workspaceError

      // Add user as owner to workspace_members
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        })

      if (memberError) throw memberError
      
      await fetchWorkspaces()
      toast({
        title: "Success",
        description: "Workspace created successfully",
      })
      
      return workspace
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return null
    }
  }

  const updateWorkspace = async (id: string, updates: Partial<WorkspaceInsert>) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      await fetchWorkspaces()
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

  const deleteWorkspace = async (id: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchWorkspaces()
      toast({
        title: "Success",
        description: "Workspace deleted successfully",
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
    fetchWorkspaces()
  }, [user])

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    refetch: fetchWorkspaces,
  }
}