import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const STRIPE_PUBLIC_KEY = 'pk_test_51QLmr4C08T73wXPwtzhRkUplF33WWW9GmHxrmtq5ndVYoqnlloivPgh3rPhmcTyr860zS7BZtBidGPO8jvDijgrh00mz3tdTJ1';
export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const createPaymentSession = async (services: any[], propertyId: string, hostStripeAccountId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        services,
        propertyId,
        hostStripeAccountId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`
      }
    });

    if (error) throw error;
    if (!data?.sessionId) throw new Error('Invalid session data');

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');

    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (redirectError) throw redirectError;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const createStripeConnectAccount = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-connect-account', {
      body: {
        return_url: `${window.location.origin}/dashboard/settings`
      }
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Invalid account link data');

    window.location.href = data.url;
  } catch (error) {
    console.error('Stripe Connect error:', error);
    throw error;
  }
};