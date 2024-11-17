import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const STRIPE_SECRET_KEY = 'sk_test_51QLmr4C08T73wXPwvsBSFL7DBiFgU1NR9PZNTE8faUjQ8yEGTwdUboloTNS0lTIJ527kMb2Jb0hgsGNG0nr6uUOc003f8Lnwou'
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { return_url } = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    )

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Update user profile with Stripe account ID
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        stripe_account_id: account.id,
        stripe_account_status: 'pending'
      })
      .eq('id', user.id)

    if (updateError) throw updateError

    // Create account link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: return_url,
      return_url: return_url,
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})