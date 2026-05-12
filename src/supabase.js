import { createClient } from '@supabase/supabase-js'

   // 💡 Supabase 홈페이지 -> Project Settings (톱니바퀴) -> API 탭에 있는 주소와 키를 여기에 복사해 넣으세요!
   const supabaseUrl = 'https://pfahkneudesnmatzxknh.supabase.co'
   const supabaseKey = 'sb_publishable_gmn5H9e1yLsuC4xixUzSUg_G2nwSxE0'

   export const supabase = createClient(supabaseUrl, supabaseKey)