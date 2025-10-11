
import React from 'react';

const iconClass = "h-6 w-6 inline-block";
const subIconClass = "h-5 w-5 inline-block";

export const WhyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const WhatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

export const ComponentsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={subIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

export const MechanismIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={subIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.55-.22a2.25 2.25 0 012.122 0l.55.22c.55.219 1.02.684 1.11 1.226l.099.542a2.25 2.25 0 01-1.07 2.218l-.51.256a2.25 2.25 0 00-1.07 2.218v.542c0 .55.45 1 1 1h.542c.55 0 1.053.219 1.414.586l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586h-.542c-.55 0-1 .45-1 1v.542c0 .55-.219 1.053-.586 1.414l-.293.293a2.25 2.25 0 01-3.182 0l-.293-.293c-.36-.36-.586-.864-.586-1.414v-.542c0-.55-.45-1-1-1h-.542c-.55 0-1.053-.219-1.414-.586l-.293-.293a2.25 2.25 0 010-3.182l.293-.293c.36-.36.864-.586 1.414-.586h.542c.55 0 1-.45 1-1v-.542c0-.55.219-1.053.586-1.414l.293-.293a2.25 2.25 0 013.182 0l.293.293c.36.36.864.586 1.414.586h.542c.55 0 1 .45 1 1v.542c0 .55.219 1.053.586 1.414l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586h-.542c-.55 0-1-.45-1-1v-.542c0-.55-.219-1.053-.586-1.414l-.293-.293a2.25 2.25 0 01-3.182 0l-.293.293c-.36.36-.586.864-.586 1.414v.542c0 .55.45 1 1 1h.542c.55 0 1.053.219 1.414.586l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586h-5.113a2.25 2.25 0 01-2.122-2.122v-5.113c0-.55.219-1.053.586-1.414l.293-.293a2.25 2.25 0 013.182 0l.293.293c.36.36.586.864.586 1.414v.542c0 .55.45 1 1 1h.542c.55 0 1.053.219 1.414.586l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586h-.542c-.55 0-1-.45-1-1v-.542c0-.55-.219-1.053-.586-1.414l-.293-.293a2.25 2.25 0 01-3.182 0l-.293.293c-.36.36-.586.864-.586 1.414v.542c0 .55.45 1 1 1h.542c.55 0 1.053.219 1.414.586l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586H7.878a2.25 2.25 0 01-2.122-2.122V7.878c0-.55.219-1.053.586-1.414l.293-.293a2.25 2.25 0 013.182 0l.293.293c.36.36.586.864.586 1.414v.542c0 .55.45 1 1 1h.542c.55 0 1.053.219 1.414.586l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586h-.542c-.55 0-1-.45-1-1v-.542c0-.55-.219-1.053-.586-1.414l-.293-.293a2.25 2.25 0 01-3.182 0L5.757 9.879a2.25 2.25 0 010-3.182l.293-.293c.36-.36.864-.586 1.414-.586h.542c.55 0 1 .45 1 1v.542c0 .55.219 1.053.586 1.414l.293.293a2.25 2.25 0 010 3.182l-.293.293c-.36.36-.864.586-1.414.586h-.542c-.55 0-1-.45-1-1V9.414a2.25 2.25 0 01.586-1.414l.293-.293a2.25 2.25 0 013.182 0l.51.256a2.25 2.25 0 002.122 0l.51-.256A2.25 2.25 0 0113.657 6.18l.099-.542z" />
    </svg>
);

export const BoundariesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={subIconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);
