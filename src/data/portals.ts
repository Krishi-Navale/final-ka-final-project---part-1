import { PortalItem } from '../types';

export const GLOBAL_PORTALS: PortalItem[] = [
  // --- TOP 7 INDIA GOVERNMENT PORTALS ---
  {
    id: 'in-cybercrime-gov',
    name: 'National Cyber Crime Reporting Portal (NCRP)',
    jurisdiction: 'India',
    country: 'India',
    department: 'Ministry of Home Affairs (MHA), Government of India',
    url: 'https://cybercrime.gov.in',
    verifiedGovDomain: 'cybercrime.gov.in',
    badge: 'Official MHA Central Hub',
    contactHotline: 'Toll-Free Helpline: 1930',
    purpose: 'India\'s official central portal to report all forms of cyber crimes online, with dedicated fast-track reporting for financial fraud, child sexual abuse material (CSAM), and cyber crimes against women. Directly connects to state police units and banks.'
  },
  {
    id: 'in-cert',
    name: 'CERT-In (Indian Computer Emergency Response Team)',
    jurisdiction: 'India',
    country: 'India',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    url: 'https://www.cert-in.org.in',
    verifiedGovDomain: 'cert-in.org.in',
    badge: 'National Security Incident Nodal',
    contactHotline: '+91-1800-11-4949 / incident@cert-in.org.in',
    purpose: 'National nodal agency for responding to cybersecurity incidents including ransomware attacks, data breaches, vulnerability tracking, phishing botnets, and coordinating defensive incident response across Indian cyberspace.'
  },
  {
    id: 'in-chakshu',
    name: 'Chakshu Portal - Sanchar Saathi',
    jurisdiction: 'India',
    country: 'India',
    department: 'Department of Telecommunications (DoT), Ministry of Communications',
    url: 'https://sancharsaathi.gov.in/sancharsaathi/chakshu',
    verifiedGovDomain: 'sancharsaathi.gov.in',
    badge: 'Telecom Fraud & SIM Disconnection',
    contactHotline: 'Integrated with 1930 & DoT Grievance',
    purpose: 'Citizen portal to report suspected fraud communications received via SMS, voice calls, or WhatsApp (such as KYC expiry fake calls, electricity disconnection threats, sextortion, and impersonation of police or customs officials). Enables instant disconnection of scam numbers.'
  },
  {
    id: 'in-cfcrs-1930',
    name: '1930 Citizen Financial Cyber Fraud Helpline (CFCFRS)',
    jurisdiction: 'India',
    country: 'India',
    department: 'Indian Cyber Crime Coordination Centre (I4C), MHA',
    url: 'https://i4c.mha.gov.in',
    verifiedGovDomain: 'i4c.mha.gov.in',
    badge: 'Immediate Banking Fund Freeze',
    contactHotline: 'Dial 1930 (Immediate 2-Hour Golden Window)',
    purpose: 'Real-time financial cyber fraud interdiction system connecting over 250 banks, payment gateways, and wallet operators. Calling 1930 immediately halts stolen money transit and freezes suspect recipient accounts before withdrawal.'
  },
  {
    id: 'in-nciipc',
    name: 'NCIIPC - Critical Information Infrastructure Protection',
    jurisdiction: 'India',
    country: 'India',
    department: 'National Technical Research Organisation (NTRO), Prime Minister\'s Office',
    url: 'https://nciipc.gov.in',
    verifiedGovDomain: 'nciipc.gov.in',
    badge: 'Critical Infrastructure Security',
    contactHotline: '+91-11-2610-8532 / rvdp@nciipc.gov.in',
    purpose: 'Protects critical national sectors including Power, Energy, Banking & Financial, Telecom, Transport, and Government. Accepts vulnerability disclosures and reports on threats impacting critical national infrastructure.'
  },
  {
    id: 'in-sachet-rbi',
    name: 'Sachet Portal by Reserve Bank of India (RBI)',
    jurisdiction: 'India',
    country: 'India',
    department: 'Reserve Bank of India (RBI) with SEBI, IRDAI & PFRDA',
    url: 'https://sachet.rbi.org.in',
    verifiedGovDomain: 'sachet.rbi.org.in',
    badge: 'Unauthorized Financial Scams',
    contactHotline: '14440 (RBI Consumer Education Helpline)',
    purpose: 'Dedicated regulatory platform to report illegal deposit schemes, unregulated micro-finance apps, fraudulent crypto investment traps, and fake loan applications harassing citizens. Jointly monitored by state police and financial regulators.'
  },
  {
    id: 'in-delhi-cyber',
    name: 'Delhi Police Cyber Cell (IFSO / Special Cell)',
    jurisdiction: 'India',
    country: 'India',
    department: 'Intelligence Fusion and Strategic Operations (IFSO), Delhi Police',
    url: 'https://delhipolice.gov.in',
    verifiedGovDomain: 'delhipolice.gov.in',
    badge: 'Advanced Cybercrime Taskforce',
    contactHotline: 'Delhi Cyber Helpline: 1930 / 011-20892622',
    purpose: 'Specialized state cyber wing handling complex cross-border digital crime, high-value cyber syndicates, darknet marketplace operations, SIM swap operations, and deepfake investigations with high-tech forensic labs.'
  },

  // --- GLOBAL GOVERNMENT & INTER-POLICE PORTALS (9 Verified Global Hubs) ---
  {
    id: 'gl-ic3-fbi',
    name: 'IC3 - Internet Crime Complaint Center (FBI)',
    jurisdiction: 'Global',
    country: 'United States',
    department: 'Federal Bureau of Investigation (FBI), US Department of Justice',
    url: 'https://www.ic3.gov',
    verifiedGovDomain: 'ic3.gov',
    badge: 'FBI Central Intake',
    contactHotline: 'Online Intake Portal (IC3.gov)',
    purpose: 'The central hub for reporting cyber-enabled crime to the FBI in the United States. Tracks Business Email Compromise (BEC), ransomware syndicates, intellectual property theft, and international wire fraud conspiracies.'
  },
  {
    id: 'gl-europol-ec3',
    name: 'Europol European Cybercrime Centre (EC3)',
    jurisdiction: 'Global',
    country: 'European Union',
    department: 'European Union Agency for Law Enforcement Cooperation',
    url: 'https://www.europol.europa.eu/about-europol/european-cybercrime-centre-ec3',
    verifiedGovDomain: 'europol.europa.eu',
    badge: 'EU Cross-Border Police Hub',
    contactHotline: 'Reports routed via EU Member National Police Units',
    purpose: 'Coordinates operations against high-level cybercrime networks across all 27 European Union member states, targeting cross-border ransomware cartels, dark web illegal markets, and critical infrastructure attacks.'
  },
  {
    id: 'gl-interpol',
    name: 'INTERPOL Cybercrime Directorate',
    jurisdiction: 'Global',
    country: 'International (196 Member States)',
    department: 'International Criminal Police Organization (INTERPOL HQ, Lyon/Singapore)',
    url: 'https://www.interpol.int/en/Crimes/Cybercrime',
    verifiedGovDomain: 'interpol.int',
    badge: 'Global Police Coordination',
    contactHotline: 'Connects to National Central Bureaus (NCB) Worldwide',
    purpose: 'Facilitates international police intelligence exchange to dismantle transnational cybercrime cartels. Focuses on Africa Cyber Surge, Operation First Light, botnet takedowns, and international fugitive tracking.'
  },
  {
    id: 'gl-action-fraud-uk',
    name: 'Action Fraud UK',
    jurisdiction: 'Global',
    country: 'United Kingdom',
    department: 'City of London Police & National Fraud Intelligence Bureau (NFIB)',
    url: 'https://www.actionfraud.police.uk',
    verifiedGovDomain: 'actionfraud.police.uk',
    badge: 'UK National Reporting Centre',
    contactHotline: '+44 300 123 2040',
    purpose: 'The UK\'s national reporting centre for fraud and cybercrime where individuals and businesses can report scams, online hacking, and identity theft, feeding data directly to the National Fraud Intelligence Bureau.'
  },
  {
    id: 'gl-cafc-rcmp',
    name: 'Canadian Anti-Fraud Centre (CAFC / RCMP)',
    jurisdiction: 'Global',
    country: 'Canada',
    department: 'Royal Canadian Mounted Police (RCMP) & Competition Bureau Canada',
    url: 'https://www.antifraudcentre-centreantifraude.ca',
    verifiedGovDomain: 'antifraudcentre-centreantifraude.ca',
    badge: 'RCMP Federal Repository',
    contactHotline: '1-888-495-8501 (Toll-Free North America)',
    purpose: 'Canada\'s central repository for gathering fraud and cybercrime intelligence. Assists victims of extortion, cryptocurrency investment scams, spoofing, and romance fraud with forensic reporting tools.'
  },
  {
    id: 'gl-acsc-australia',
    name: 'ReportCyber - Australian Cyber Security Centre (ACSC)',
    jurisdiction: 'Global',
    country: 'Australia',
    department: 'Australian Signals Directorate (ASD), Australian Government',
    url: 'https://www.cyber.gov.au/report-and-recover/report',
    verifiedGovDomain: 'cyber.gov.au',
    badge: 'ASD Cyber Defense Agency',
    contactHotline: '1300 CYBER1 (1300 292 371) - 24/7 Hotline',
    purpose: 'Single online reporting portal for cybercrimes and cyber incidents impacting Australian citizens, small businesses, and critical infrastructure, dispatching directly to state police and ASD specialists.'
  },
  {
    id: 'gl-singcert-csa',
    name: 'SingCERT - Cyber Security Agency of Singapore (CSA)',
    jurisdiction: 'Global',
    country: 'Singapore',
    department: 'Cyber Security Agency of Singapore (CSA), Prime Minister\'s Office',
    url: 'https://www.csa.gov.sg/singcert',
    verifiedGovDomain: 'csa.gov.sg',
    badge: 'Singapore National Cyber Hub',
    contactHotline: '+65 6323 5065 / singcert@csa.gov.sg',
    purpose: 'Singapore\'s national computer emergency response team facilitating cybersecurity incident reporting, providing threat advisories, and coordinating malware remediation for citizens and enterprises.'
  },
  {
    id: 'gl-bsi-germany',
    name: 'BSI - Federal Office for Information Security',
    jurisdiction: 'Global',
    country: 'Germany',
    department: 'Bundesamt für Sicherheit in der Informationstechnik (BSI), Germany',
    url: 'https://www.bsi.bund.de',
    verifiedGovDomain: 'bsi.bund.de',
    badge: 'German Federal IT Security',
    contactHotline: '0800 274 1000 (Citizen Service Germany)',
    purpose: 'Germany\'s national cyber security authority that issues consumer protection guidelines, warning reports on zero-day exploits, and coordinates response against advanced digital extortion.'
  },
  {
    id: 'gl-anssi-france',
    name: 'Cybermalveillance.gouv.fr (ANSSI)',
    jurisdiction: 'Global',
    country: 'France',
    department: 'National Cybersecurity Agency of France (ANSSI) & Ministry of the Interior',
    url: 'https://www.cybermalveillance.gouv.fr',
    verifiedGovDomain: 'cybermalveillance.gouv.fr',
    badge: 'French National Assistance Hub',
    contactHotline: 'Official Online Diagnostic & Victim Helpline',
    purpose: 'French government platform assisting victims of cyber attacks, phishing, and ransomware. Connects victims directly to accredited forensic service providers and law enforcement cyber brigades.'
  }
];
