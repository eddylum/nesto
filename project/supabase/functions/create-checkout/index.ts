import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0'

const STRIPE_SECRET_KEY = 'sk_test_51QLmr4C08T73wXPwvsBSFL7DBiFgU1NR9PZNTE8faUjQ8yEGTwdUboloTNS0lTIJ527kMb2Jb0hgsGNG0nr6uUOc003f8Lnwou'
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const PLATFORM_FEE_PERCENTAGE = 5

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
    const { services, propertyId, hostStripeAccountId, success_url, cancel_url } = await req.json()

    const totalAmount = services.reduce((sum: number, service: any) => 
      sum + Math.round(service.price * 100), 0)
    
    const applicationFeeAmount = Math.round(totalAmount * (PLATFORM_FEE_PERCENTAGE / 100))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: services.map((service: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: service.name,
            description: service.description,
          },
          unit_amount: Math.round(service.price * 100),
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url,
      cancel_url,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: hostStripeAccountId,
        },
      },
      metadata: {
        propertyId,
        serviceIds: services.map((s: any) => s.id).join(','),
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
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