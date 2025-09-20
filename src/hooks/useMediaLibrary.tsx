import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

export type MediaAsset = Tables<'media_assets'>
export type MediaAssetInsert = TablesInsert<'media_assets'>

export const useMediaLibrary = (workspaceId?: string) => {
  const { user } = useAuth()
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchMediaAssets = async () => {
    if (!user || !workspaceId) {
      // Provide demo media assets for unauthenticated users
      if (workspaceId === 'demo-workspace') {
        setMediaAssets([]);
      }
      return;
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMediaAssets(data || [])
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

  const uploadFile = async (file: File, projectId?: string) => {
    if (!user || !workspaceId) return null

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${workspaceId}/${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('media-assets')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('media-assets')
        .getPublicUrl(fileName)

      // Determine media type
      let mediaType: 'image' | 'video' | 'audio' | 'font' | 'element' | 'transition' | 'sticker' = 'element'
      if (file.type.startsWith('image/')) mediaType = 'image'
      else if (file.type.startsWith('video/')) mediaType = 'video'
      else if (file.type.startsWith('audio/')) mediaType = 'audio'

      const { data, error } = await supabase
        .from('media_assets')
        .insert({
          name: file.name.split('.')[0],
          original_name: file.name,
          file_path: fileName,
          file_url: urlData.publicUrl,
          mime_type: file.type,
          file_size: file.size,
          media_type: mediaType,
          workspace_id: workspaceId,
          project_id: projectId || null,
          uploaded_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      await fetchMediaAssets()
      toast({
        title: "Success",
        description: "File uploaded successfully",
      })

      return data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (id: string, filePath: string) => {
    if (!user) return false

    try {
      const { error: storageError } = await supabase.storage
        .from('media-assets')
        .remove([filePath])
      
      if (storageError) throw storageError

      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchMediaAssets()
      toast({
        title: "Success",
        description: "File deleted successfully",
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
    fetchMediaAssets()
  }, [user, workspaceId])

  return {
    mediaAssets,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    refetch: fetchMediaAssets,
  }
}