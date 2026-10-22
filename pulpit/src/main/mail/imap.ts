// Dwa Gmaile przez IMAP i hasło aplikacji (Konto Google, Bezpieczeństwo, Hasła do aplikacji).
// Bez własnej aplikacji OAuth w Google Cloud i bez tokenów wygasających co 7 dni.
// Pulpit tylko czyta: ostatnie wiadomości, nieprzeczytane, kto pisze. Odpowiada Kamil w Gmailu.
import { ImapFlow } from 'imapflow'
import type { Brand, MailAccount, MailItem, MailTag } from '../../shared/types'

function emailIndex(brands: Brand[]): Map<string, string> {
  const idx = new Map<string, string>()
  for (const b of brands) {
    const walk = (v: unknown): void => {
      if (typeof v === 'string') for (const m of v.matchAll(/[\w.+-]+@([\w-]+\.[\w.-]+)/g)) {
        idx.set(m[0].toLowerCase(), b.id)
        if (!/gmail|wp\.pl|o2\.pl|onet|interia|outlook|icloud/.test(m[1])) idx.set(`@${m[1].toLowerCase()}`, b.id)
      }
      else if (Array.isArray(v)) v.forEach(walk)
      else if (v && typeof v === 'object') Object.values(v).forEach(walk)
    }
    walk(b.meta)
  }
  return idx
}

export async function fetchInbox(account: MailAccount, pass: string, brands: Brand[], count = 30): Promise<MailItem[]> {
  const client = new ImapFlow({
    host: account.host ?? 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: account.user, pass },
    logger: false
  })
  const idx = emailIndex(brands)
  const out: MailItem[] = []
  await client.connect()
  const lock = await client.getMailboxLock('INBOX')
  try {
    const exists = typeof client.mailbox === 'object' ? client.mailbox.exists : 0
    if (!exists) return out
    const from = Math.max(1, exists - count + 1)
    for await (const msg of client.fetch(`${from}:*`, { envelope: true, flags: true, threadId: true, uid: true })) {
      const f = msg.envelope?.from?.[0]
      const addr = (f?.address ?? '').toLowerCase()
      const domain = addr.slice(addr.indexOf('@'))
      const brandId = idx.get(addr) ?? idx.get(domain)
      const tag: MailTag = /useme\./.test(domain) ? 'useme' : brandId ? 'klient' : 'inne'
      const thread = msg.threadId ? BigInt(msg.threadId).toString(16) : undefined
      out.push({
        accountId: account.id,
        uid: msg.uid,
        threadId: msg.threadId,
        from: addr,
        fromName: f?.name || addr,
        subject: msg.envelope?.subject ?? '(bez tematu)',
        date: new Date(msg.envelope?.date ?? Date.now()).toISOString(),
        snippet: '',
        unread: !msg.flags?.has('\\Seen'),
        tag,
        brandId,
        webUrl: `https://mail.google.com/mail/u/${account.webIndex ?? 0}/${thread ? `#inbox/${thread}` : '#inbox'}`
      })
    }
  } finally {
    lock.release()
    await client.logout().catch(() => {})
  }
  return out.reverse()
}
