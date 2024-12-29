import Image from "next/image";
import SpeechTest from "@/test/SpeechTest";
import VoiceTaskManager from '@/components/VoiceTaskManager';

export default function Home() {
  return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
            Voice-Enabled Task Manager
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A demonstration of voice recognition technology, inspired by my experience at Amazon Alexa.
          </p>
        </section>
        {/* Project Demo Section */}
        <section className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            {/* Project Info */}
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-sm text-blue-700 dark:text-blue-300">
                Next.js
              </span>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-sm text-blue-700 dark:text-blue-300">
                TypeScript
              </span>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-sm text-blue-700 dark:text-blue-300">
                Web Speech API
              </span>
            </div>
      
            {/* VoiceTaskManager */}
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <main className="container mx-auto px-4 py-16">
                <VoiceTaskManager />
              </main>
            </div>
            {/* Speech Test Component */}
            <SpeechTest />

            {/* Instructions */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">How to Use:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Click the &quot;Start Listening&quot; button</li>
                <li>Allow microphone access when prompted</li>
                <li>Speak clearly into your microphone</li>
                <li>Watch your speech appear as text in real-time</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
        <h3 className="font-bold mb-4">Voice Commands:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">List Commands:</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>&quot;Create list [list name]&quot;</li>
              <li>&quot;Open list [list name]&quot;</li>
              <li>&quot;Show list [list name]&quot;</li>
              <li>&quot;List tasks in [list name]&quot;</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Task Commands:</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>&quot;Add task [task description]&quot;</li>
              <li>&quot;Start [task description]&quot;</li>
              <li>&quot;Complete [task description]&quot;</li>
              <li>&quot;Delete [task description]&quot;</li>
              <li>&quot;List all tasks&quot;</li>
            </ul>
          </div>
        </div>
      </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 dark:text-gray-400">
          <p>Built by Fabian Brooks</p>
          <div className="flex justify-center gap-4 mt-4">
            <a 
              href="https://github.com/FabianB14" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/fabian-brooks/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}