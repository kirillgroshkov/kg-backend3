import got from 'got'

export interface EmailMsg {
  to: EmailAddress
  subject: string
  content: string
  contentType?: string
  from: EmailAddress
  reply_to?: EmailAddress
  cc?: EmailAddress
  bcc?: EmailAddress
}

export interface EmailContent {
  type: string // text/plain or text/html
  value: string
}

export interface EmailAddress {
  email: string
  name?: string
}

export interface SendgridPost {
  personalizations: SendgridPersonalization[]
  from: EmailAddress
  content: EmailContent[]
  subject: string
  reply_to?: EmailAddress
}

export interface SendgridPersonalization {
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
}

export interface SendgridSharedServiceCfg {
  apiKey: string
}

export class SendgridSharedService {
  constructor(public cfg: SendgridSharedServiceCfg) {}

  async send(msg: EmailMsg): Promise<void> {
    const body: SendgridPost = {
      personalizations: [
        {
          to: [msg.to],
          // cc: msg.cc,
          // bcc: msg.bcc,
        },
      ],
      from: msg.from,
      content: [
        {
          type: msg.contentType || 'text/html',
          value: msg.content,
        },
      ],
      subject: msg.subject,
      // reply_to: msg.reply_to,
    }
    // console.log(JSON.stringify(body, null, 2))

    await got.post(`https://api.sendgrid.com/v3/mail/send`, {
      headers: {
        authorization: `Bearer ${this.cfg.apiKey}`,
      },
      json: body,
    })
  }
}
