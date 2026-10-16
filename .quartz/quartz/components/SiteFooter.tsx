import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

/**
 * Site footer: a line of text plus a row of links.
 * Same look as Quartz's built-in Footer, but with our own text instead of
 * "Created with Quartz". `{year}` in the text is replaced with the current year.
 *
 * This file lives in the wiki repo under .quartz/quartz/components/ and is
 * copied into Quartz at build time. It is used in quartz.layout.ts.
 */

interface Options {
  text: string
  links: Record<string, string>
}

export default ((opts: Options) => {
  const SiteFooter: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear().toString()
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>{opts.text.replaceAll("{year}", year)}</p>
        <ul>
          {Object.entries(opts.links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  SiteFooter.css = style
  return SiteFooter
}) satisfies QuartzComponentConstructor<Options>
