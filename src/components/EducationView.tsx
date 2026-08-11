import React, { useState } from 'react';
import { EDUCATION_TOPICS, FAQ_ITEMS } from '../data/faraidEducation';
import { BookOpen, Search, HelpCircle, Scale, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const EducationView: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>(EDUCATION_TOPICS[0].id);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const activeTopic = EDUCATION_TOPICS.find(t => t.id === activeTopicId) || EDUCATION_TOPICS[0];

  const filteredTopics = EDUCATION_TOPICS.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/20 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Edukasi & Fiqih Mawarith</span>
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
          Akademi Pembagian Waris Islam (Faraid)
        </h1>

        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Pelajari konsep dasar, rukun, syarat, Ashabul Furudh, Ashabah, Aul, Radd, dan aturan Kompilasi Hukum Islam (KHI) secara mudah dan terstruktur.
        </p>
      </div>

      {/* Main Grid: Topic Navigation & Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Topics Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari materi Faraid..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            {filteredTopics.map((topic) => {
              const isActive = topic.id === activeTopicId;

              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    isActive 
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-md shadow-emerald-700/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                    {topic.category}
                  </span>
                  <div className="font-heading font-bold text-sm">
                    {topic.title}
                  </div>
                  <p className={`text-xs line-clamp-2 mt-1 ${isActive ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {topic.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Article Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {activeTopic.category}
              </span>
              <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-white mt-1">
                {activeTopic.title}
              </h2>
            </div>

            {/* Arabic Quranic Quote if present */}
            {activeTopic.arabicVerse && (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 text-center">
                <p className="font-arabic text-2xl text-emerald-900 dark:text-amber-300 leading-loose">
                  {activeTopic.arabicVerse}
                </p>
                <p className="text-xs italic text-slate-700 dark:text-slate-300">
                  "{activeTopic.translation}"
                </p>
              </div>
            )}

            {/* Markdown Body */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
              {activeTopic.contentMarkdown.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-4 mb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={idx} className="text-slate-700 dark:text-slate-300">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>Tanya Jawab Sering Diajukan (FAQ)</span>
            </h3>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;

                return (
                  <div key={index} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>{faq.q}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
