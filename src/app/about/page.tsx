'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="bg-white border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-3xl text-gray-900">About This Project</CardTitle>
        </CardHeader>
        <CardContent className="py-8 space-y-8">
          {/* Project Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scribe - A Modern Blogging Platform</h2>
            <p className="text-gray-700 leading-relaxed">
              Scribe is a Medium-inspired blogging platform built with modern web technologies and distributed database systems.
              This platform demonstrates real-time notifications, file uploads, authentication, and a clean, responsive user interface.
            </p>
          </section>

          {/* Technology Stack */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Frontend</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Next.js 16.0.3 with Turbopack</li>
                  <li>• React with TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• WebSocket for real-time updates</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Backend</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Elysia.js with Bun runtime</li>
                  <li>• MongoDB with Mongoose ODM</li>
                  <li>• JWT Authentication</li>
                  <li>• RESTful API with Swagger docs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Development Team */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Development Team</h2>
            <p className="text-gray-700 mb-4">
              This project was developed by Computer Engineering students from Chulalongkorn University
              as part of the Distributed Database Systems course.
            </p>

            <div className="space-y-3">
              {[
                { id: '6534415723', name: 'Chitsanucha Limpalasuk', role: 'Software Developer' },
                { id: '6534418623', name: 'Naphat Sirisubkulchai', role: 'Software Developer' },
                { id: '6534441023', name: 'Phongsakorn Phimphongphaisan', role: 'Software Developer' },
              ].map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-gray-300 transition"
                >
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                  <div className="text-sm font-mono text-gray-500">{member.id}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Course Information */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Course Information</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-medium">Course Code:</span>
                <span>2301463</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Course Name:</span>
                <span>Distributed Database Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Section:</span>
                <span>1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Institution:</span>
                <span>Chulalongkorn University</span>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'User authentication & authorization',
                'Create, read, update, delete posts',
                'Image upload for cover photos',
                'Real-time notifications via WebSocket',
                'Comment and reply system',
                'Like posts and comments',
                'Tag-based post organization',
                'Responsive, Medium-inspired UI',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
