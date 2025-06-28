# Admin Authentication System Setup

This guide will help you set up and use the admin authentication system for your Intermountain Dumpsters application.

## Features

- ✅ Secure login with email/password
- ✅ Password reset functionality
- ✅ Session management
- ✅ Protected admin routes
- ✅ Contact information management
- ✅ Pricing configuration
- ✅ Business hours editing

## Setup Instructions

### 1. Environment Variables

Make sure your environment variables are properly configured in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Create Admin User

You can create an admin user through the Supabase dashboard:

#### Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter the admin email and password
5. Set "Email Confirmed" to true

### 3. Database Setup

Ensure your `admin_info` table exists in Supabase with the following structure:

```sql
CREATE TABLE admin_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(255),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(255),
  state VARCHAR(10),
  zip_code VARCHAR(20),
  business_hours JSONB,
  emergency_phone VARCHAR(255),
  price_per_lb DECIMAL(10,2),
  day_rate DECIMAL(10,2),
  cancelation_insurance DECIMAL(10,2),
  driveway_insurance DECIMAL(10,2),
  rush_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Access the Admin Panel

1. Navigate to `/admin` in your application
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

## Admin Dashboard Features

### Contact Information Management
- Update business phone, email, and address
- Modify business hours for each day
- Set emergency contact information

### Pricing Configuration
- Set price per pound for waste disposal
- Configure day rates
- Set insurance fees (cancellation and driveway)
- Configure rush fees

### Security Features
- Password reset via email
- Session management
- Protected routes
- Secure authentication

## Password Reset

If you forget your password:

1. Go to `/admin`
2. Click "Forgot Password?"
3. Enter your email address
4. Check your email for the reset link
5. Click the link to set a new password

## Security Best Practices

1. **Use Strong Passwords**: Choose passwords with at least 8 characters, including uppercase, lowercase, numbers, and special characters.

2. **Enable 2FA**: Consider enabling two-factor authentication for additional security.

3. **Regular Updates**: Keep your dependencies updated regularly.

4. **Monitor Access**: Check your Supabase logs for any suspicious activity.

5. **Backup Data**: Regularly backup your admin configuration data.

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Verify your email and password are correct
   - Check if the user exists in Supabase
   - Ensure the user's email is confirmed

2. **Password reset not working**
   - Check your email spam folder
   - Verify the email address is correct
   - Ensure your Supabase project has email settings configured

3. **Admin page not loading**
   - Check your environment variables
   - Verify your Supabase project is active
   - Check the browser console for errors

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review your Supabase project logs
3. Verify your environment variables are correct
4. Ensure your database tables are properly set up

## API Endpoints

The admin system uses the following Supabase endpoints:

- `POST /auth/v1/token?grant_type=password` - User login
- `POST /auth/v1/logout` - User logout
- `POST /auth/v1/recover` - Password reset
- `PUT /auth/v1/user` - Update user (password)
- `GET /rest/v1/admin_info` - Get admin information
- `POST /rest/v1/admin_info` - Update admin information

## Customization

You can customize the admin system by:

1. **Adding new fields**: Modify the `ContactInfo` interface and database schema
2. **Custom styling**: Update the UI components in the admin pages
3. **Additional features**: Add new admin functionality as needed
4. **Role-based access**: Implement different admin roles if needed

## Support

For additional support or questions about the admin system, please refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth) 