import { MarkedOptions } from 'marked'
import * as marked from 'marked'
const sanitizeHtml = require('sanitize-html')

const markedOpt: MarkedOptions = {
  headerIds: false,
  sanitizer: sanitizeHtml,
}

export const markdownMapper = (v?: string) => (v ? marked(v.trim(), markedOpt) : undefined)
