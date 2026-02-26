import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#103745] text-white/70 pt-12 pb-7 mt-0">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 pb-10 border-b border-white/10 mb-7">
          
          {/* Brand col */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {/* Using a placeholder text logo if image is missing or just text */}
              <span className="text-2xl font-bold text-white tracking-tight">Waggy</span>
            </div>
            <p className="text-sm leading-7 text-white/50">
              پلتفرم مراقبت حرفه‌ای از حیوانات خانگی. بهترین مراقبین تاییدشده را در محله‌ی خودت پیدا کن.
            </p>
            <div className="flex gap-2.5 mt-5">
              {/* Instagram */}
              <a href="https://instagram.com/waggy" className="w-9 h-9 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center hover:bg-[#0ea5a4] hover:border-[#0ea5a4] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              {/* Twitter/X */}
              <a href="https://twitter.com/waggy" className="w-9 h-9 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center hover:bg-[#0ea5a4] hover:border-[#0ea5a4] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-9 h-9 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center hover:bg-[#0ea5a4] hover:border-[#0ea5a4] transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h4 className="text-white text-[13px] font-bold mb-4">سرویس‌ها</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/services" className="hover:text-[#0ea5a4] transition-colors">نگهداری شبانه</Link></li>
              <li><Link href="/services" className="hover:text-[#0ea5a4] transition-colors">مراقبت در منزل</Link></li>
              <li><Link href="/services" className="hover:text-[#0ea5a4] transition-colors">پیاده‌روی</Link></li>
              <li><Link href="/services" className="hover:text-[#0ea5a4] transition-colors">سرزدن کوتاه</Link></li>
              <li><Link href="/services" className="hover:text-[#0ea5a4] transition-colors">مراقبت روزانه</Link></li>
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4 className="text-white text-[13px] font-bold mb-4">شرکت</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/about" className="hover:text-[#0ea5a4] transition-colors">درباره ما</Link></li>
              <li><Link href="/auth" className="hover:text-[#0ea5a4] transition-colors">مراقب شو</Link></li>
              <li><Link href="/blog" className="hover:text-[#0ea5a4] transition-colors">وبلاگ</Link></li>
              <li><Link href="/charity" className="hover:text-[#0ea5a4] transition-colors">خیریه</Link></li>
              <li><Link href="/contact" className="hover:text-[#0ea5a4] transition-colors">تماس با ما</Link></li>
            </ul>
          </div>

          {/* Links col 3 */}
          <div>
            <h4 className="text-white text-[13px] font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/landing#faq" className="hover:text-[#0ea5a4] transition-colors">سوالات متداول</Link></li>
              <li><Link href="/privacy" className="hover:text-[#0ea5a4] transition-colors">حریم خصوصی</Link></li>
              <li><Link href="/terms" className="hover:text-[#0ea5a4] transition-colors">قوانین استفاده</Link></li>
              <li><Link href="/contact" className="hover:text-[#0ea5a4] transition-colors">گزارش مشکل</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[12.5px] text-white/35">
          <span>© ۱۴۰۳ واگی — تمام حقوق محفوظ است</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#0ea5a4] transition-colors">حریم خصوصی</Link>
            <Link href="/terms" className="hover:text-[#0ea5a4] transition-colors">شرایط استفاده</Link>
            <Link href="/contact" className="hover:text-[#0ea5a4] transition-colors">تماس</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}