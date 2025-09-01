'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Mail, Phone, User, MessageSquare, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function ContactMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: number, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        return;
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));

      // Update selected message if it's the one being viewed
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      read: { color: 'bg-yellow-100 text-yellow-800', label: 'Read' },
      replied: { color: 'bg-green-100 text-green-800', label: 'Replied' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubjectLabel = (subject: string) => {
    const subjectMap: Record<string, string> = {
      'general': 'General Inquiry',
      'residential': 'Residential Dumpster Rental',
      'commercial': 'Commercial Dumpster Rental',
      'pricing': 'Pricing Question',
      'service-area': 'Service Area Question',
      'booking': 'Booking Assistance',
      'complaint': 'Complaint',
      'other': 'Other'
    };
    return subjectMap[subject] || subject;
  };

  // Separate messages into active and archived
  const activeMessages = messages.filter(message => message.status !== 'archived');
  const archivedMessages = messages.filter(message => message.status === 'archived');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AdminSidebar user={user} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription>
                Please sign in to access the contact messages
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AdminSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <main className="flex-1 p-2 sm:p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Contact Messages</h1>
            <div className="text-sm text-gray-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {messages.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No messages yet
                    </div>
                  ) : (
                    <div className="divide-y">
                      {/* Active Messages */}
                      {activeMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">
                              {message.first_name} {message.last_name}
                            </div>
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {getSubjectLabel(message.subject)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(message.created_at)}
                          </div>
                        </div>
                      ))}
                      
                      {/* Archived Messages Section */}
                      {archivedMessages.length > 0 && (
                        <>
                          <div className="p-4 border-t border-gray-200">
                            <button
                              onClick={() => setShowArchived(!showArchived)}
                              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors w-full"
                            >
                              {showArchived ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              Archived Messages ({archivedMessages.length})
                            </button>
                          </div>
                          {showArchived && (
                            <div className="divide-y">
                              {archivedMessages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                  }`}
                                  onClick={() => setSelectedMessage(message)}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium">
                                      {message.first_name} {message.last_name}
                                    </div>
                                    {getStatusBadge(message.status)}
                                  </div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    {getSubjectLabel(message.subject)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(message.created_at)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Message Detail */}
            <div className="lg:col-span-1">
              {selectedMessage ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {selectedMessage.first_name} {selectedMessage.last_name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(selectedMessage.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedMessage.status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                          >
                            Mark as Read
                          </Button>
                        )}
                        {selectedMessage.status === 'read' && (
                          <Button
                            size="sm"
                            onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                          >
                            Mark as Replied
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          <strong>Email:</strong> {selectedMessage.email}
                        </span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Phone:</strong> {selectedMessage.phone}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <strong>Subject:</strong> {getSubjectLabel(selectedMessage.subject)}
                    </div>
                    <div>
                      <strong>Message:</strong>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                      >
                        Reply via Email
                      </Button>
                      {selectedMessage.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${selectedMessage.phone}`)}
                        >
                          Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a message to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}