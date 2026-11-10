export interface LegalBullet {
  label?: string;
  text: string;
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: LegalBullet[];
  /** Rendered as clickable links after the bullets (external links open in a new tab). */
  links?: LegalLink[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  eyebrow: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

// ---------------------------------------------------------------------------
// Business details — single source of truth for all legal pages.
// TODO(kyc): add `address` (registered business address) and `gstin` here, then
// restore the "Registered Address" section and the GSTIN line in the contact
// doc below. Razorpay's reviewers look for a physical address on Contact Us.
// ---------------------------------------------------------------------------
export const BUSINESS = {
  legalName: 'Next Jedi',
  proprietor: 'Arunabh Priyadarshi',
  type: 'Sole Proprietorship',
  email: 'arunabh@nextjedi.com',
  hours: 'Monday to Friday, 10:00 AM – 6:00 PM IST',
};

const SOCIAL_TOOL_URL = 'social-share.nextjedi.com';
const GOOGLE_PERMISSIONS_URL = 'https://security.google.com/settings/security/permissions';

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  // Company privacy policy (NEX-1810). Covers nextjedi.com and the internal social publishing
  // tool. Read by Google (YouTube API audit), LinkedIn and Meta reviewers. Each app keeps its
  // own policy at /<slug>/privacy-policy.
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    lastUpdated: 'November 9, 2026',
    intro: `This policy explains what data ${BUSINESS.legalName} collects, why, and how we protect it. It covers our website nextjedi.com and our internal social publishing tool at ${SOCIAL_TOOL_URL}.`,
    sections: [
      {
        heading: '1. Who we are',
        paragraphs: [
          `${BUSINESS.legalName} is a ${BUSINESS.type} based in India. The proprietor is ${BUSINESS.proprietor}.`,
          `${BUSINESS.legalName} is the data fiduciary for the data described here. You can reach us at ${BUSINESS.email}.`,
        ],
      },
      {
        heading: '2. What this policy covers',
        paragraphs: [
          'This policy covers two things: our website, nextjedi.com, and our social publishing tool.',
          'Each of our mobile apps has its own privacy policy. You can find it on that app\'s page on this website.',
        ],
      },
      {
        heading: '3. Our social publishing tool',
        paragraphs: [
          `We run a social publishing tool at ${SOCIAL_TOOL_URL}. It is a self-hosted copy of Postiz, an open-source app.`,
          'The tool is for internal use only. Public sign-up is turned off. Only members of our team can log in.',
          'We use it to write, schedule and publish posts to social media accounts that we own or manage. We do not offer it to anyone else.',
          'The tool can connect to these platforms: YouTube, LinkedIn, Facebook, Instagram, Threads and X.',
        ],
      },
      {
        heading: '4. What data the tool collects',
        paragraphs: [
          'When we connect a social media account, the platform sends us some data. We collect only what the tool needs:',
        ],
        bullets: [
          { label: 'Access tokens.', text: 'These let the tool act for the connected account. They include access tokens and refresh tokens.' },
          { label: 'Profile data.', text: 'The account or channel ID, name, username and profile picture. The email address, if the platform shares it.' },
          { label: 'Our content.', text: 'The posts, videos, images, captions and schedules we create in the tool.' },
          { label: 'Publishing results.', text: 'The ID, link and status of each post we publish.' },
          { label: 'Engagement on our posts.', text: 'Views, likes, comments and other statistics on our own posts, where the platform provides them.' },
          { label: 'Team logins.', text: 'The email address and a hashed password for each team member who uses the tool.' },
        ],
      },
      {
        heading: '5. How we use the data',
        paragraphs: [
          'We use the data only to run the tool for our own accounts. That means we use it to:',
        ],
        bullets: [
          { text: 'Publish and schedule our posts.' },
          { text: 'Show which accounts are connected.' },
          { text: 'Show the status and statistics of our posts.' },
          { text: 'Read and reply to comments on our own posts.' },
        ],
      },
      {
        heading: '6. YouTube API Services',
        paragraphs: [
          'Our tool uses YouTube API Services. By using our tool with YouTube, users agree to be bound by the YouTube Terms of Service. Google\'s Privacy Policy also applies to data handled through YouTube.',
          'With the channel owner\'s permission, the tool can upload videos, edit video details, read channel details, and read video statistics and comments. It does this only for channels we own or manage.',
          'We store the access tokens and channel data on our own server. We do not sell this data or share it with anyone.',
          `You can revoke the tool's access at any time in your Google security settings: ${GOOGLE_PERMISSIONS_URL}. After you revoke access, we delete the data we got from YouTube within 30 days.`,
        ],
        links: [
          { label: 'YouTube Terms of Service', href: 'https://www.youtube.com/t/terms' },
          { label: 'Google Privacy Policy', href: 'https://policies.google.com/privacy' },
          { label: 'Google security settings (revoke access)', href: GOOGLE_PERMISSIONS_URL },
        ],
      },
      {
        heading: '7. LinkedIn',
        paragraphs: [
          'The tool uses the LinkedIn API to publish posts for the LinkedIn accounts we connect. If LinkedIn approves page access, we will also publish to LinkedIn Pages we administer.',
          'From LinkedIn we receive the member ID, name, profile picture, email address and an access token.',
          'We use this data only to publish our own posts and to show which account is connected. We do not collect data about other LinkedIn members. We do not use LinkedIn data for advertising, and we do not sell or share it.',
          'You can remove the tool\'s access in your LinkedIn settings, under Data privacy, then Permitted services.',
        ],
      },
      {
        heading: '8. Meta: Facebook, Instagram and Threads',
        paragraphs: [
          'The tool uses Meta\'s APIs to publish to the Facebook Pages, Instagram accounts and Threads accounts we connect.',
          'From Meta we receive the account or Page ID, name, profile picture and access tokens. For our own posts, we also receive statistics and comments.',
          'We use this data only to publish our posts, show their statistics, and read and reply to comments on them. Comments can include the names and words of other people. We use them only to respond on our own posts.',
          'We do not use Meta data for advertising, and we do not sell or share it.',
          'You can remove the tool\'s access in your Facebook settings, under Business integrations, or in your Instagram settings, under Website permissions.',
        ],
      },
      {
        heading: '9. Where we store data',
        paragraphs: [
          'The tool runs on a computer that we own and control. It is not hosted by a cloud provider. We reach it over HTTPS at ' + SOCIAL_TOOL_URL + '.',
          'Access tokens and account data are stored in the tool\'s database on that computer. Only our team can access it.',
          'We back up the database every night. The backups stay on the same computer, in a folder with restricted access. We keep only the latest 14 backups.',
          'If we start storing media files with a cloud storage provider, we will update this policy first.',
        ],
      },
      {
        heading: '10. We do not sell or share your data',
        paragraphs: [
          'We do not sell any data. We do not share it with advertisers, data brokers or other third parties.',
          'Data in the publishing tool leaves our server only when we publish to a platform. Then it goes to that platform, and only the data needed to publish.',
          'We will disclose data only if the law requires it.',
        ],
      },
      {
        heading: '11. How long we keep data',
        paragraphs: [
          'We keep access tokens and account data while an account is connected.',
          'When an account is disconnected from the tool, or its access is revoked on the platform, we delete its tokens and the data we got from that platform within 30 days. This includes our backups.',
          'Posts that were already published stay on the platform. To remove them, delete them on that platform.',
        ],
      },
      {
        heading: '12. How to remove access or ask for deletion',
        paragraphs: [
          'You can revoke the tool\'s access at any time in the platform\'s own settings, as described above.',
          `You can also email ${BUSINESS.email} to ask us to delete your data. We will delete it within 30 days and confirm by email.`,
        ],
      },
      {
        heading: '13. Our website',
        paragraphs: [
          'nextjedi.com does not use cookies, analytics or advertising trackers. If we add analytics, we will update this policy first.',
          'Some pages have forms: an app waitlist, a beta tester sign-up, an idea box and a support form. If you fill one in, we collect what you type: usually your name, your email address, the app and platform you chose, and your message.',
          'Form entries are stored in a Google Sheet that only our team can open, and Google processes them for us. We use them only to reply to you, add you to the waitlist or tester list you asked for, and improve our apps. We delete them on request, as described in section 12.',
          'Our hosting provider, Vercel, may keep standard server logs, such as IP addresses, for security and reliability.',
          'The social publishing tool sets a login cookie only in the browsers of our own team members.',
        ],
      },
      {
        heading: '14. Security',
        paragraphs: [
          'We use HTTPS for all connections. We limit access to the tool and its data to our team. We keep app secrets out of our code.',
          'No system is perfectly secure. If a breach affects your data, we will tell you and the authorities as the law requires.',
        ],
      },
      {
        heading: '15. Children',
        paragraphs: [
          'Our social publishing tool is not meant for children. We do not knowingly collect data from children.',
        ],
      },
      {
        heading: '16. Your rights (DPDP Act)',
        paragraphs: [
          'Under India\'s Digital Personal Data Protection Act, 2023, you can ask us to:',
        ],
        bullets: [
          { text: 'Tell you what personal data we hold about you and how we use it.' },
          { text: 'Correct or update your data.' },
          { text: 'Delete your data.' },
          { text: 'Withdraw your consent.' },
          { text: 'Nominate a person to act for you.' },
        ],
      },
      {
        heading: '17. Grievance contact',
        paragraphs: [
          `Send any request or complaint to our grievance contact, ${BUSINESS.proprietor}, at ${BUSINESS.email}. We reply within 1 to 2 business days.`,
          'If you are not satisfied with our answer, you can complain to the Data Protection Board of India.',
        ],
        links: [
          { label: `Email the grievance contact: ${BUSINESS.email}`, href: `mailto:${BUSINESS.email}` },
        ],
      },
      {
        heading: '18. Changes to this policy',
        paragraphs: [
          'We may update this policy. When we do, we will change the date at the top of this page.',
        ],
      },
      {
        heading: '19. Contact',
        paragraphs: [
          `Questions about this policy? Email ${BUSINESS.email}.`,
        ],
        links: [
          { label: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
        ],
      },
    ],
  },

  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    eyebrow: 'Legal',
    lastUpdated: 'July 17, 2026',
    intro: `These Terms & Conditions govern your use of the websites, applications, and digital products offered by ${BUSINESS.legalName} ("we", "us", "our"), a ${BUSINESS.type} based in India. By accessing our sites or purchasing our products, you agree to these terms.`,
    sections: [
      {
        heading: '1. About Us',
        paragraphs: [
          `${BUSINESS.legalName} is a ${BUSINESS.type} that builds and sells digital products, including mobile applications and related digital services. You can reach us at ${BUSINESS.email}.`,
        ],
      },
      {
        heading: '2. Products & Services',
        paragraphs: [
          'We offer digital products such as mobile applications, in-app purchases, subscriptions, and related digital services. Product descriptions, features, and prices are shown on the respective product page and are subject to change without prior notice.',
        ],
      },
      {
        heading: '3. Pricing & Payment',
        paragraphs: [
          'All prices are listed in Indian Rupees (₹) unless stated otherwise and are inclusive of applicable taxes unless noted. Payments are processed securely through our payment gateway partner, Razorpay. We do not store your card or banking details on our servers.',
        ],
      },
      {
        heading: '4. Licence to Use',
        paragraphs: [
          'On purchase, you receive a personal, non-exclusive, non-transferable licence to use the product for its intended purpose. You may not resell, redistribute, decompile, or reverse-engineer our products except as permitted by law.',
        ],
      },
      {
        heading: '5. Acceptable Use',
        paragraphs: [
          'You agree not to misuse our products or services, attempt to gain unauthorised access, disrupt the service, or use it for any unlawful purpose.',
        ],
      },
      {
        heading: '6. Intellectual Property',
        paragraphs: [
          `All content, trademarks, logos, and software associated with our products are the property of ${BUSINESS.legalName} and are protected by applicable intellectual property laws.`,
        ],
      },
      {
        heading: '7. Limitation of Liability',
        paragraphs: [
          'Our products are provided on an "as is" basis. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from the use of our products.',
        ],
      },
      {
        heading: '8. Governing Law',
        paragraphs: [
          'These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts located in our registered place of business.',
        ],
      },
      {
        heading: '9. Contact',
        paragraphs: [
          `For any questions about these terms, email us at ${BUSINESS.email}. We respond within 1–2 business days.`,
        ],
      },
    ],
  },

  refund: {
    slug: 'refund',
    title: 'Refund & Cancellation Policy',
    eyebrow: 'Legal',
    lastUpdated: 'July 17, 2026',
    intro: `This policy explains cancellations and refunds for purchases made from ${BUSINESS.legalName}. Because we sell digital products, please read this carefully before purchasing.`,
    sections: [
      {
        heading: '1. Nature of Our Products',
        paragraphs: [
          'We sell digital goods and services (mobile applications, in-app purchases, subscriptions, and digital content). These are delivered electronically and are not physical goods.',
        ],
      },
      {
        heading: '2. Cancellations',
        paragraphs: [
          'You may cancel a recurring subscription at any time from your account or by emailing us. On cancellation, your subscription remains active until the end of the current billing period, and you will not be charged for the next cycle.',
        ],
      },
      {
        heading: '3. Refunds',
        paragraphs: [
          'As our products are digital and delivered immediately, purchases are generally non-refundable once access has been granted. However, we will consider a refund in the following cases:',
        ],
        bullets: [
          { label: 'Duplicate charge', text: '— you were accidentally charged more than once for the same purchase.' },
          { label: 'Non-delivery', text: '— you were charged but did not receive access to the product due to a technical fault on our side.' },
          { label: 'Verified defect', text: '— the product is materially non-functional and we are unable to resolve the issue within a reasonable time.' },
        ],
      },
      {
        heading: '4. How to Request a Refund',
        paragraphs: [
          `Email ${BUSINESS.email} within 7 days of the transaction with your order/payment ID and a description of the issue. We will review and respond within 3 business days.`,
        ],
      },
      {
        heading: '5. Refund Processing Time',
        paragraphs: [
          'Approved refunds are issued to the original payment method via Razorpay and typically reflect in your account within 5–7 business days, depending on your bank or card issuer.',
        ],
      },
      {
        heading: '6. Contact',
        paragraphs: [
          `Questions about a refund or cancellation? Email ${BUSINESS.email} and we will respond within 1–2 business days.`,
        ],
      },
    ],
  },

  shipping: {
    slug: 'shipping',
    title: 'Shipping & Delivery Policy',
    eyebrow: 'Legal',
    lastUpdated: 'July 17, 2026',
    intro: `${BUSINESS.legalName} sells digital products only. This policy explains how our products are delivered.`,
    sections: [
      {
        heading: '1. Digital Delivery',
        paragraphs: [
          'All our products are digital. We do not ship any physical goods, so no shipping charges apply.',
        ],
      },
      {
        heading: '2. How You Receive Your Purchase',
        paragraphs: [
          'Access to paid features, subscriptions, or content is granted electronically and is typically available immediately after a successful payment. Depending on the product, this may be delivered:',
        ],
        bullets: [
          { label: 'In-app', text: '— the purchased feature or content unlocks within the application on the account/device used at purchase.' },
          { label: 'By email', text: '— where applicable, access details or a confirmation are sent to the email address provided at checkout.' },
        ],
      },
      {
        heading: '3. Delivery Timeframe',
        paragraphs: [
          'Digital delivery is usually instant. In rare cases of a processing delay, access is granted within 24 hours of a confirmed payment.',
        ],
      },
      {
        heading: '4. Delivery Issues',
        paragraphs: [
          `If you have paid but not received access, contact us at ${BUSINESS.email} with your payment ID and we will resolve it promptly.`,
        ],
      },
    ],
  },

  contact: {
    slug: 'contact',
    title: 'Contact Us',
    eyebrow: 'Support',
    lastUpdated: 'July 17, 2026',
    intro: `We'd love to hear from you. Reach ${BUSINESS.legalName} through any of the channels below.`,
    sections: [
      {
        heading: 'Email',
        paragraphs: [
          BUSINESS.email,
          'This is our primary support channel. We respond to all queries within 1–2 business days.',
        ],
      },
      {
        heading: 'Support Hours',
        paragraphs: [BUSINESS.hours],
      },
      {
        heading: 'Business Details',
        paragraphs: [
          `${BUSINESS.legalName} — ${BUSINESS.type}`,
          `Proprietor: ${BUSINESS.proprietor}`,
        ],
      },
    ],
  },
};
