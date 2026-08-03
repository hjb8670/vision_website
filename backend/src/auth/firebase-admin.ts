import { InternalServerErrorException } from '@nestjs/common';
import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app: App | null = null;

/** Lazily initializes the Firebase Admin app from env vars so a missing config only breaks the Google-auth endpoint, not app boot. */
function getFirebaseApp(): App {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new InternalServerErrorException(
      'Google sign-in is not configured on the server (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY missing).',
    );
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return app;
}

export async function verifyFirebaseIdToken(idToken: string) {
  const decoded = await getAuth(getFirebaseApp()).verifyIdToken(idToken);
  return decoded;
}
