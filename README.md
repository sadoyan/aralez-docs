# Aralez Docs — Hugo Project

This is the [Aralez](https://github.com/sadoyan/aralez) documentation site converted from MkDocs to Hugo.

## Requirements

- [Hugo](https://gohugo.io/installation/) v0.110+ (extended version recommended)

## Quick Start

```bash
# Clone or extract this project
cd aralez-hugo

# Start the development server
hugo server

# Open http://localhost:1313 in your browser
```

## Build for Production

```bash
hugo --minify
# Output is in the ./public/ directory
```

## Theme

This site uses a **custom light-mode theme** built directly into `layouts/` and `static/css/main.css`. No external theme dependencies are required.

- **Light mode only** — white background, navy header, clean typography
- **Syntax highlighting** — GitHub light style (via Hugo's built-in Chroma)
- **Fonts** — Inter (UI) + Roboto Mono (code), loaded from Google Fonts
- **No dark mode, no Monokai**

## Project Structure

```
aralez-hugo/
├── hugo.toml              # Site configuration, menus, markup settings
├── content/
│   ├── _index.md          # Homepage content
│   └── docs/
│       ├── quickstart.md
│       ├── config.md
│       ├── api.md
│       ├── auth.md
│       ├── compare.md
│       ├── perf.md
│       ├── metrics.md
│       ├── kubernetes.md
│       └── autossl.md
├── layouts/
│   ├── _default/
│   │   ├── baseof.html    # Base HTML shell
│   │   ├── single.html    # Doc page layout
│   │   └── list.html      # Section listing layout
│   ├── index.html         # Homepage layout (with hero)
│   └── partials/
│       ├── header.html
│       ├── sidebar.html
│       └── footer.html
└── static/
    ├── css/
    │   └── main.css       # All styles — light theme
    └── images/
        └── logo.png
```

## Customization

- **Colors / fonts**: Edit `static/css/main.css` CSS variables in `:root`
- **Navigation**: Edit `[[menu.main]]` entries in `hugo.toml`
- **Site metadata**: Edit `[params]` in `hugo.toml`
