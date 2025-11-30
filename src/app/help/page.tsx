'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Help</h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            Have questions or need assistance? Contact us directly via email.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-gray-900 text-2xl">Contact Information</CardTitle>
            <CardDescription className="text-gray-700">Reach out to us directly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg mb-1">Email</div>
                <a
                  href="mailto:6534415723@student.chula.ac.th"
                  className="text-blue-600 hover:underline text-lg"
                >
                  6534415723@student.chula.ac.th
                </a>
                <p className="text-gray-600 text-sm mt-1">We typically respond within 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg mb-1">Institution</div>
                <div className="text-gray-700">Chulalongkorn University</div>
                <div className="text-gray-600 text-sm">Faculty of Engineering</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg mb-1">Course</div>
                <div className="text-gray-700">2301463 Distributed Database Systems</div>
                <div className="text-gray-600 text-sm">Section 1</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I create a post?</h3>
              <p className="text-gray-600">Click the "Write" button in the navigation bar to create a new post. You can add a title, content, tags, and an optional cover image.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I upload a cover image?</h3>
              <p className="text-gray-600">When creating a post, you can either upload an image file (up to 5MB) or paste an image URL.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do notifications work?</h3>
              <p className="text-gray-600">You'll receive notifications when someone likes your post, comments on your post, or replies to your comment. Check the notification bell in the top navigation.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I edit or delete my posts?</h3>
              <p className="text-gray-600">Navigate to your post's detail page and use the edit or delete buttons available for your own posts.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
