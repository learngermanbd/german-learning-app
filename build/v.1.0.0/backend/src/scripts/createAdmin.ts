import { createClient } from '@supabase/supabase-js';
import prisma from '../config/database.js';
import { env } from '../config/env.js';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdmin() {
  const email = 'admin@admin.com';
  const password = 'admin123';

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existing = users.find((u: any) => u.email === email);
    if (existing) {
      const user = await prisma.user.upsert({
        where: { supabaseId: existing.id },
        update: { role: 'ADMIN' },
        create: { email, name: 'Admin', role: 'ADMIN', supabaseId: existing.id },
      });
      console.log(`Admin role assigned to existing user: ${user.id}`);
    }
  } else {
    await prisma.user.create({
      data: { email, name: 'Admin', role: 'ADMIN', supabaseId: authData.user.id },
    });
    console.log(`Admin user created: ${authData.user.id}`);
  }

  console.log('Login with: admin@admin.com / admin123');
  await prisma.$disconnect();
}

createAdmin().catch((e) => { console.error(e); process.exit(1); });
