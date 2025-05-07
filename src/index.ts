// src/index.ts
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import {
  loadEmailPointer,
  saveEmailPointer,
  saveEmailFile,
} from './utils/fileUtils';
import { hashEmailContent } from './utils/hashUtils';
import dotenv from 'dotenv';
dotenv.config();

const imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASSWORD,
  host: process.env.IMAP_HOST,
  port: Number(process.env.IMAP_PORT),
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
});

function openInbox(cb: Function) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function () {
  openInbox(function (err: any, box: any) {
    if (err) throw err;

    const pointer = loadEmailPointer();

    imap.search(['ALL'], function (err, results) {
      if (err) throw err;
      const fetcher = imap.fetch(results, { bodies: '' });

      fetcher.on('message', function (msg, seqno) {
        let rawEmail = '';

        msg.on('body', function (stream) {
          stream.on('data', function (chunk) {
            rawEmail += chunk.toString('utf8');
          });
        });

        msg.once('end', async function () {
          try {
            const parsed = await simpleParser(rawEmail);
            const content = parsed.text || parsed.html || '';
            const hash = hashEmailContent(content);

            if (!pointer.hasOwnProperty(hash)) {
              await saveEmailFile(hash, content);
              pointer[hash] = new Date().toISOString();
              console.log(`Saved email: ${hash}.txt`);
              saveEmailPointer(pointer);
            } else {
              console.log(`Duplicate email skipped: ${hash}.txt`);
            }
          } catch (e) {
            console.error('Parsing error:', e);
          }
        });
      });

      fetcher.once('end', function () {
        console.log('Done fetching all messages');
        imap.end();
      });
    });
  });
});

imap.once('error', function (err) {
  console.log('IMAP Error:', err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
