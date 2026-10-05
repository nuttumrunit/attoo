# Attoo live status deployment

The frontend is already wired to read the newest row from `public.attoo_status`.

1. Revoke the API key previously shared in chat and create a new V-API key.
2. In Supabase SQL Editor, run `status-schema.sql`.
3. In Edge Functions, create `generate-attoo-status` and deploy the contents of `functions/generate-attoo-status/index.ts` with JWT verification disabled.
4. Add these Edge Function secrets:
   - `GPT_GE_API_KEY`: the new V-API key
   - `ATTOO_CRON_SECRET`: a new long random value used only by the scheduler
5. Replace `YOUR_LONG_RANDOM_CRON_SECRET` in `status-cron.sql` with the same cron secret, then run that SQL once.
6. Invoke the function once from the Supabase dashboard with header `x-cron-secret` set to the cron secret. This creates the first live status immediately.

The scheduler then invokes the function every five minutes. Every visitor reads the same newest saved status. If generation fails, the previous real status remains visible.
