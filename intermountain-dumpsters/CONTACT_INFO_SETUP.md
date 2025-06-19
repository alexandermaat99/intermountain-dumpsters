# Global Contact Information System Setup

This system allows you to manage contact information globally across your application by storing it in Supabase and accessing it through a centralized API.

## Features

- ✅ Centralized contact information management
- ✅ Automatic updates across all pages
- ✅ Fallback to default values if database is unavailable
- ✅ TypeScript support with full type safety
- ✅ Loading states and error handling

## Setup Instructions

### 1. Create the Database Table

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/contact_info_setup.sql
```

Or execute it via the Supabase CLI:

```bash
supabase db push
```

### 2. Environment Variables

Make sure your environment variables are set up in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Usage Examples

#### Basic Usage in Components

```tsx
import { useContactInfo } from '@/lib/hooks/useContactInfo';

function MyComponent() {
  const { contactInfo, loading, error } = useContactInfo();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Phone: {contactInfo.phone}</p>
      <p>Email: {contactInfo.email}</p>
    </div>
  );
}
```

#### Using the ContactInfo Component

```tsx
import ContactInfo from '@/components/ContactInfo';

function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <ContactInfo 
        showBusinessHours={true}
        showEmergency={true}
      />
    </div>
  );
}
```

## Database Schema

The `contact_info` table contains:

- `id`: Primary key
- `phone`: Main phone number
- `email`: Contact email
- `address`: Street address
- `city`: City
- `state`: State
- `zip_code`: ZIP code
- `business_hours`: JSON object with hours for each day
- `emergency_phone`: Emergency contact number
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## API Functions

### `getContactInfo()`
Fetches contact information from the database with fallback to default values.

### `updateContactInfo(contactInfo)`
Updates contact information in the database.

### `useContactInfo()`
React hook that provides:
- `contactInfo`: Current contact data
- `loading`: Loading state
- `error`: Error state
- `refreshContactInfo()`: Function to refresh data

## Benefits

1. **Single Source of Truth**: All contact information is stored in one place
2. **Easy Updates**: Change phone numbers, addresses, etc. in one location
3. **Automatic Propagation**: Updates appear across all pages immediately
4. **Fallback Support**: Default values ensure the app works even if the database is down
5. **Type Safety**: Full TypeScript support prevents errors

## Updating Contact Information

### Option 1: Direct Database Update
Update the `contact_info` table directly in Supabase.

### Option 2: Programmatic Update
```tsx
import { updateContactInfo } from '@/lib/contact-info';

const updated = await updateContactInfo({
  phone: '(801) 555-0124',
  email: 'newemail@example.com'
});
```

## Security Considerations

- The contact information is publicly readable (no authentication required)
- Updates should be restricted to authenticated users
- Consider implementing Row Level Security (RLS) policies in Supabase

## Troubleshooting

### Contact information not loading
1. Check your Supabase environment variables
2. Verify the `contact_info` table exists
3. Check the browser console for errors
4. Ensure the table has at least one row of data

### Updates not saving
1. Check Supabase permissions
2. Verify the user has update permissions
3. Check the browser console for errors

### Type errors
1. Make sure TypeScript is properly configured
2. Check that all imports are correct
3. Verify the interface definitions match your database schema 