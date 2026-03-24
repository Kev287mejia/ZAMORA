/**
 * Configuración de Supabase - Bienes Raíces Zamora
 */
const SUPABASE_URL = 'https://cxsfqpuzzovqjmvtrnqo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JONrWU2YDH3VRv9nlkAZxA_dTq18pkW';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para uso global
window.supabaseClient = _supabase;
