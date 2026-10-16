import { QuartzConfig } from "./quartz/cfg";
import * as Plugin from "./quartz/plugins";

/**
 * Quartz 4 configuration for the Trans Wiki Spain site.
 *
 * This file lives in the wiki repo under .quartz/ and is copied into a fresh
 * Quartz checkout by .github/workflows/deploy.yml at build time, together
 * with quartz.layout.ts and everything under .quartz/quartz/ (styles, static).
 * Docs: https://quartz.jzhao.xyz/configuration
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Wiki Queer Trans España 18+",
    pageTitleSuffix: " · Wiki Queer Trans España 18+",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    // GitHub Pages project site URL, without protocol or trailing slash.
    // Change this if you add a custom domain.
    baseUrl: "clara-minova.github.io/trans-wiki",
    ignorePatterns: ["private", "templates", ".obsidian", "**/.DS_Store"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        // Fonts with Cyrillic support, so the RU pages render consistently
        header: "Source Sans Pro",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          // Accent colors taken from the wiki avatar (trans flag + navy)
          secondary: "#1e5a8a", // links, page title
          tertiary: "#c4506e", // hover, active items
          highlight: "rgba(91, 206, 250, 0.14)", // background behind internal links
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7fd3f7",
          tertiary: "#f5a9b8",
          highlight: "rgba(91, 206, 250, 0.12)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      // Wikilinks, callouts (> [!tip]), %% comments %%, embeds
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    // Notes with `draft: true` in frontmatter are not published
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
};

export default config;
