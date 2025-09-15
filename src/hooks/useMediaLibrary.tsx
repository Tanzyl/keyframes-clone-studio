import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export interface MediaFile {
  id: string
  filename: string
  file_path: string
  file_type: string
  file_size: number
  user_id: string
  created_at: string
}

export const useMediaLibrary = () => {
  const { user } = useAuth()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchMediaFiles = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMediaFiles(data || [])
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

  const uploadFile = async (file: File) => {
    if (!user) return null

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      const { data, error } = await supabase
        .from('media_files')
        .insert({
          filename: file.name,
          file_path: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      await fetchMediaFiles()
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
      // Extract file name from path
      const fileName = filePath.split('/').pop()
      
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([`${user.id}/${fileName}`])
        
        if (storageError) throw storageError
      }

      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      await fetchMediaFiles()
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
    fetchMediaFiles()
  }, [user])

  return {
    mediaFiles,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    refetch: fetchMediaFiles,
  }
}