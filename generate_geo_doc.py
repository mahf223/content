"""Generate a polished Word document for the GEO research guide."""

from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement


PRIMARY = RGBColor(0x1F, 0x3A, 0x68)   # deep navy
ACCENT = RGBColor(0x0E, 0x76, 0xA8)    # teal-blue
DARK = RGBColor(0x22, 0x22, 0x22)
GREY = RGBColor(0x55, 0x55, 0x55)


def set_cell_shading(cell, color_hex: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), color_hex)
    tc_pr.append(shd)


def add_horizontal_rule(doc: Document) -> None:
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "8")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "1F3A68")
    pBdr.append(bottom)
    pPr.append(pBdr)


def style_runs(paragraph, *, size=11, bold=False, color=DARK, italic=False) -> None:
    for run in paragraph.runs:
        run.font.name = "Calibri"
        run.font.size = Pt(size)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color


def add_title(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(28)
    run.bold = True
    run.font.color.rgb = PRIMARY


def add_subtitle(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(14)
    run.italic = True
    run.font.color.rgb = ACCENT


def add_h1(doc: Document, text: str) -> None:
    doc.add_paragraph()
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(18)
    run.bold = True
    run.font.color.rgb = PRIMARY
    add_horizontal_rule(doc)


def add_h2(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(14)
    run.bold = True
    run.font.color.rgb = ACCENT
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)


def add_h3(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(12)
    run.bold = True
    run.font.color.rgb = DARK
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)


def add_para(doc: Document, text: str) -> None:
    p = doc.add_paragraph(text)
    style_runs(p, size=11, color=DARK)
    p.paragraph_format.space_after = Pt(6)


def add_bullets(doc: Document, items) -> None:
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        run = p.add_run(item)
        run.font.name = "Calibri"
        run.font.size = Pt(11)
        run.font.color.rgb = DARK


def add_numbered(doc: Document, items) -> None:
    for item in items:
        p = doc.add_paragraph(style="List Number")
        run = p.add_run(item)
        run.font.name = "Calibri"
        run.font.size = Pt(11)
        run.font.color.rgb = DARK


def add_table(doc: Document, headers, rows) -> None:
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Light Grid Accent 1"
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = ""
        p = hdr_cells[i].paragraphs[0]
        run = p.add_run(h)
        run.bold = True
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        run.font.size = Pt(11)
        run.font.name = "Calibri"
        set_cell_shading(hdr_cells[i], "1F3A68")
    for r_idx, row in enumerate(rows, start=1):
        cells = table.rows[r_idx].cells
        for c_idx, val in enumerate(row):
            cells[c_idx].text = ""
            p = cells[c_idx].paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(10)
            run.font.name = "Calibri"
            run.font.color.rgb = DARK


def add_callout(doc: Document, text: str) -> None:
    table = doc.add_table(rows=1, cols=1)
    cell = table.rows[0].cells[0]
    set_cell_shading(cell, "EAF3FB")
    cell.text = ""
    p = cell.paragraphs[0]
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    run.italic = True
    run.font.color.rgb = PRIMARY
    doc.add_paragraph()


def build():
    doc = Document()

    # Page margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # Default style
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)

    # Cover
    doc.add_paragraph()
    doc.add_paragraph()
    add_title(doc, "GEO — Generative Engine Optimization")
    add_subtitle(doc, "The Complete Research & Strategy Guide  |  Beginner → Advanced")
    doc.add_paragraph()
    add_callout(
        doc,
        "A premium research document covering fundamentals, strategy, AI search visibility, "
        "tools, frameworks, real-world examples, and a full beginner-to-expert roadmap for "
        "marketers, creators, freelancers, and businesses preparing for the AI-mediated web."
    )

    # 1. INTRODUCTION
    add_h1(doc, "1. Introduction")

    add_h2(doc, "What is GEO?")
    add_para(doc,
        "Generative Engine Optimization (GEO) is the discipline of optimizing content, brand "
        "signals, and digital assets so they are understood, cited, and recommended by "
        "generative AI systems including ChatGPT, Google AI Overviews, Gemini, Perplexity, "
        "Claude, Copilot, and Grok. Where traditional SEO targets blue-link rankings on search "
        "engine results pages, GEO targets inclusion inside AI-generated answers — the "
        "synthesized response a user reads instead of clicking a link.")

    add_h2(doc, "Why It Matters Today")
    add_bullets(doc, [
        "Search behavior is shifting from '10 blue links' to '1 answer'.",
        "Zero-click search is rising sharply; AI answers will accelerate this.",
        "AI engines act as gatekeepers — visibility depends on whether an LLM retrieves and cites your content.",
        "Brand mentions are the new backlinks — LLMs build trust models from consistent mentions.",
        "Buyer journeys increasingly start with 'Ask ChatGPT' rather than 'Google it'.",
    ])

    add_h2(doc, "How GEO Works (Simplified)")
    add_numbered(doc, [
        "Retrieval — the engine pulls candidate content from its index, RAG database, or knowledge graph.",
        "Ranking & Trust — it scores sources by authority, freshness, citation density, and entity confidence.",
        "Synthesis — it generates a unified answer, citing or paraphrasing the strongest sources.",
    ])
    add_para(doc,
        "GEO optimizes all three layers — making your content easy to retrieve, trustworthy "
        "enough to cite, and structured enough to be quoted.")

    add_h2(doc, "Why Businesses and Marketers Use GEO")
    add_bullets(doc, [
        "Remain discoverable in AI-mediated search.",
        "Preserve brand mentions and traffic as click-through rates fall.",
        "Establish topical and entity authority that compounds across SEO and GEO.",
        "Capture high-intent buyers using AI tools for purchasing research.",
        "Future-proof content strategy as the answer layer becomes the new homepage of the web.",
    ])

    add_h2(doc, "How AI Is Reshaping This Space")
    add_bullets(doc, [
        "LLMs treat the web as structured knowledge, not just keyword text.",
        "Authority is measured by co-citation with trusted sources.",
        "Content must be semantically dense, factually verifiable, and entity-linked.",
        "Marketing is shifting from ranking pages to training models through public content footprints.",
    ])

    # 2. BEGINNER FOUNDATION
    add_h1(doc, "2. Beginner Foundation")

    add_h2(doc, "Core Concepts")
    add_bullets(doc, [
        "Generative Engine — an AI system that produces answers (ChatGPT, Gemini, Perplexity, AI Overviews).",
        "GEO — practices that increase the chance of being included, cited, or recommended in AI answers.",
        "Citation Surface — the portion of an AI answer that links back to a source.",
        "Retrieval-Augmented Generation (RAG) — when an AI fetches live sources before answering.",
        "Training Corpus — static data used to train an LLM (everything published before the cutoff).",
        "Entity — a real-world thing (person, brand, product, concept) the AI recognizes.",
        "Knowledge Graph — a structured database of entities and relationships (Google KG, Wikidata).",
    ])

    add_h2(doc, "Key Terminology")
    add_table(doc,
        ["Term", "Meaning"],
        [
            ["LLM", "Large Language Model"],
            ["AI Overviews (AIO)", "Google's AI-generated SERP summaries"],
            ["SGE", "Search Generative Experience (predecessor of AIO)"],
            ["Answer Engine", "Tools like Perplexity that primarily output answers"],
            ["Hallucination", "When an LLM invents a fact"],
            ["Grounding", "Forcing an LLM to use real, retrieved sources"],
            ["Embeddings", "Vector representations of meaning, used in retrieval"],
            ["Chunking", "Breaking content into retrievable pieces"],
            ["Schema Markup", "Structured data that helps machines understand pages"],
        ])

    add_h2(doc, "Basic Principles")
    add_numbered(doc, [
        "Be quotable — write in clear, self-contained statements.",
        "Be verifiable — cite sources, include data, dates, and authors.",
        "Be entity-rich — mention named experts, brands, tools, and concepts.",
        "Be consistent — same brand description across the web builds AI confidence.",
        "Be structured — use headings, lists, FAQs, and schema.",
        "Be cited elsewhere — external mentions and links remain trust signals.",
    ])

    add_h2(doc, "Common Beginner Mistakes")
    add_bullets(doc, [
        "Treating GEO as 'SEO with a new name'.",
        "Stuffing keywords instead of writing for semantic clarity.",
        "Ignoring brand mentions on Reddit, Quora, YouTube, and industry directories.",
        "Hiding key facts behind walls of prose — LLMs prefer scannable, atomic statements.",
        "Forgetting an About / Author / Sources page (fatal for E-E-A-T and AI trust).",
        "Writing for humans only, ignoring schema and machine readability.",
    ])

    add_h2(doc, "Industry-Standard Understanding")
    add_para(doc,
        "GEO is best viewed as the next layer on top of SEO, not a replacement. Strong "
        "technical SEO + topical authority + LLM-friendly formatting equals strong GEO.")

    # 3. INTERMEDIATE
    add_h1(doc, "3. Intermediate Level")

    add_h2(doc, "Real-World GEO Workflow")
    add_numbered(doc, [
        "Audit AI visibility across ChatGPT, Gemini, Perplexity, Claude with 30 top queries.",
        "Map the citation landscape — identify which domains AI engines repeatedly cite.",
        "Reverse-engineer the answer — break each AI response into individual claims.",
        "Produce GEO-grade content using the Claim → Evidence → Source → Entity (CESE) structure.",
        "Distribute for co-citation on platforms LLMs already trust.",
        "Measure and iterate with monthly citation tracking.",
    ])

    add_h2(doc, "Strategic Implementation")
    add_bullets(doc, [
        "Topical Clusters — hub-and-spoke content that fully covers an entity.",
        "Comparative Content — 'X vs Y', 'Best [tool] for [use case]', listicles dominate AI Overviews.",
        "Original Data — surveys, benchmarks, studies are disproportionately cited.",
        "FAQ + How-to layers — match AI's Q&A response style.",
    ])

    add_h2(doc, "Optimization Methods")
    add_bullets(doc, [
        "Answer-First Writing — lead each section with a 1–2 sentence direct answer.",
        "Atomic Content Blocks — each H2/H3 is a self-contained idea, retrievable as a chunk.",
        "Schema Markup — Article, FAQPage, HowTo, Product, Organization, Person, Dataset.",
        "Internal Linking with Entities — anchor on named entities, not generic phrases.",
        "Multi-Modal Coverage — images with descriptive alt text, video transcripts, tables.",
        "Freshness Cycles — update flagship content every 60–90 days.",
    ])

    add_h2(doc, "Frameworks & Systems")
    add_table(doc,
        ["Framework", "Purpose"],
        [
            ["CESE", "Claim → Evidence → Source → Entity (core GEO structure)"],
            ["AEO Pyramid", "Awareness → Engagement → Opinion → Answer"],
            ["3C Trust Model", "Consistency, Citation, Co-mentions across the web"],
            ["PEEL Paragraphs", "Point, Evidence, Explanation, Link (highly quotable)"],
        ])

    add_h2(doc, "Mini Case-Style Example")
    add_para(doc,
        "A mid-size SaaS noticed Perplexity recommended three competitors but never them. "
        "The audit revealed: no Wikipedia or Wikidata entity, no Reddit/G2 reviews, and "
        "comparison pages only on competitor sites.")
    add_para(doc, "Within 90 days they:")
    add_bullets(doc, [
        "Published 12 comparison pages with structured data.",
        "Earned 40+ Reddit and Quora mentions through community engagement.",
        "Created a Wikidata entity and consistent brand bio.",
        "Released an original benchmark study.",
    ])
    add_para(doc,
        "Result: cited in Perplexity for 60% of target queries; AI Overviews mentions tripled.")

    # 4. ADVANCED
    add_h1(doc, "4. Advanced Level")

    add_h2(doc, "Expert-Level Strategies")
    add_bullets(doc, [
        "Entity Engineering — deliberately build an entity profile across Wikipedia, Wikidata, Crunchbase, LinkedIn, GitHub, and industry directories.",
        "Co-Citation Engineering — get cited alongside category-defining brands.",
        "Source-of-Truth Pages — one canonical page per claim, distributed as a citation target.",
        "Prompt-Targeted Content — reverse-engineer real user prompts, not just keywords.",
        "Knowledge Panel Optimization — drive Google KG inclusion via schema and brand consistency.",
        "Synthetic Audit Loops — weekly automated prompts across 5+ AI engines.",
    ])

    add_h2(doc, "AI-Driven Techniques")
    add_bullets(doc, [
        "Embedding-based gap analysis using OpenAI/Cohere embeddings.",
        "RAG-friendly chunking — 200–400 token blocks with strong topical headers.",
        "LLM brand-perception probing — correct misconceptions with new content.",
        "Synthetic SERP modeling — predict AI Overview output and fill missing facts.",
    ])

    add_h2(doc, "Scaling Systems")
    add_bullets(doc, [
        "Editorial assembly lines: Researchers → Writers → Editors → Schema engineers → Distribution.",
        "Programmatic GEO — templated pages backed by proprietary data with strong schema.",
        "Open knowledge bases and public docs that LLMs ingest into training and RAG.",
    ])

    add_h2(doc, "Automation Opportunities")
    add_bullets(doc, [
        "Monitor AI citations via API-based prompts (OpenAI, Perplexity API, Gemini API).",
        "Auto-generate schema with Schema App or WordLift.",
        "Auto-detect outdated content using embeddings + freshness scoring.",
        "Auto-generate FAQ blocks from Search Console queries.",
    ])

    add_h2(doc, "Competitive Analysis")
    add_bullets(doc, [
        "Map every domain cited in AI answers for your top 100 queries.",
        "Score competitors on Citation Frequency, Source Diversity, Entity Strength, Freshness.",
        "Identify 'AI-only' competitors that dominate AI answers but rank low on Google.",
    ])

    add_h2(doc, "Data-Driven Decision Making — Track")
    add_bullets(doc, [
        "AI Share of Voice — % of target prompts where you are mentioned.",
        "Citation Rank — average position when cited.",
        "Sentiment Score — how AI describes your brand.",
        "Entity Confidence — does the model know what you are?",
        "Fact Accuracy — is what's said about you true?",
    ])

    add_h2(doc, "Industry Trends (2025–2026)")
    add_bullets(doc, [
        "Google AI Mode and AI Overviews appear on most informational queries.",
        "ChatGPT Search and Perplexity are eating into Google's informational query share.",
        "AI agents (Operator, Comet, Gemini Agent) act on behalf of users.",
        "Schema, llms.txt, and AI-readable APIs are emerging standards.",
        "Reddit, YouTube, and structured databases are disproportionately influential as LLM sources.",
    ])

    add_h2(doc, "Future Predictions")
    add_bullets(doc, [
        "'Agent SEO' — optimizing for autonomous AI shoppers.",
        "Brand mentions overtake backlinks as the dominant trust signal.",
        "First-party data ecosystems (newsletters, communities, apps) become the new moat.",
        "Hyper-personalized AI answers fragment the SERP — there is no single 'ranking'.",
    ])

    # 5. MODERN SEO & AI PERSPECTIVE
    add_h1(doc, "5. Modern SEO & AI Perspective")

    add_h2(doc, "Google Ranking Systems Still Matter")
    add_para(doc,
        "RankBrain, BERT, MUM, Helpful Content System, and Core Updates still gate AI Overviews. "
        "AIO sources are pulled primarily from top 10 organic results.")

    add_h2(doc, "E-E-A-T")
    add_bullets(doc, [
        "Experience — show you've used the product or lived the situation.",
        "Expertise — author bios, credentials, structured data.",
        "Authoritativeness — citations, mentions, awards.",
        "Trust — transparency, sources, contact info, accuracy.",
    ])

    add_h2(doc, "Semantic SEO")
    add_para(doc,
        "Move from keyword targeting to meaning targeting — cover entities, attributes, "
        "relationships, and intents, not just phrases.")

    add_h2(doc, "Topical Authority & Search Intent")
    add_para(doc,
        "Become the most complete source on a topic. Map every page to one of: Informational, "
        "Navigational, Commercial Investigation, Transactional, or Conversational (the new "
        "intent type for AI prompts).")

    add_h2(doc, "AI Overviews Optimization")
    add_bullets(doc, [
        "Rank in the top 10 organic results.",
        "Provide concise direct answers up front.",
        "Use lists, tables, and steps.",
        "Add fresh data and clear authorship.",
    ])

    add_h2(doc, "Entity-Based SEO & Brand Authority")
    add_para(doc,
        "Every brand, person, and product should be a recognized entity in major knowledge "
        "graphs. Brand search volume, unlinked mentions, and consistent NAP across the web are "
        "first-class ranking factors in the AI era.")

    # 6. PRACTICAL IMPLEMENTATION
    add_h1(doc, "6. Practical Implementation")

    add_h2(doc, "Step-by-Step GEO Action Plan")

    add_h3(doc, "Phase 1 — Foundation (Weeks 1–2)")
    add_numbered(doc, [
        "Run an AI visibility audit across 5 engines × 30 queries.",
        "Fix technical SEO: crawlability, schema, sitemap, Core Web Vitals.",
        "Publish or upgrade About, Author, Editorial Policy, and Sources pages.",
        "Claim Wikidata, LinkedIn, Crunchbase, and key directory profiles.",
    ])

    add_h3(doc, "Phase 2 — Content Engine (Weeks 3–8)")
    add_numbered(doc, [
        "Build 3–5 topical clusters with pillar + cluster content.",
        "Apply CESE structure to every page.",
        "Add FAQ, HowTo, Article, Organization, Person schema.",
        "Publish at least one original research piece.",
    ])

    add_h3(doc, "Phase 3 — Distribution & Authority (Weeks 6–12)")
    add_numbered(doc, [
        "Earn mentions on Reddit, Quora, YouTube transcripts, podcasts, Substacks.",
        "Publish on industry directories such as G2, Capterra, Clutch, Crunchbase.",
        "Run a digital PR campaign tied to your data study.",
        "Get co-cited with category leaders.",
    ])

    add_h3(doc, "Phase 4 — Measurement & Iteration (Ongoing)")
    add_numbered(doc, [
        "Monthly AI citation audit.",
        "Quarterly entity audit.",
        "60–90 day refresh on flagship content.",
    ])

    add_h2(doc, "GEO Checklist")
    add_bullets(doc, [
        "Direct answer in first 2 sentences of every section.",
        "H2/H3 phrased as user questions.",
        "Tables, lists, and comparison blocks.",
        "Schema for Article + FAQ + Author + Organization.",
        "Original data, statistics, or expert quotes.",
        "Author bio with credentials and links.",
        "External citations to authoritative sources.",
        "Visible updated date.",
        "Image alt text describing entities.",
        "Internal links using entity-rich anchors.",
        "Brand mentioned on Reddit, YouTube, and industry sites.",
        "Wikidata + Knowledge Graph presence.",
        "llms.txt file (optional but emerging).",
    ])

    add_h2(doc, "SOP for One Article")
    add_numbered(doc, [
        "Identify prompt and intent.",
        "Pull AI answers from 4 engines and list claims.",
        "Outline using CESE + PEEL.",
        "Draft answer-first sections.",
        "Add data, expert quote, table, FAQ.",
        "Apply schema.",
        "Internal-link to 3–5 entity pages.",
        "Publish and ping search engines.",
        "Distribute snippets to LinkedIn, Reddit, YouTube short.",
        "Add to citation-tracking dashboard.",
    ])

    add_h2(doc, "Daily / Weekly / Monthly Cadence")
    add_table(doc,
        ["Cadence", "Action"],
        [
            ["Daily", "Monitor AI mentions; respond to community questions."],
            ["Weekly", "Publish 1–2 GEO-grade articles; refresh 1 old piece."],
            ["Monthly", "Citation audit, schema audit, entity audit."],
            ["Quarterly", "Original data release, PR push, knowledge graph review."],
        ])

    # 7. TOOLS & RESOURCES
    add_h1(doc, "7. Tools & Resources")

    add_h2(doc, "Free Tools")
    add_bullets(doc, [
        "Google Search Console — query and indexing data.",
        "Google Trends — emerging topics.",
        "Bing Webmaster Tools — feeds Copilot.",
        "Perplexity — see live citations.",
        "ChatGPT (free tier) — visibility probing.",
        "Schema.org & Schema Markup Validator — schema reference.",
        "Wikidata / Wikipedia — entity foundation.",
        "AlsoAsked, AnswerThePublic (free tier) — question discovery.",
    ])

    add_h2(doc, "Paid Tools")
    add_bullets(doc, [
        "Ahrefs / Semrush / Sistrix — SEO + AI Overview tracking.",
        "SE Ranking, Surfer, Frase — content optimization.",
        "Otterly.AI, Profound, Peec AI, AthenaHQ, Goodie, Bluefish, Scrunch — AI search visibility.",
        "Schema App / WordLift — automated schema and entity linking.",
        "SparkToro — audience and source intelligence.",
        "BuzzSumo — content and PR research.",
    ])

    add_h2(doc, "AI Tools")
    add_bullets(doc, [
        "ChatGPT, Claude, Gemini, Perplexity, Grok — research, drafting, probing.",
        "NotebookLM — synthesize sources.",
        "Cohere / OpenAI Embeddings — semantic gap analysis.",
        "Jasper, Copy.ai — production assistance (use sparingly).",
    ])

    add_h2(doc, "Browser Extensions, Automation & Analytics")
    add_bullets(doc, [
        "Detailed SEO Extension, SEO Pro, Keywords Everywhere, Wappalyzer.",
        "Zapier / Make / n8n — connect AI APIs to dashboards.",
        "Screaming Frog and Sitebulb — technical SEO and schema audits.",
        "GA4, Looker Studio, Plausible, Fathom, Microsoft Clarity.",
    ])

    # 8. EXAMPLES & CASE STUDIES
    add_h1(doc, "8. Real Examples & Case Studies")

    add_h2(doc, "Example 1 — Reddit's Dominance")
    add_para(doc,
        "After Google's content deal with Reddit (2024), Reddit threads became one of the top "
        "cited sources in AI Overviews and ChatGPT. Brands that engage authentically in "
        "subreddits gain disproportionate AI visibility.")

    add_h2(doc, "Example 2 — G2 & Software Comparison Sites")
    add_para(doc,
        "LLMs heavily cite G2, Capterra, and TrustRadius for SaaS recommendations. SaaS brands "
        "without an active review presence are systematically underrepresented in AI answers.")

    add_h2(doc, "Example 3 — HubSpot's Topical Authority")
    add_para(doc,
        "HubSpot built such deep topical clusters around marketing, sales, and CRM that LLMs "
        "treat it as a default authority — frequently cited even when newer content exists.")

    add_h2(doc, "Example 4 — Independent Creators in Perplexity")
    add_para(doc,
        "Niche bloggers with strong original data (Backlinko, Animalz, Detailed.com) regularly "
        "out-cite enterprise sites because they publish primary research — a pattern LLMs reward.")

    add_h2(doc, "Example 5 — Failure Pattern")
    add_para(doc,
        "A consumer brand pumped out 800 AI-generated articles in 2024. Rankings collapsed "
        "after the Helpful Content Update, and AI engines stopped citing them due to factual "
        "errors and lack of E-E-A-T. Lesson: scale without quality is now actively penalized.")

    add_h2(doc, "Industry Use Cases")
    add_table(doc,
        ["Industry", "GEO Priority"],
        [
            ["SaaS", "Comparison pages, integrations, ROI data, G2 presence."],
            ["E-commerce", "Product schema, review schema, video reviews."],
            ["Local Business", "Google Business, NAP consistency, local PR."],
            ["Finance / Health (YMYL)", "Strict E-E-A-T, expert authorship, citations."],
            ["B2B Services", "Thought leadership, case studies, original benchmarks."],
        ])

    # 9. CONTENT & BRANDING
    add_h1(doc, "9. Content Creation & Personal Branding")

    add_h2(doc, "Channels")
    add_bullets(doc, [
        "YouTube — tutorials, audits, framework explainers (transcripts get ingested by LLMs).",
        "Blog — pillar guides, original studies, tool comparisons, 'best of' lists.",
        "LinkedIn — frameworks, mini case studies, GEO checklists, polls.",
        "Social — X threads with data points, IG carousels, TikTok one-tactic shorts.",
    ])

    add_h2(doc, "Freelancing & Client Acquisition")
    add_bullets(doc, [
        "AI Visibility Audits ($500–$3,000).",
        "GEO Content Packages — per article or retainer.",
        "Schema & Entity Optimization services.",
        "AI Brand Monitoring Subscriptions.",
        "Audit-driven outbound: send a free 1-page AI visibility report.",
        "Public audits of well-known brands as research / lead magnet.",
        "Speak at SEO and marketing communities — GEO is a magnet topic.",
    ])

    add_h2(doc, "Agency Growth & Personal Branding")
    add_bullets(doc, [
        "Productize tiered GEO retainers.",
        "Build proprietary AI citation tracking tools.",
        "Train teams in entity SEO and schema engineering.",
        "Pick a narrow GEO niche (SaaS, local, e-commerce) and dominate it.",
        "Publish weekly insights with original probing data.",
        "Build your own entity profile via speaking, podcasts, and guest posts.",
    ])

    # 10. ROADMAP
    add_h1(doc, "10. Beginner-to-Expert Roadmap")

    add_table(doc,
        ["Stage", "Duration", "Focus"],
        [
            ["1. Fundamentals", "Weeks 1–4", "Core SEO, schema basics, LLM workings, manual AI audits."],
            ["2. Practitioner", "Months 2–4", "Apply CESE on 20+ articles, schema, weekly citation tracking."],
            ["3. Strategist", "Months 4–8", "Entity SEO, digital PR, competitive AI audits, dashboards."],
            ["4. Expert", "Months 8–12+", "Proprietary frameworks, embeddings, automation, original research."],
        ])

    add_h2(doc, "Skills That Matter Most")
    add_numbered(doc, [
        "Critical thinking and research.",
        "Technical SEO foundations.",
        "Content strategy and writing.",
        "Data analysis (basic SQL and spreadsheets).",
        "Schema and structured data.",
        "Prompt engineering for audits.",
        "Digital PR and community engagement.",
        "Communication and storytelling.",
    ])

    add_h2(doc, "Becoming Job/Client-Ready")
    add_bullets(doc, [
        "Build 2–3 public case studies.",
        "Maintain a personal blog demonstrating GEO mastery.",
        "Create a productized service.",
        "Publish original research at least once.",
    ])

    # 11. MISTAKES
    add_h1(doc, "11. Common Mistakes")
    add_bullets(doc, [
        "Mass-producing low-quality AI content.",
        "Ignoring brand mentions outside your site.",
        "Skipping schema markup.",
        "Confusing GEO with hacks — no trick replaces authority and accuracy.",
        "Optimizing for the wrong engine — audit each engine separately.",
        "Neglecting content freshness.",
        "Hiding authorship and credentials.",
        "Treating Reddit/Quora as spam channels instead of authority signals.",
        "Forgetting accessibility (alt text, transcripts, clean HTML).",
        "Chasing volume over depth.",
    ])

    # 12. FUTURE
    add_h1(doc, "12. Future of GEO")

    add_h2(doc, "Future Trends")
    add_bullets(doc, [
        "Agent-driven discovery — AI agents research and purchase on behalf of users.",
        "Personalized AI answers — share-of-voice replaces ranking.",
        "Multimodal search — voice, image, and video become primary inputs.",
        "Open standards — llms.txt, ai.txt, structured data, content provenance (C2PA).",
        "Compensation models — publishers may license content directly to LLMs.",
    ])

    add_h2(doc, "Market Direction & Opportunities")
    add_bullets(doc, [
        "GEO budgets will absorb part of SEO and PR budgets.",
        "Specialist GEO agencies will multiply.",
        "Enterprise teams will hire 'AI Visibility' leads.",
        "SEO, PR, and content converge into a unified Discoverability function.",
        "Creators: build niche authority that LLMs cite.",
        "Freelancers: offer audits, schema, and entity services.",
        "Businesses: capture market share before competitors adapt.",
    ])

    # 13. FAQ
    add_h1(doc, "13. FAQ")

    faq = [
        ("Is GEO replacing SEO?",
         "No. GEO extends SEO. Strong SEO foundations remain a prerequisite."),
        ("How fast can I see GEO results?",
         "Brand-mention-driven gains can appear in 4–8 weeks; entity authority takes 3–9 months."),
        ("Do I need to optimize differently for each AI engine?",
         "Yes. ChatGPT Search, Perplexity, Gemini/AIO, and Claude pull from different sources."),
        ("Does AI-generated content hurt GEO?",
         "Low-quality AI content does. High-quality, expert-edited, fact-checked content is fine."),
        ("What's the single most impactful GEO action?",
         "Earn consistent, accurate brand mentions on high-authority sources (Reddit, YouTube, Wikipedia-tier media, industry directories)."),
        ("Is schema still important?",
         "Yes. It is more important than ever — it directly fuels Knowledge Graphs, AIO, and grounding."),
        ("What about llms.txt?",
         "An emerging standard. Implement it; expect formal adoption to grow."),
        ("How do I measure GEO success?",
         "AI Share of Voice, Citation Rank, Sentiment, Entity Confidence, and downstream brand-search lift."),
        ("Will AI kill website traffic?",
         "Informational traffic will decline; high-intent and brand-driven traffic will become more valuable."),
        ("Is GEO a viable freelance career?",
         "Yes — currently one of the highest-leverage emerging niches in marketing."),
    ]
    for q, a in faq:
        add_h3(doc, "Q. " + q)
        add_para(doc, "A. " + a)

    # 14. SUMMARY
    add_h1(doc, "14. Final Summary")

    add_h2(doc, "Key Takeaways")
    add_bullets(doc, [
        "GEO is the optimization discipline for the AI answer layer of the internet.",
        "It builds on, but does not replace, traditional SEO.",
        "Visibility is decided by entity authority, brand mentions, structured content, and trust signals.",
        "Atomic, answer-first, well-cited content wins.",
        "Off-site mentions matter as much as on-site optimization.",
    ])

    add_h2(doc, "Important Insights")
    add_bullets(doc, [
        "Brands, not just pages, are ranked.",
        "Authority compounds — original research and consistent presence pay long term.",
        "Audit constantly — each AI engine is its own ecosystem.",
        "Quality over quantity — one excellent pillar beats ten thin pages.",
    ])

    add_h2(doc, "Expert Recommendations")
    add_numbered(doc, [
        "Start with an AI visibility audit this week.",
        "Fix technical and E-E-A-T foundations before scaling.",
        "Pick a topical niche and dominate it before expanding.",
        "Build for both humans and machines — same content, structured for both.",
        "Treat GEO as a continuous program, not a campaign.",
    ])

    add_callout(
        doc,
        "Final Word — Generative Engine Optimization is not a trend. It is the next operating "
        "layer of digital marketing. The brands, creators, and freelancers who invest in entity "
        "authority, structured knowledge, and trustworthy content today will own the AI-mediated "
        "internet of tomorrow. The early-advantage window is open now; in 24 months it will narrow sharply."
    )

    out_path = "/projects/sandbox/content/GEO-Generative-Engine-Optimization-Research-Guide.docx"
    doc.save(out_path)
    print(f"Saved: {out_path}")


if __name__ == "__main__":
    build()
