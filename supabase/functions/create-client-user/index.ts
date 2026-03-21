import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No autorizado.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: { user: caller } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!caller) {
      return new Response(
        JSON.stringify({ error: 'No autorizado.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (profile?.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Solo administradores pueden crear usuarios cliente.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, password, clientId } = await req.json();
    if (!name || !email || !password || !clientId) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos: name, email, password, clientId.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('client_id', clientId)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Este cliente ya tiene un usuario asociado.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'CLIENT', client_id: clientId },
    });

    if (createError) {
      const msg = createError.message?.includes('already been registered')
        ? 'Ya existe un usuario con ese email.'
        : createError.message;
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: profileError } = await supabase.from('profiles').update({
      client_id: clientId,
      updated_at: new Date().toISOString(),
    }).eq('id', newUser.user.id);

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Error al actualizar perfil: ' + profileError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: fullProfile } = await supabase
      .from('profiles')
      .select('id, name, email, role, client:clients(id, business_name)')
      .eq('id', newUser.user.id)
      .single();

    return new Response(
      JSON.stringify({
        user: {
          id: fullProfile?.id,
          name: fullProfile?.name,
          email: fullProfile?.email ?? newUser.user.email,
          role: 'CLIENT',
          client: fullProfile?.client,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message ?? 'Error interno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
