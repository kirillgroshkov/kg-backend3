import { DEF_FROM } from '@src/cnst/email.cnst'
import { sendgridService } from '@src/srv/sendgrid.service'
import { EmailMsg } from '@src/srv/sendgrid.shared.service'

test('sendgrid send', async () => {
  const msg: EmailMsg = {
    from: DEF_FROM,
    to: {
      email: '1@inventix.ru',
      name: 'Kir',
    },
    subject: 'Testing sendgrid',
    content: '<b>Hello world</b><br><br>plain<br>text',
  }

  await sendgridService.send(msg)
})
