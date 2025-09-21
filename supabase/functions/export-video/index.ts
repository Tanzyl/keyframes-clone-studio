import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { projectId, exportId, settings, canvasData, timelineData } = await req.json()

    console.log('Starting video export for project:', projectId)
    
    // Update export status to processing
    await supabaseClient
      .from('project_exports')
      .update({ 
        status: 'processing',
        progress: 10
      })
      .eq('id', exportId)

    // Simulate video processing steps
    const steps = [
      { progress: 25, message: 'Analyzing timeline data...' },
      { progress: 50, message: 'Rendering frames...' },
      { progress: 75, message: 'Encoding video...' },
      { progress: 90, message: 'Uploading to storage...' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      await supabaseClient
        .from('project_exports')
        .update({ 
          progress: step.progress,
          status: 'processing'
        })
        .eq('id', exportId)
      
      console.log(step.message, `${step.progress}%`)
    }

    // Generate mock video URL (in real implementation, this would be the actual exported video)
    const fileName = `export_${exportId}.${settings.format}`
    const mockVideoUrl = `https://acttrzylqgiydiypstww.supabase.co/storage/v1/object/public/exported-videos/${fileName}`

    // Update export record with completion
    await supabaseClient
      .from('project_exports')
      .update({
        status: 'completed',
        progress: 100,
        file_url: mockVideoUrl,
        file_size: Math.floor(Math.random() * 50000000) + 5000000, // Mock file size
        completed_at: new Date().toISOString()
      })
      .eq('id', exportId)

    console.log('Video export completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        exportId,
        fileUrl: mockVideoUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Export error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})