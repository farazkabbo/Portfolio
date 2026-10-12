// ============================================================================
//  ALL PORTFOLIO CONTENT LIVES HERE.
//  Edit this file to change text, links, projects, dialog lines, etc.
//  Nothing else needs to be touched for content updates.
// ============================================================================

export const profile = {
    name: 'Mohammed Faraz Kabbo',
    shortName: 'Faraz',
    title: 'AI Engineer & Software Developer',
    tagline: 'AI engineer · co-founder of Clarus · CS at York University',
    location: 'Toronto, Ontario, Canada',
    email: 'kabbofaraz@gmail.com',
    resumePdf: './images/Mohammed_Faraz_Kabbo_Resume.pdf',
    photo: './images/faraz.jpg',
    summary:
        'Computer Science student at York University who ships production AI: LLM-powered RAG ' +
        'applications, agentic workflows and the data pipelines behind them. Two co-op terms with the ' +
        'Ontario Government, co-founder of the AI workflow startup Clarus, and a habit of winning hackathons.',
    about:
        'I work mostly in Python and TypeScript, and I like problems where data, algorithms and real ' +
        'users meet. Away from the keyboard I draw — digital paintings, characters and the occasional ' +
        'football poster. The little guy walking around this site is my own character.',
    socials: [
        { id: 'github', label: 'GitHub', url: 'https://github.com/farazkabbo' },
        { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/mohammed-faraz-kabbo/' },
        { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/channel/UCnhfV-TI5CosdvQPdabyP1A' },
        { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/mewdiegamer/' },
    ],
};

export const experience = [
    {
        role: 'AI Engineer, Co-op',
        org: 'Ontario Government — Ministry of Public and Business Service Delivery & Procurement',
        date: 'May 2026 – Aug 2026',
        points: [
            'Shipped a production LLM-powered RAG application grounding answers in 20 curriculum documents, building semantic chunking, embeddings and top-k vector search in Pinecone with LangChain.',
            'Cut inference latency 35% by tuning chunk size, caching embeddings and iterating on prototype quality and reliability.',
            'Reduced hallucination with prompt engineering that constrained generation to retrieved context, measured by transcript review and failure categorisation.',
        ],
        tags: ['LLM', 'RAG', 'Pinecone', 'LangChain'],
    },
    {
        role: 'Software Developer Engineer, Co-op',
        org: 'Ontario Government — Ministry of Public and Business Service Delivery & Procurement',
        date: 'Sep 2025 – May 2026',
        points: [
            'Consolidated 30 datasets from 20 enterprise systems into the data layer behind AI applications, building Python data pipelines and REST APIs.',
            'Cut incident response time 33% by deploying to AWS with Docker and CI/CD and building monitoring and alerting.',
        ],
        tags: ['Python', 'REST APIs', 'AWS', 'Docker', 'CI/CD'],
    },
    {
        role: 'Co-Founder & Software Developer',
        org: 'Clarus — AI Workflow Automation Startup',
        date: 'Mar 2026 – Present',
        points: [
            'Won Hack Canada 2026 and secured startup funding through NSU Cohort 4, shipping an AI agent that automates a workflow across five enterprise systems.',
            'Eliminated manual handoffs in the automated workflow with a Python agentic architecture: runtime tool selection and conditional branching on FastAPI.',
            'Made 100% of agent actions auditable by extracting structured data from unstructured documents and instrumenting per-run audit trails.',
        ],
        tags: ['AI Agents', 'FastAPI', 'Python', 'Startup'],
    },
    {
        role: 'Engineering Researcher',
        org: 'k2i Academy',
        date: 'May 2025 – Aug 2025',
        points: [
            'Mentored high school students in software engineering and AI.',
            'Led workshops with Micro:bit, Cutebot and HuskyLens AI.',
        ],
        tags: ['Education', 'AI', 'Mentorship'],
    },
    {
        role: 'Co-Founder & Developer',
        org: 'FashionX',
        date: 'Oct 2024 – Feb 2025',
        points: ['Developed an AI recommendation engine using TensorFlow and OpenAI CLIP and led the technical implementation.'],
        tags: ['AI Development', 'Co-Founder'],
    },
];

export const education = [
    {
        title: 'B.Sc. (Hons.) Computer Science',
        org: 'York University — Lassonde School of Engineering',
        date: 'Jan 2023 – May 2027',
        note: 'Lassonde Entrance Scholarship.',
    },
];

export const certificates = [
    { title: 'Data Analysis', org: 'Google', image: './images/card-3.png' },
    { title: 'SQL for Data Science', org: 'IBM', image: './images/SQL for Data Science.PNG' },
    { title: 'Git and GitHub', org: 'IBM', image: './images/git.jpg' },
];

export const achievements = [
    { title: 'Hack Canada 2026', detail: 'Winner with Clarus, plus startup funding through NSU Cohort 4.' },
    { title: 'Hack the Valley 2025', detail: 'Winner with Mimicoo.' },
    { title: 'SpurHacks 2025', detail: '3rd place with Vroomi.' },
    { title: 'Meta Hacker Cup 2024', detail: 'Advanced to Round 2 — top 1% of roughly 35,000 competitors.' },
    { title: 'Lassonde Entrance Scholarship', detail: 'York University.' },
];

export const skills = [
    { group: 'AI & LLM', items: ['Generative AI', 'LLMs', 'RAG', 'AI agents', 'Agentic architectures', 'Tool use', 'Prompt engineering', 'Evaluation frameworks', 'LangChain'] },
    { group: 'Vector & data', items: ['Pinecone', 'pgvector', 'Embeddings', 'Semantic & hybrid search', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL'] },
    { group: 'Software engineering', items: ['Python', 'TypeScript', 'FastAPI', 'React', 'Next.js', 'Node.js', 'Java', 'C#', 'Testing', 'Git'] },
    { group: 'Cloud & deployment', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring & observability'] },
];

// `featured: true` projects also show up as "save files" on the game console.
// `image: null` gets a generated pixel-art cover. `kind` picks the cover style.
export const projects = [
    {
        id: 'clarus',
        name: 'Clarus',
        badge: 'Hack Canada 2026 — Winner',
        desc: 'An AI agent that automates a workflow across five enterprise systems, with runtime tool selection, conditional branching and a full audit trail for every run. Now a funded startup.',
        tech: ['Python', 'FastAPI', 'AI agents', 'Audit trails'],
        image: null,
        kind: 'agent',
        link: 'https://devpost.com/software/clarus-7werym',
        featured: true,
    },
    {
        id: 'numen',
        name: 'Numen',
        badge: 'GenAI Genesis 2026',
        desc: 'Multi-agent platform where Gemini embeds, classifies and answers questions: 60%+ auto-answer rate, hybrid search over indexed pull requests and a 768-dimension knowledge graph, and confidence gating that escalates uncertain questions to experts.',
        tech: ['Python', 'FastAPI', 'Gemini', 'Vector search', 'Next.js'],
        image: null,
        kind: 'graph',
        link: 'https://devpost.com/software/numen-9l43wx',
        featured: true,
    },
    {
        id: 'mimicoo',
        name: 'Mimicoo',
        badge: 'Hack the Valley 2025 — Winner',
        desc: 'Infant babble analysis for early speech-disorder risk: a classifier validated to 85% accuracy, served from a Python inference API with Gemini integration.',
        tech: ['Python', 'Machine learning', 'FastAPI', 'Gemini'],
        image: './images/Mimicoo.jpg',
        kind: 'wave',
        link: 'https://devpost.com/software/mimicoo',
        featured: true,
    },
    {
        id: 'vroomi',
        name: 'Vroomi',
        badge: 'SpurHacks 2025 — 3rd Place',
        desc: 'Campus-first ride-sharing platform connecting students for safe, split-cost transportation.',
        tech: ['Flask', 'MongoDB', 'React', 'Stripe'],
        image: './images/gallery.jpg',
        link: 'https://devpost.com/software/vroomi',
        featured: true,
    },
    {
        id: 'dws',
        name: 'DWS — Digital Walking Stick',
        short: 'DWS',
        badge: 'CxC Hackathon',
        desc: 'Voice-first indoor navigation assistant combining real-time computer vision, AI scene understanding and pathfinding to guide visually impaired users with just a smartphone camera.',
        tech: ['MiDaS', 'YOLOv8', 'OpenCV', 'MediaPipe', 'Next.js'],
        image: './images/dws.jpg',
        link: 'https://devpost.com/software/dws-4z1rot',
        featured: true,
    },
    {
        id: 'hapticphonix',
        name: 'HapticPhonix',
        badge: 'Ctrl+Hack+Del',
        desc: 'Real-time speech learning system: AI lip reading plus speech-to-haptic translation, so students can feel their own speech as phone vibrations while they practise phonemes.',
        tech: ['TensorFlow', 'PyTorch', 'MediaPipe', 'OpenCV'],
        image: './images/Haptic.jpg',
        link: 'https://devpost.com/software/hapticphonix',
    },
    {
        id: 'minutemaster',
        name: 'MinuteMaster',
        badge: 'GeeseHacks 2025',
        desc: 'Real-time speech-to-text and summarisation for business meetings, built on an AWS audio processing pipeline.',
        tech: ['Next.js', 'Express', 'AWS S3', 'LLM'],
        image: './images/minutemaster.jpg',
        link: 'https://devpost.com/software/minutemaster',
    },
    {
        id: 'studybuddy',
        name: 'StudyBuddy',
        badge: 'Personal Project',
        desc: 'Study platform with real-time lecture transcription (Whisper) and AI-generated summaries and notes (Gemini).',
        tech: ['Next.js', 'TypeScript', 'Supabase', 'Clerk'],
        image: './images/studybuddy.jpg',
        link: null,
    },
    {
        id: 'screenboard',
        name: 'ScreenBoard',
        badge: 'Personal Project',
        desc: 'Real-time hand-gesture recognition whiteboard using MediaPipe and custom computer-vision algorithms over WebSockets.',
        tech: ['Python', 'OpenCV', 'MediaPipe', 'WebSocket'],
        image: './images/Screenboard.jpg',
        link: null,
    },
];

// ---------------------------------------------------------------------------
//  Art diary. Add a painting: drop the file in images/art/ and add a line here.
// ---------------------------------------------------------------------------
export const art = [
    { src: './images/art/self-portrait.jpg', title: 'Me, Myself & Mini-Me', note: 'The character you are walking around as.' },
    { src: './images/art/night-street.jpg', title: 'Night Street', note: 'Lamplight, bricks and a lot of blue.' },
    { src: './images/art/blood-moon.jpg', title: 'Blood Moon', note: 'Something is hanging from the moon.' },
    { src: './images/art/goat.jpg', title: 'GOAT', note: 'Football poster.' },
    { src: './images/art/by-the-window.jpg', title: 'By the Window', note: 'A quiet morning.' },
    { src: './images/art/jia.jpg', title: 'Jia', note: 'Portrait study.' },
    { src: './images/art/1989.jpg', title: '1989', note: 'Portrait with seagulls.' },
];

// ---------------------------------------------------------------------------
//  Room dialog. Each entry is a list of lines; the last line can offer a choice.
//  choice.go     -> scene to open when the player picks "yes"
//  choice.action -> something the room does instead ('diary')
// ---------------------------------------------------------------------------
export const dialog = {
    intro: {
        speaker: 'Faraz',
        lines: [
            'Hello, homo sapien!',
            "I'm Faraz — welcome to my room.",
            'I build AI systems by day and draw by night. Everything in here does something, so poke around.',
            'Psst: some things hide secrets, and every discovery adds a star outside the window.',
        ],
    },
    computer: {
        speaker: 'Faraz',
        lines: ['My desk. Projects, experience, a terminal and a paint app all live on this machine.'],
        choice: { prompt: 'Boot up FarazOS?', yes: 'Boot it', no: 'Not now', go: 'os' },
    },
    tv: {
        speaker: 'Faraz',
        lines: ['The console. My hackathon projects are saved on the memory card — plus a few mini-games.'],
        choice: { prompt: 'Turn it on?', yes: 'Play', no: 'Later', go: 'games' },
    },
    resume: {
        speaker: 'Faraz',
        lines: ['My résumé, fresh off the printer: two Ontario Government co-ops, a funded startup and a few hackathon wins.'],
        choice: { prompt: 'Read the résumé?', yes: 'Open it', no: 'Leave it', go: 'resume' },
    },
    diary: {
        speaker: 'Faraz',
        lines: ['My art diary. When I am not shipping code, I am painting — characters, streets, monsters, friends.'],
        choice: { prompt: 'Flip through the art diary?', yes: 'Open it', no: 'Maybe later', action: 'diary' },
    },
    hologram: {
        speaker: 'Faraz',
        lines: [
            'My hologram projector. It loops through the AI I have built.',
            'Clarus: an AI agent that runs a workflow across five enterprise systems. It won Hack Canada 2026 and became a funded startup.',
            'Numen: a multi-agent platform that answers 60%+ of questions on its own and hands the rest to experts.',
            'Mimicoo: listens to infant babble to flag speech-disorder risk early. It won Hack the Valley.',
        ],
        choice: { prompt: 'See every project on the computer?', yes: 'Show me', no: 'Stay here', go: 'os' },
    },
    cat: {
        speaker: 'Cat',
        lines: ['Meow! Hello hooman.'],
        choice: { prompt: 'Wanna meow together in our cat world?', yes: 'Meow!', no: 'Not meow', go: 'catworld' },
    },
    backpack: {
        speaker: 'Faraz',
        lines: ['My hackathon backpack. Laptop, chargers, and far too many sponsor stickers.'],
    },
    bookshelf: {
        speaker: 'Faraz',
        lines: [
            'Textbooks from York University — Hons. Computer Science at Lassonde, class of 2027.',
            'Squeezed in between: certificates from Google (Data Analysis) and IBM (SQL for Data Science, Git and GitHub).',
        ],
    },
    // Second look at the bookshelf: the secret passage to the roof.
    bookshelfSecret: {
        speaker: 'Faraz',
        lines: ['Hm. One of these books is sticking out further than the others…'],
        choice: { prompt: 'Pull it?', yes: 'Pull', no: 'Leave it', go: 'rooftop', rumble: true },
    },
    // The tiny door only opens for friends of the cats.
    catdoor: {
        speaker: 'Faraz',
        lines: ['A tiny door with a paw print on it.', 'The cats said I am one of them now, so…'],
        choice: { prompt: 'Squeeze through?', yes: 'Squeeze', no: 'Nope', go: 'catworld', rumble: true },
    },
    catdoorLocked: {
        speaker: 'Faraz',
        lines: ['A tiny door with a paw print on it. It will not budge.', 'Maybe the cats know something about it.'],
    },
    trophies: {
        speaker: 'Faraz',
        lines: [
            'The trophy shelf!',
            'Hack Canada 2026: won with Clarus. Hack the Valley 2025: won with Mimicoo. SpurHacks 2025: 3rd place with Vroomi.',
            'And the Meta Hacker Cup 2024: Round 2, top 1% out of about 35,000 competitors.',
        ],
    },
    window: {
        speaker: 'Faraz',
        lines: ['Toronto at night. The sky out there grows a little every time you discover something in here.'],
    },
    poster: {
        speaker: 'Faraz',
        lines: ['A LeetCode streak calendar. Five algorithm problems a week keeps the bugs away.'],
    },
    bed: {
        speaker: 'Faraz',
        lines: ['Tempting… but there is still code to ship.'],
    },
    plant: {
        speaker: 'Faraz',
        lines: ['Still alive. I consider that a successful deployment.'],
    },
    robot: {
        speaker: 'Cutebot',
        lines: [
            'Beep boop!',
            'Faraz used robots like me — Micro:bit, Cutebot and HuskyLens AI — to teach high school students at k2i Academy.',
        ],
    },
    door: {
        speaker: 'Faraz',
        lines: ['The door back to the main menu.'],
        choice: { prompt: 'Leave the room?', yes: 'Leave', no: 'Stay', go: 'select' },
    },
};

// Visitor counter shown on the title screen. Uses the free Abacus counting service
// (https://abacus.jasoncameron.dev). Each browser is counted once. Set enabled to false to remove it.
export const visitorCounter = { enabled: true, namespace: 'farazkabbo-portfolio', key: 'visitors' };

// Hidden items: the first time the object is inspected, the item is found.
export const secrets = {
    backpack: { item: 'Micro:bit', line: 'Wait, something is in the side pocket… a Micro:bit from my k2i workshops!' },
    plant: { item: 'Hackathon wristband', line: 'There is something in the pot… a hackathon wristband. So that is where it went.' },
    bookshelf: { item: 'Golden floppy disk', line: 'A golden floppy disk is wedged between two books. 1.44 MB of pure legend.' },
    bed: { item: 'Smiley pendant', line: 'Something shiny under the pillow — my smiley pendant!' },
    diary: { item: 'Paintbrush', line: 'My favourite paintbrush was tucked between the pages.' },
};

// Achievements. Unlocking them also grows the universe outside the window.
export const badges = [
    { id: 'welcome', title: 'Home Sweet Home', hint: 'Step into the room.' },
    { id: 'curious', title: 'Curious Cat', hint: 'Inspect five different things.' },
    { id: 'explorer', title: 'Completionist', hint: 'Inspect everything in the room.' },
    { id: 'hooman', title: 'Hello, Hooman', hint: 'Talk to a cat.' },
    { id: 'catworld', title: 'Through the Cat Door', hint: 'Find the secret cat world.' },
    { id: 'rooftop', title: 'Up on the Roof', hint: 'Find the passage behind the books.' },
    { id: 'choir', title: 'Purrfect Pitch', hint: 'Win the Meow Choir.' },
    { id: 'artlover', title: 'Art Lover', hint: 'Flip through the whole art diary.' },
    { id: 'lights', title: 'Mood Lighting', hint: 'Find the light switch.' },
    { id: 'weather', title: 'Weather Wizard', hint: 'Change the weather.' },
    { id: 'treasure', title: 'Treasure Hunter', hint: 'Find all five hidden items.' },
    { id: 'boot', title: 'System Online', hint: 'Boot FarazOS.' },
    { id: 'gamer', title: 'Player One', hint: 'Play a mini-game.' },
    { id: 'paper', title: 'Paper Trail', hint: 'Read the résumé.' },
];
