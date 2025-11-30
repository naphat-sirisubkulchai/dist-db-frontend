'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="bg-white border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-3xl text-gray-900">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="py-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              This Privacy Policy explains how Scribe collects, uses, and protects your personal information.
              Scribe is an academic project developed by students at Chulalongkorn University for educational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Account Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Username</li>
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Profile information (bio, optional)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Content You Create</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Blog posts (title, content, tags, cover images)</li>
              <li>Comments and replies</li>
              <li>Likes and interactions</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage statistics and activity logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain the blogging platform</li>
              <li>Authenticate users and secure accounts</li>
              <li>Display your posts and profile to other users</li>
              <li>Send notifications about interactions (likes, comments)</li>
              <li>Improve the platform and user experience</li>
              <li>Demonstrate distributed database concepts for academic purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Storage and Security</h2>
            <p className="leading-relaxed mb-3">
              Your data is stored in a MongoDB database. We implement security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Password encryption using industry-standard algorithms</li>
              <li>JWT-based authentication</li>
              <li>Secure HTTPS connections</li>
              <li>Input validation and sanitization</li>
            </ul>
            <p className="leading-relaxed mt-3 text-yellow-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <strong>Important:</strong> As this is an academic project, we cannot guarantee the same level of security
              as commercial platforms. Do not use sensitive or personal passwords.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Sharing</h2>
            <p className="leading-relaxed mb-3">We do not sell or share your personal information with third parties. However:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your posts and profile are publicly visible to all users</li>
              <li>Your username is displayed with your posts and comments</li>
              <li>Anonymized data may be used for academic analysis and course assignments</li>
              <li>Platform data may be reviewed by course instructors for grading purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use browser local storage to maintain your login session. We use JWT tokens stored in your browser
              to authenticate API requests. No third-party tracking or analytics cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Edit or delete your posts and comments</li>
              <li>Delete your account (contact us)</li>
              <li>Request data export (contact us)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Data Retention</h2>
            <p className="leading-relaxed">
              As an academic project, this platform may be discontinued after the course ends. We do not guarantee
              long-term data retention. Your data may be deleted or reset at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
            <p className="leading-relaxed">
              This platform is intended for use by university students and adults. We do not knowingly collect
              information from children under 13 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. Changes will be posted on this page with an
              updated revision date. Continued use of the platform after changes constitutes acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this privacy policy or want to exercise your rights, contact us at{' '}
              <a href="mailto:6534415723@student.chula.ac.th" className="text-blue-600 hover:underline">
                6534415723@student.chula.ac.th
              </a>
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-gray-900 mb-2">Academic Project Notice</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Course:</strong> 2301463 Distributed Database Systems (Section 1)
              </p>
              <p>
                <strong>Institution:</strong> Chulalongkorn University
              </p>
              <p>
                <strong>Purpose:</strong> Educational demonstration of distributed database concepts
              </p>
              <p className="text-yellow-700 mt-3">
                This platform is for academic purposes only. Do not share sensitive personal information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
