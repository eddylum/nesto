import { createClient } from '@supabase/supabase-js';
import type { Property, Service, Order } from './supabase-types';

const supabaseUrl = 'https://nlryvsswbbxdatxvpjni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnl2c3N3YmJ4ZGF0eHZwam5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NTkxNDgsImV4cCI6MjA0NzMzNTE0OH0.N0AAWZwkjdzU9zfRRnw0jo7Qm2Wb6GSb6Gv7nbpd37E';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonctions pour gérer les propriétés
export const propertyApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Property[];
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Property[];
  },

  async create(property: Omit<Property, 'id' | 'created_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('properties')
      .insert([{ ...property, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Property;
  }
};

// Fonctions pour gérer les services
export const serviceApi = {
  async getByProperty(propertyId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Service[];
  },

  async create(service: Omit<Service, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();
    
    if (error) throw error;
    return data as Service;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Fonctions pour gérer les commandes
export const orderApi = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        property:properties(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Order & { property: { name: string } })[];
  },

  async create(order: Omit<Order, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data as Order;
  },

  async updateStatus(orderId: string, status: Order['status']) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
  },

  async getById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        property:properties(name)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data as Order & { property: { name: string } };
  }
};