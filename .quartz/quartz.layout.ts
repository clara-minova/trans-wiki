import { PageLayout, SharedLayout } from "./quartz/cfg";
import * as Component from "./quartz/components";
import ConfirmLink from "./quartz/components/ConfirmLink";
import SiteFooter from "./quartz/components/SiteFooter";

// Invite link to the Telegram chat. Replace with the real link.
// Every link to this exact URL (footer or notes) asks for confirmation first.
const TELEGRAM_CHAT_URL = "https://t.me/+QOBxuFffyA03MTZi";

/**
 * Page layout: which components appear and where.
 * Copied over Quartz's own quartz.layout.ts at build time.
 * Component reference: https://quartz.jzhao.xyz/layout
 *
 * Slots: left (sidebar), right (sidebar), beforeBody (above the note text),
 * afterBody (below it), header, footer. Remove a line to hide a component,
 * move it to another slot to relocate it.
 */

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    ConfirmLink({
      url: TELEGRAM_CHAT_URL,
      title: "Queer Trans España 18+",
      message: [
        "Этот чат только для русскоговорящих и только для взрослых (18+).",
        "This chat is Russian-speaking only and for adults (18+).",
      ],
      confirmLabel: "Открыть / Open",
      cancelLabel: "Отмена / Cancel",
    }),
  ],
  footer: SiteFooter({
    // {year} is replaced with the current year
    text: "Wiki Queer Trans España 18+ · Created by Clara Minova © {year}",
    links: {
      "Source on GitHub": "https://github.com/clara-minova/trans-wiki",
      "Ownership statement":
        "https://clara-minova.github.io/trans-wiki/ownership-statement.txt",
      "Telegram-чат (RU, 18+)": TELEGRAM_CHAT_URL,
    },
  }),
};

// components for pages that display a single note
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(), // date + reading time; remove to hide
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
};

// components for pages that list other pages (folders, tags)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
};
