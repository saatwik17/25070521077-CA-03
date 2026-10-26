import { 
  Laptop, 
  Keyboard, 
  Cpu, 
  CircuitBoard, 
  Server, 
  AppWindow, 
  Briefcase, 
  Code, 
  Cloud, 
  ShieldCheck 
} from 'lucide-react';

export const servicesData = {
  hardware: [
    {
      id: 'laptops-desktops',
      title: 'Laptops & Desktops',
      description: 'Enterprise-grade computing solutions tailored for performance, durability, and business efficiency.',
      price: '₹42,999',
      priceNote: 'Starting price / unit (Bulk discounts available)',
      warranty: '3-Year On-Site OEM Warranty',
      delivery: '2–4 Business Days Delivery',
      icon: Laptop,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.19_PM__1__a2d6fd75.jpeg',
      details: 'We partner with global technology leaders like Dell, HP, Lenovo, and Apple to provide robust computing infrastructure for your workforce. Whether you need lightweight ultrabooks for your mobile sales team, powerful workstations for engineering, or reliable all-in-one desktops for administrative tasks, we ensure every device meets your specific performance benchmarks. Our end-to-end service includes bulk procurement, asset tagging, custom OS image deployment, and complete lifecycle management.',
      features: [
        'Intel Core i7/i9, Xeon & Apple M-Series Processors',
        '16GB–64GB DDR5 RAM & NVMe Gen4 SSD Storage',
        'Authorized Reseller Warranty & Zero-Downtime Support',
        'Bulk Corporate Procurement, Asset Tagging & Leasing',
        'On-site Installation, BIOS Security & Data Migration'
      ]
    },
    {
      id: 'peripherals-accessories',
      title: 'Peripherals & Accessories',
      description: 'Optimizing professional workspaces with high-quality monitors, input devices, and connectivity hubs.',
      price: '₹3,499',
      priceNote: 'Starting price / accessory or bundle',
      warranty: '1–3 Year Replacement Warranty',
      delivery: 'Next-Day Dispatch Available',
      icon: Keyboard,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.19_PM__2__b28918a2.jpeg',
      details: 'A productive workspace requires more than just a computer. We supply the essential ecosystem that drives efficiency—from factory-calibrated 4K IPS and ultrawide curved monitors for multitasking to ergonomic mechanical keyboards and precision wireless mice that reduce strain. We also equip boardrooms with 4K PTZ audio-video conferencing bars, active noise-canceling headsets for hybrid teams, and universal Thunderbolt 4 docking stations.',
      features: [
        '4K UHD, IPS & Ultrawide Curved Business Monitors',
        'Ergonomic Mechanical Keyboards & Precision Wireless Mice',
        'Universal Thunderbolt 4 & Dual-4K USB-C Docking Stations',
        '4K Conference Room Webcams & ANC Headsets',
        'Multi-Monitor Desk Mounts & Power Protection UPS'
      ]
    },
    {
      id: 'custom-builds',
      title: 'Custom Builds',
      description: 'Purpose-built high-performance machines for gaming, 3D rendering, AI training, and specialized industrial tasks.',
      price: '₹95,000',
      priceNote: 'Starting price / custom workstation rig',
      warranty: '3-Year Custom Build & Parts Warranty',
      delivery: '5–7 Days (Includes 72-Hr Stress Test)',
      icon: Cpu,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.20_PM__2__a9662843.jpeg',
      details: 'When off-the-shelf commercial PCs fall short, our Custom Build division engineers bespoke workstations tailored strictly to your workload. This includes whisper-quiet liquid-cooled rigs for CAD/3D rendering, multi-GPU nodes for LLM/AI deep learning training, and high-FPS systems for esports and simulation labs. Every custom build undergoes a rigorous 72-hour thermal and stability burn-in test before handover.',
      features: [
        'NVIDIA RTX 4080/4090 & RTX Ada Workstation GPUs',
        'AMD Threadripper / Ryzen 9 & Intel Core i9 Architectures',
        'Custom AIO & Hardline Liquid Cooling Thermal Loops',
        'Up to 256GB High-Speed DDR5 & ECC Registered Memory',
        '72-Hour Burn-In Stability, Acoustic & Thermal Certification'
      ]
    },
    {
      id: 'electronic-components',
      title: 'Electronic Components',
      description: 'Global sourcing of reliable semiconductors, passives, and electromechanical parts for manufacturing and repair.',
      price: '₹1,999',
      priceNote: 'Starting price / component batch or kit',
      warranty: '100% Genuine OEM Traceability Guarantee',
      delivery: 'Express Global & Domestic Sourcing',
      icon: CircuitBoard,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.20_PM__1__8b5997cc.jpeg',
      details: 'We bridge critical gaps in your electronics supply chain. Whether you need microcontrollers and FPGA chips for IoT device manufacturing, industrial-grade PLC sensors for factory automation lines, or hard-to-find obsolete components to repair mission-critical machinery, our global supplier network ensures timely delivery with full anti-counterfeit inspection and batch traceability.',
      features: [
        'Semiconductors, FPGAs, ICs & ARM Microcontrollers',
        'Industrial IoT Sensors, Relays & Power Modules',
        'Obsolete & Hard-to-Find Legacy Part Procurement',
        'ESD-Safe Packaging, RoHS Compliance & Batch Traceability',
        'Volume BOM Kitting for R&D Labs & EMS Manufacturers'
      ]
    },
    {
      id: 'servers-equipment',
      title: 'Servers & Equipment',
      description: 'Scalable data center infrastructure including rack servers, storage arrays, and enterprise-grade networking.',
      price: '₹1,45,000',
      priceNote: 'Starting price / enterprise server setup',
      warranty: '5-Year Mission-Critical Hardware SLA',
      delivery: 'On-Site Rack Mounting & Configuration',
      icon: Server,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.20_PM_dd66ca71.jpeg',
      details: 'Build a resilient digital backbone for your organization. We provide scalable Dell PowerEdge and HPE ProLiant rack, tower, and blade servers engineered for virtualization, ERP hosting, and high-availability databases. Our networking solutions include 10GbE/40GbE Layer 3 managed switches, enterprise routers, and hardware firewalls from Cisco, Fortinet, and Ubiquiti, complete with structured cabling and server room thermal design.',
      features: [
        'Dual-Socket Xeon / EPYC Rack, Tower & Blade Servers',
        'RAID-Redundant All-Flash NAS & SAN Enterprise Storage',
        'Managed Layer 3 Switches, Routers & Next-Gen Firewalls',
        '42U Server Racks, Online Redundant UPS & PDU Systems',
        'Structured Cat6A/Fiber Optic Cabling & On-Site Setup'
      ]
    }
  ],
  software: [
    {
      id: 'operating-systems',
      title: 'Operating Systems & Office Suites',
      description: 'Licensing and installation for Windows, macOS, Linux, Microsoft Office, Google Workspace, and more.',
      price: '₹4,999',
      priceNote: 'Starting price / license or seat',
      warranty: '100% Genuine OEM / Volume License',
      delivery: 'Instant Digital License & Deployment',
      icon: AppWindow,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.21_PM__1__c2567f7c.jpeg',
      details: 'Ensure your organization stays compliant, secure, and productive with genuine commercial software licensing. We manage Microsoft CSP & Volume Licensing for Windows 11 Pro/Enterprise, Windows Server, and Microsoft 365 suites, deploy Red Hat Enterprise Linux & Ubuntu Server for production workloads, and configure Google Workspace and Apple MDM for seamless cross-platform collaboration.',
      features: [
        'Microsoft 365, Office LTSC & Windows 11 Pro/Enterprise',
        'Windows Server Standard/Datacenter & CAL Licensing',
        'Red Hat Enterprise Linux (RHEL) & Ubuntu Pro Subscriptions',
        'Google Workspace Business & Enterprise Setup',
        'Zero-Touch MDM Deployment & License Audit Compliance'
      ]
    },
    {
      id: 'security-software',
      title: 'Antivirus & Security Software',
      description: 'Robust protection against malware, ransomware, and cyber threats to keep your data safe.',
      price: '₹2,499',
      priceNote: 'Starting price / endpoint / year',
      warranty: '24/7 Threat Monitoring & Updates',
      delivery: 'Same-Day Cloud Console Provisioning',
      icon: ShieldCheck,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.21_PM__2__a6e07d0e.jpeg',
      details: 'In an era of sophisticated cyber threats, reactive antivirus is no longer enough. We deploy multi-layered enterprise cybersecurity including AI-driven Endpoint Detection and Response (EDR), zero-trust network access, Data Loss Prevention (DLP), and email anti-phishing gateways. Partnering with Bitdefender GravityZone, Sophos Intercept X, CrowdStrike, and Kaspersky Enterprise to lock down your intellectual property.',
      features: [
        'Next-Gen Endpoint Detection & Response (EDR / XDR)',
        'Real-Time Ransomware Rollback & Zero-Day Protection',
        'Centralized Cloud Security Management Console',
        'Data Loss Prevention (DLP) & Device Port Control',
        'Email Anti-Phishing, VPN & Vulnerability Patching'
      ]
    },
    {
      id: 'business-management',
      title: 'Business Management Software',
      description: 'CRM, ERP, accounting software, and project management tools to streamline your business processes.',
      price: '₹18,500',
      priceNote: 'Starting price / implementation package',
      warranty: '1-Year Free Configuration Support',
      delivery: '3–10 Days Custom Workflow Setup',
      icon: Briefcase,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.22_PM_ae5272bc.jpeg',
      details: 'Digitalize and automate your core operations from lead capture to balance sheet. We consult, license, customize, and integrate industry-leading business software including TallyPrime Server, Zoho One, Salesforce CRM, QuickBooks, and SAP Business One. Our specialists migrate your historical financial and inventory records and train your staff for smooth adoption.',
      features: [
        'ERP Implementation, Inventory & Supply Chain Tracking',
        'Custom CRM Pipelines (Salesforce, Zoho, HubSpot)',
        'GST-Compliant Accounting, Billing & E-Invoicing (TallyPrime)',
        'HRMS, Biometric Attendance & Automated Payroll',
        'Cross-Department Data Sync & Executive Dashboards'
      ]
    },
    {
      id: 'custom-development',
      title: 'Custom Software Development',
      description: 'Bespoke software tailored to your unique business requirements, from web applications to specialized tools.',
      price: '₹49,999',
      priceNote: 'Starting price / custom project or MVP',
      warranty: '6-Month Post-Launch Support & SLA',
      delivery: 'Agile Sprint Milestones (2–8 Weeks)',
      icon: Code,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.22_PM__1__1cea2d6e.jpeg',
      details: 'Your business workflows are unique, and off-the-shelf software does not always fit. Our full-stack engineering team designs and builds high-performance web portals, iOS/Android mobile apps, internal admin dashboards, and automated API integrations using React, Next.js, Node.js, Python, and MongoDB/PostgreSQL. We cover architecture, UI/UX design, QA testing, and cloud deployment.',
      features: [
        'Full-Stack Web Applications & Progressive Web Apps (PWA)',
        'Native & Cross-Platform iOS / Android Mobile Apps',
        'Custom REST / GraphQL APIs & Third-Party Integrations',
        'Interactive UI/UX Wireframing & Design Systems',
        'Automated QA Testing, CI/CD & Dedicated Maintenance'
      ]
    },
    {
      id: 'cloud-solutions',
      title: 'Cloud Solutions',
      description: 'Setup and management of cloud-based services for storage, collaboration, and application hosting.',
      price: '₹14,999',
      priceNote: 'Starting price / cloud setup & migration',
      warranty: '99.99% Uptime Architecture Design',
      delivery: 'Zero-Downtime Migration Execution',
      icon: Cloud,
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.21_PM__3__6255d572.jpeg',
      details: 'Scale effortlessly and cut infrastructure overhead by transitioning to the cloud. Our certified cloud architects assess your on-premise servers and execute zero-downtime migrations to AWS, Microsoft Azure, or Google Cloud Platform. We configure auto-scaling Kubernetes/Docker clusters, encrypted off-site backups, disaster recovery failovers, and FinOps cost optimization.',
      features: [
        'AWS, Microsoft Azure & Google Cloud (GCP) Architecture',
        'Zero-Downtime Server, Database & Email Cloud Migration',
        'Automated Encrypted Cloud Backups & Disaster Recovery',
        'Docker, Kubernetes & CI/CD DevOps Pipeline Setup',
        '24/7 Cloud Health Monitoring & Monthly FinOps Cost Audits'
      ]
    }
  ]
};