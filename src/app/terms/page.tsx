'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="bg-white border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-3xl text-gray-900">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="py-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Scribe, you accept and agree to be bound by the terms and provision of this agreement.
              This platform is an academic project developed by students at Chulalongkorn University for educational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Academic Project Notice</h2>
            <p className="leading-relaxed mb-3">
              Scribe is a student project created for the course 2301463 Distributed Database Systems at Chulalongkorn University.
              This platform is intended for educational and demonstration purposes only.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>This is not a commercial service</li>
              <li>No guarantees of uptime or data persistence</li>
              <li>Content may be deleted or reset without notice</li>
              <li>The platform may be discontinued after the course ends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
            <p className="leading-relaxed mb-3">As a user of this platform, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate information during registration</li>
              <li>Keep your password secure and confidential</li>
              <li>Not post illegal, offensive, or harmful content</li>
              <li>Not attempt to hack or disrupt the platform</li>
              <li>Not use automated tools to scrape or abuse the service</li>
              <li>Respect other users and their intellectual property</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Content Guidelines</h2>
            <p className="leading-relaxed mb-3">When posting content on Scribe, you agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Post spam or misleading content</li>
              <li>Upload malicious files or scripts</li>
              <li>Violate copyright or intellectual property rights</li>
              <li>Post personal information of others without consent</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p className="leading-relaxed">
              You retain ownership of the content you post on Scribe. By posting content, you grant Scribe a license to
              display, distribute, and store your content on the platform. The Scribe platform code and design are the
              intellectual property of the development team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              This platform is provided "as is" without any warranties. The developers are not liable for any damages,
              data loss, or issues arising from the use of this platform. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Modifications to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
              Continued use of the platform constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these terms, please contact us at{' '}
              <a href="mailto:6534415723@student.chula.ac.th" className="text-blue-600 hover:underline">
                6534415723@student.chula.ac.th
              </a>
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-gray-900 mb-2">Academic Project</h3>
            <p className="text-sm text-gray-700">
              This platform was developed by students from Chulalongkorn University for 2301463 Distributed Database Systems (Section 1).
              All features are implemented for educational purposes to demonstrate distributed database concepts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
