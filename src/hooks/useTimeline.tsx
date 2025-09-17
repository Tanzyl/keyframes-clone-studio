import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

export type TimelineTrack = Tables<'timeline_tracks'>
export type TimelineItem = Tables<'timeline_items'>
export type TimelineTrackInsert = TablesInsert<'timeline_tracks'>
export type TimelineItemInsert = TablesInsert<'timeline_items'>

export const useTimeline = (projectId?: string) => {
  const { user } = useAuth()
  const [tracks, setTracks] = useState<TimelineTrack[]>([])
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTimeline = async () => {
    if (!user || !projectId) return

    setLoading(true)
    try {
      // Fetch tracks
      const { data: tracksData, error: tracksError } = await supabase
        .from('timeline_tracks')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true })

      if (tracksError) throw tracksError

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('timeline_items')
        .select(`
          *,
          media_asset:media_assets(*)
        `)
        .eq('project_id', projectId)
        .order('start_time', { ascending: true })

      if (itemsError) throw itemsError

      setTracks(tracksData || [])
      setItems(itemsData || [])
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

  const createTrack = async (name: string, trackType: string) => {
    if (!user || !projectId) return null

    try {
      const { data, error } = await supabase
        .from('timeline_tracks')
        .insert({
          name,
          track_type: trackType,
          project_id: projectId,
          position: tracks.length,
        })
        .select()
        .single()

      if (error) throw error
      
      await fetchTimeline()
      toast({
        title: "Success",
        description: "Track created successfully",
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

  const updateTrack = async (id: string, updates: Partial<TimelineTrackInsert>) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('timeline_tracks')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      await fetchTimeline()
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

  const deleteTrack = async (id: string) => {
    if (!user) return false

    try {
      // Delete all items in this track first
      await supabase
        .from('timeline_items')
        .delete()
        .eq('track_id', id)

      const { error } = await supabase
        .from('timeline_tracks')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchTimeline()
      toast({
        title: "Success",
        description: "Track deleted successfully",
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

  const createItem = async (trackId: string, data: Partial<TimelineItemInsert>) => {
    if (!user || !projectId) return null

    try {
      const { data: item, error } = await supabase
        .from('timeline_items')
        .insert({
          ...data,
          track_id: trackId,
          project_id: projectId,
        })
        .select()
        .single()

      if (error) throw error
      
      await fetchTimeline()
      toast({
        title: "Success",
        description: "Timeline item created successfully",
      })
      
      return item
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return null
    }
  }

  const updateItem = async (id: string, updates: Partial<TimelineItemInsert>) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('timeline_items')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      await fetchTimeline()
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

  const deleteItem = async (id: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('timeline_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchTimeline()
      toast({
        title: "Success",
        description: "Timeline item deleted successfully",
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
    fetchTimeline()
  }, [user, projectId])

  return {
    tracks,
    items,
    loading,
    createTrack,
    updateTrack,
    deleteTrack,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchTimeline,
  }
}