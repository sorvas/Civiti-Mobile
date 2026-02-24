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
    back: 'Înapoi',
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
    register: 'Înregistrare',
    forgotPassword: 'Resetare parolă',
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

  // Issue detail
  detail: {
    description: 'Descriere',
    desiredOutcome: 'Rezultat dorit',
    communityImpact: 'Impact asupra comunității',
    authorities: 'Autorități contactate',
    location: 'Locație',
    submittedBy: 'Trimisă de',
    emailsSent: 'Emailuri trimise',
    votes: 'Voturi',
    authoritiesCount: 'Autorități',
    share: 'Distribuie',
    openInMaps: 'Deschide în hărți',
    sendEmail: 'Trimite Email',
    scrollToAuthorities: 'Vezi autoritățile',
    photoAlt: 'Fotografia problemei',
    vote: 'Votează',
    voteRemove: 'Retrage votul',
    voteCount: 'voturi',
  },

  // Comments
  comments: {
    title: 'Comentarii',
    deleted: '[Comentariu șters]',
    reply: 'răspuns',
    replies: 'răspunsuri',
    loadMore: 'Încarcă mai multe',
    sortNewest: 'Cele mai noi',
    sortOldest: 'Cele mai vechi',
    level: 'Niv.',
  },

  // Email campaign
  email: {
    promptTitle: 'Ai trimis emailul?',
    promptYes: 'Da, am trimis',
    promptNo: 'Nu',
    sentSuccess: 'Email confirmat! +10 puncte',
    openFailed: 'Nu s-a putut deschide aplicația de email',
  },

  // Authority
  authority: {
    sendEmail: 'Trimite email',
    noEmail: 'Email indisponibil',
    defaultName: 'Autoritate',
  },

  // Auth
  auth: {
    header: 'Conectează-te pentru a continua',
    googleSignIn: 'Continuă cu Google',
    appleSignIn: 'Continuă cu Apple',
    emailLabel: 'Email',
    passwordLabel: 'Parolă',
    submitButton: 'Autentificare',
    noAccount: 'Nu ai cont?',
    register: 'Înregistrează-te',
    forgotPassword: 'Ai uitat parola?',
    orDivider: 'sau',
    errors: {
      invalidCredentials: 'Email sau parolă incorectă',
      oauthFailed: 'Autentificarea a eșuat. Încearcă din nou.',
      emailRequired: 'Emailul este obligatoriu',
      passwordRequired: 'Parola este obligatorie',
      invalidEmail: 'Adresa de email nu este validă',
    },
    forgotPasswordTitle: 'Resetare parolă',
    forgotPasswordDescription:
      'Introdu adresa de email și îți vom trimite un link de resetare.',
    forgotPasswordSubmit: 'Trimite linkul',
    forgotPasswordSuccess:
      'Verifică-ți emailul! Am trimis un link de resetare a parolei.',
    registerPlaceholder: 'Înregistrarea va fi disponibilă în curând.',
  },

  // Registration flow
  register: {
    header: 'Creează un cont',
    displayNameLabel: 'Nume afișat',
    termsLabel: 'Accept termenii și condițiile',
    submitButton: 'Creează contul',
    hasAccount: 'Ai deja cont?',
    login: 'Conectează-te',
    profileHeader: 'Completează profilul',
    countyLabel: 'Județ',
    cityLabel: 'Oraș',
    districtLabel: 'Sector',
    districtPlaceholder: 'Alege sectorul',
    residenceLabel: 'Tip locuință',
    residenceApartment: 'Apartament',
    residenceHouse: 'Casă',
    residenceBusiness: 'Business',
    notificationsHeader: 'Notificări',
    notifyIssueUpdates: 'Actualizări probleme',
    notifyCommunityNews: 'Știri comunitate',
    notifyMonthlyDigest: 'Rezumat lunar',
    notifyAchievements: 'Realizări',
    finishButton: 'Finalizează',
    skipButton: 'Completează mai târziu',
    defaultCounty: 'București',
    defaultCity: 'București',
    districts: [
      'Sector 1',
      'Sector 2',
      'Sector 3',
      'Sector 4',
      'Sector 5',
      'Sector 6',
    ] as readonly string[],
    termsPromptTitle: 'Termeni și condiții',
    termsPromptBody: 'Pentru a continua, trebuie să accepți termenii și condițiile.',
    termsPromptAccept: 'Accept',
    termsPromptDecline: 'Renunță',
    emailConfirmationSent:
      'Verifică-ți emailul! Am trimis un link de confirmare a contului.',
    errors: {
      displayNameRequired: 'Numele afișat este obligatoriu',
      termsRequired: 'Trebuie să accepți termenii și condițiile',
      passwordTooShort: 'Parola trebuie să aibă cel puțin 6 caractere',
      signUpFailed: 'Înregistrarea a eșuat. Încearcă din nou.',
      emailAlreadyRegistered:
        'Acest email este deja înregistrat. Încearcă să te autentifici.',
      profileFailed: 'Salvarea profilului a eșuat. Încearcă din nou.',
    },
  },

  // Reset password
  resetPassword: {
    header: 'Setează o parolă nouă',
    newPasswordLabel: 'Parolă nouă',
    confirmPasswordLabel: 'Confirmă parola',
    submitButton: 'Schimbă parola',
    success: 'Parola a fost schimbată cu succes!',
    noSession:
      'Nu ai o sesiune activă de resetare. Solicită un nou link.',
    errors: {
      passwordTooShort: 'Parola trebuie să aibă cel puțin 6 caractere',
      passwordsMismatch: 'Parolele nu se potrivesc',
      updateFailed: 'Schimbarea parolei a eșuat. Încearcă din nou.',
      sessionExpired: 'Sesiunea a expirat. Solicită un nou link de resetare.',
    },
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
