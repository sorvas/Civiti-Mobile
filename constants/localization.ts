export const Localization = {
  // Tab labels
  tabs: {
    issues: 'Probleme',
    create: 'Creează',
    myIssues: 'Ale mele',
    profile: 'Profil',
  },

  // Urgency levels
  urgency: {
    Unspecified: 'Nespecificat',
    Low: 'Scăzută',
    Medium: 'Medie',
    High: 'Ridicată',
    Urgent: 'Urgentă',
  },

  // Issue statuses (internal/full)
  status: {
    Draft: 'Ciornă',
    Submitted: 'Trimisă',
    UnderReview: 'În Evaluare',
    Active: 'Activă',
    Resolved: 'Rezolvată',
    Rejected: 'Respinsă',
    Cancelled: 'Anulată',
  },

  // User-facing simplified statuses
  statusSimple: {
    Active: 'Activ',
    Resolved: 'Rezolvat',
    Rejected: 'Respins',
  },

  // Issue categories
  category: {
    Infrastructure: 'Infrastructură',
    Environment: 'Mediu',
    Transportation: 'Transport',
    PublicServices: 'Servicii Publice',
    Safety: 'Siguranță',
    Other: 'Altele',
  },

  // Error messages
  errors: {
    noConnection: 'Fără conexiune la internet',
    noPermission: 'Nu ai permisiunea necesară',
    notFound: 'Nu a fost găsit',
    tooManyRequests: 'Prea multe cereri. Încearcă mai târziu.',
    generic: 'A apărut o eroare. Încearcă din nou.',
  },

  // CTAs
  actions: {
    sendEmail: 'Trimite Email',
    submitIssue: 'Trimite problema',
    saveDraft: 'Salvează ca ciornă',
    retry: 'Reîncearcă',
    cancel: 'Anulează',
    save: 'Salvează',
    delete: 'Șterge',
    edit: 'Editează',
  },

  // Placeholders
  placeholders: {
    search: 'Caută...',
    email: 'Email',
    password: 'Parolă',
    name: 'Nume',
  },
} as const;
