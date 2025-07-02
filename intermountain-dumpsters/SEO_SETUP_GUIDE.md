# SEO Setup Guide for Intermountain Dumpsters

This guide will help you complete the SEO optimization for your website to improve your Google ranking.

## Environment Variables Setup

Add these environment variables to your `.env.local` file:

```bash
# Google Analytics 4 (GA4)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Search Console Verification
GOOGLE_SITE_VERIFICATION=your_verification_code_here

# Google Maps API (already configured)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

## Step-by-Step Setup Instructions

### 1. Google Analytics 4 (GA4) Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (starts with G-)
4. Add it to `NEXT_PUBLIC_GA_ID` in your environment variables

### 2. Google Tag Manager Setup

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account and container
3. Get your Container ID (starts with GTM-)
4. Add it to `NEXT_PUBLIC_GTM_ID` in your environment variables

### 3. Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (https://www.intermountaindumpsters.com)
3. Verify ownership (choose HTML tag method)
4. Copy the verification code and add it to `GOOGLE_SITE_VERIFICATION`
5. Submit your sitemap: https://www.intermountaindumpsters.com/sitemap.xml

### 4. Local Business Schema Verification

Your website already has comprehensive local business schema markup. To verify it's working:

1. Go to [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your website URL
3. Check that the LocalBusiness schema is detected
4. Look for any warnings or errors

### 5. Additional SEO Improvements

#### Content Optimization
- Add more location-specific content (Salt Lake City, Provo, Ogden)
- Include customer testimonials and reviews
- Create service-specific pages if needed

#### Technical SEO
- Ensure all images have proper alt text
- Optimize page loading speed
- Make sure mobile responsiveness is perfect

#### Local SEO
- Create/claim Google My Business listing
- Add business to local directories (Yelp, Yellow Pages, etc.)
- Encourage customer reviews on Google

## Current SEO Features Implemented

✅ **Meta Tags**: Comprehensive meta tags for all pages
✅ **Structured Data**: LocalBusiness schema with reviews and ratings
✅ **Breadcrumbs**: Breadcrumb structured data for navigation
✅ **Sitemap**: Enhanced XML sitemap with priorities
✅ **Robots.txt**: Optimized crawling directives
✅ **About Page**: Comprehensive company information page
✅ **Google Analytics**: Ready for GA4 implementation
✅ **Google Tag Manager**: Ready for GTM implementation
✅ **Responsive Design**: Mobile-first design approach
✅ **Open Graph**: Social media sharing optimization
✅ **Twitter Cards**: Twitter sharing optimization

## Monitoring and Maintenance

### Regular Tasks
1. **Weekly**: Check Google Search Console for errors
2. **Monthly**: Review analytics and search performance
3. **Quarterly**: Update content and check for new SEO opportunities

### Key Metrics to Track
- Organic search traffic
- Search rankings for target keywords
- Click-through rates from search results
- Page loading speed
- Mobile usability scores

## Target Keywords

Focus on these local keywords:
- "intermountain dumpsters"
- "dumpster rental salt lake city"
- "dumpster rental utah"
- "construction dumpster rental"
- "residential dumpster rental"
- "commercial dumpster rental"

## Next Steps

1. Set up the environment variables
2. Verify Google Search Console ownership
3. Submit sitemap to Google
4. Monitor performance for 2-4 weeks
5. Make adjustments based on analytics data

## Troubleshooting

### Common Issues
- **Analytics not tracking**: Check if environment variables are set correctly
- **Schema not detected**: Use Google's Rich Results Test to debug
- **Sitemap errors**: Verify sitemap is accessible at /sitemap.xml

### Resources
- [Google Search Console Help](https://support.google.com/webmasters/)
- [Google Analytics Help](https://support.google.com/analytics/)
- [Schema.org Documentation](https://schema.org/)

## Performance Expectations

With these optimizations, you should see:
- Improved search rankings within 2-4 weeks
- Better click-through rates from search results
- Increased organic traffic
- Enhanced local search visibility

Remember: SEO is a long-term strategy. Results typically take 2-6 months to fully materialize. 