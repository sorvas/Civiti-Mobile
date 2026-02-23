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

  // Issue card meta
  issues: {
    votes: 'voturi',
    emails: 'emailuri trimise',
  },

  // Relative time
  timeAgo: {
    now: 'acum',
    minutes: 'min',
    hours: 'h',
    days: 'z',
    weeks: 'săpt',
    months: 'luni',
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
    close: 'Închide',
    delete: 'Șterge',
    edit: 'Editează',
  },

  // State messages
  states: {
    loading: 'Se încarcă...',
    empty: 'Nu sunt rezultate',
    emptyIssues: 'Nu există probleme încă',
    emptyComments: 'Fii primul care comentează',
  },

  // Screen titles
  screens: {
    login: 'Autentificare',
  },

  // Filter sheet
  filter: {
    title: 'Filtrează',
    apply: 'Aplică filtrele',
    reset: 'Resetează',
    categoryLabel: 'Categorie',
    urgencyLabel: 'Urgență',
    statusLabel: 'Status',
    sortLabel: 'Sortare',
    activeFilters: 'filtre active',
  },

  // View toggle
  viewToggle: {
    list: 'Listă',
    map: 'Hartă',
  },

  // Map
  map: {
    noPins: 'Nu sunt probleme de afișat pe hartă',
    webUnavailable: 'Harta nu este disponibilă pe web',
  },

  // Sort options
  sort: {
    newest: 'Cele mai noi',
    oldest: 'Cele mai vechi',
    mostSupported: 'Cele mai susținute',
    mostUrgent: 'Cele mai urgente',
  },

  // Placeholder captions (dev-only, describes which story builds the real screen)
  placeholderCaptions: {
    issues: 'Placeholder — S06 will build the full issues list.',
    create: 'Placeholder — S13 will build the create wizard.',
    myIssues: 'Placeholder — S16 will build the real screen.',
    profile: 'Placeholder — S17 will build the real screen.',
    login: 'Placeholder — S11 will build the login UI.',
  },

  // Placeholders
  placeholders: {
    search: 'Caută...',
    email: 'Email',
    password: 'Parolă',
    name: 'Nume',
  },
} as const;
