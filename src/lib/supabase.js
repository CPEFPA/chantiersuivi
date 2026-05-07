import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isDev = import.meta.env.DEV

if (!supabaseUrl || !supabaseAnonKey) {
  if (isDev) {
    console.warn('⚠️ Supabase non configuré - mode développement')
  } else {
    console.error('❌ Supabase requis en production')
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
)

export async function uploadChantierPhoto(chantierId, file, location) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase non configuré')
    }

    // Nom de fichier sécurisé
    const safeName = file.name.replace(/[^a-z0-9._-]/gi, '_')
    const fileName = chantierId + '/' + Date.now() + '_' + safeName
    
    const { data, error: uploadError } = await supabase.storage
      .from('photos-chantier')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })
    
    if (uploadError) throw uploadError
    
    const { data: record, error: dbError } = await supabase
      .from('photos')
      .insert({
        chantier_id: chantierId,
        file_path: data.path,
        file_url: data.path,
        latitude: location?.latitude,
        longitude: location?.longitude,
        uploaded_at: new Date().toISOString(),
        file_size: file.size,
        file_type: file.type
      })
      .select()
      .single()
    
    if (dbError) throw dbError
    
    return { success: true, data: record }
  } catch (err) {
    console.error('❌ Upload error:', err)
    return { success: false, error: err.message }
  }
}

export async function getChantierPhotos(chantierId, limit = 20) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) return []
    
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('chantier_id', chantierId)
      .order('uploaded_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.warn('⚠️ Fetch photos error:', error.message)
      return []
    }
    return data
  } catch {
    return []
  }
}

export default supabase