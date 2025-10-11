import React from 'react';
import type { Analysis, BilingualText } from '../types';
import AnalysisCard from './AnalysisCard';
import { WhyIcon, HowIcon, WhatIcon, ComponentsIcon, MechanismIcon, BoundariesIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalysisDisplayProps {
  analysis: Analysis;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const { language } = useLanguage();
  const { why, how, what } = analysis;
  
  const renderContent = (content: BilingualText) => {
    const text = content[language];
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
    ));
  }

  return (
    <div className="space-y-8">
      <AnalysisCard title={why.title[language]} icon={<WhyIcon />} delay={0}>
        {renderContent(why.content)}
      </AnalysisCard>
      
      <AnalysisCard title={how.title[language]} icon={<HowIcon />} delay={0.1}>
        {renderContent(how.content)}
      </AnalysisCard>

      <AnalysisCard title={what.title[language]} icon={<WhatIcon />} delay={0.2}>
        <div className="mt-4 space-y-6">
          <SubCard title={what.coreComponents.title[language]} icon={<ComponentsIcon />}>
            {renderContent(what.coreComponents.content)}
          </SubCard>
          <SubCard title={what.operatingMechanism.title[language]} icon={<MechanismIcon />}>
            {renderContent(what.operatingMechanism.content)}
          </SubCard>
          <SubCard title={what.applicationBoundaries.title[language]} icon={<BoundariesIcon />}>
            {renderContent(what.applicationBoundaries.content)}
          </SubCard>
        </div>
      </AnalysisCard>
    </div>
  );
};

interface SubCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const SubCard: React.FC<SubCardProps> = ({ title, icon, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="text-lg font-semibold text-cyan-400 flex items-center mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <div className="text-slate-300 prose prose-invert prose-p:text-slate-300">
            {children}
        </div>
    </div>
);


export default AnalysisDisplay;
