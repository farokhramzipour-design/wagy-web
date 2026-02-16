import Link from 'next/link';
import { TokenLoginBootstrap } from '../components/auth/token-login-bootstrap';

export default function HomePage() {
  return (
    <main className="container">
      <TokenLoginBootstrap />
      <section className="hero">
        <h1>وقتی کنارش نیستی، خیالت راحت باشه ❤️</h1>
        <p>
          مراقبین تاییدشده و قابل اعتماد، نزدیک تو.
          <br />
          کسی که با محبت از عضو خانواده‌ات مراقبت می‌کنه.
        </p>
        <div className="actions">
          <Link href="/auth" className="btn btn-primary">پیدا کردن مراقب مطمئن</Link>
          <Link href="/auth" className="btn btn-accent">من می‌خوام مراقب بشم</Link>
          <Link href="/app/dashboard" className="btn btn-secondary">ورود به داشبورد</Link>
        </div>
        <p className="note">احراز هویت شده • نظرات واقعی کاربران • پشتیبانی همیشه در دسترس</p>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>ما اول امنیت رو جدی می‌گیریم</h1>
        <section className="grid" style={{ marginTop: 16 }}>
          <article className="card">
            <h2>احراز هویت کامل</h2>
            <p>هر مراقب قبل از شروع فعالیت، بررسی و تایید می‌شود.</p>
          </article>
          <article className="card">
            <h2>نظرات واقعی کاربران</h2>
            <p>تجربه‌های واقعی از افرادی مثل شما.</p>
          </article>
          <article className="card">
            <h2>پرداخت امن</h2>
            <p>پرداخت فقط از طریق پلتفرم، بدون ریسک.</p>
          </article>
          <article className="card">
            <h2>پشتیبانی پاسخگو</h2>
            <p>در هر ساعت از شبانه‌روز کنار شما هستیم.</p>
          </article>
        </section>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>سرویس‌ها</h1>
        <section className="grid" style={{ marginTop: 16 }}>
          <article className="card">
            <h2>نگهداری شبانه</h2>
            <p>وقتی سفر هستی، حیوانت تو یه محیط امن و گرم می‌مونه.</p>
          </article>
          <article className="card">
            <h2>مراقبت در منزل خودت</h2>
            <p>حیوانت در فضای آشنا و راحت خودش می‌مونه.</p>
          </article>
          <article className="card">
            <h2>پیاده‌روی و بازی</h2>
            <p>تحرک، انرژی و شادی بیشتر.</p>
          </article>
          <article className="card">
            <h2>مراقبت روزانه</h2>
            <p>چند ساعت مراقبت مطمئن وقتی سرت شلوغه.</p>
          </article>
          <article className="card">
            <h2>سرزدن کوتاه</h2>
            <p>غذا دادن، تمیزکاری و نوازش با محبت.</p>
          </article>
        </section>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>چطور کار می‌کنه</h1>
        <section className="grid" style={{ marginTop: 16 }}>
          <article className="card">
            <h2>۱. جستجو کن</h2>
            <p>مراقبین اطرافت رو ببین و نظرات رو بخون.</p>
          </article>
          <article className="card">
            <h2>۲. ارتباط بگیر</h2>
            <p>قبل از رزرو، پیام بده و سوال بپرس.</p>
          </article>
          <article className="card">
            <h2>۳. با خیال راحت بسپار</h2>
            <p>مراقبت امن و پیگیری کامل.</p>
          </article>
        </section>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>تجربه کاربران</h1>
        <section className="grid" style={{ marginTop: 16 }}>
          <article className="card">
            <h2>سارا – تهران</h2>
            <p>«اولش استرس داشتم، ولی بعد از صحبت با مراقب خیالم راحت شد. هر روز عکس می‌فرستاد.»</p>
          </article>
          <article className="card">
            <h2>محمد – شیراز</h2>
            <p>«سفر رفتم بدون اینکه نگران باشم. تجربه خیلی خوبی بود.»</p>
          </article>
          <article className="card">
            <h2>نرگس – اصفهان</h2>
            <p>«رفتار مراقب خیلی محترمانه و مسئولانه بود.»</p>
          </article>
        </section>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>امنیت حیوانت اولویت ماست</h1>
        <ul className="list">
          <li>هویت مراقبین رو بررسی می‌کنیم</li>
          <li>نظارت بر کیفیت خدمات داریم</li>
          <li>پرداخت‌ها رو امن انجام می‌دیم</li>
          <li>در صورت بروز مشکل پیگیری می‌کنیم</li>
        </ul>
        <p className="note">چون اعتماد شما برای ما ارزشمنده.</p>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>عشق به حیوانات داری؟</h1>
        <p>ازش درآمد بساز.</p>
        <ul className="list">
          <li>ساعت کاری دست خودته</li>
          <li>بدون نیاز به سرمایه اولیه</li>
          <li>کار معنادار و محترمانه</li>
        </ul>
        <div className="actions">
          <Link href="/auth" className="btn btn-accent">همین امروز ثبت‌نام کن</Link>
        </div>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>سوالات پرتکرار</h1>
        <section className="grid" style={{ marginTop: 16 }}>
          <article className="card">
            <h2>آیا می‌تونم قبل از رزرو با مراقب صحبت کنم؟</h2>
            <p>بله، قبل از تایید نهایی می‌تونی پیام بدی و هماهنگ کنی.</p>
          </article>
          <article className="card">
            <h2>اگر مشکلی پیش بیاد چی؟</h2>
            <p>تیم پشتیبانی موضوع رو پیگیری می‌کنه.</p>
          </article>
          <article className="card">
            <h2>پرداخت چطور انجام میشه؟</h2>
            <p>پرداخت امن از طریق پلتفرم انجام میشه.</p>
          </article>
          <article className="card">
            <h2>اطلاعات من امن می‌مونه؟</h2>
            <p>بله، اطلاعات شما محرمانه باقی می‌مونه.</p>
          </article>
          <article className="card">
            <h2>اگر از خدمات راضی نبودم؟</h2>
            <p>موضوع بررسی و رسیدگی میشه.</p>
          </article>
        </section>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <h2>اون‌ها فقط حیوان خونگی نیستن… خانواده‌ان ❤️</h2>
          <p style={{ marginTop: 8 }}>با خیال راحت مراقب مطمئن پیدا کن</p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <Link href="/auth" className="btn btn-primary">شروع کن</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
