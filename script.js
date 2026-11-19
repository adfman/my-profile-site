// ===== 프로젝트 데이터 (여기만 수정하면 카드가 자동으로 바뀝니다) =====
const projects = [
  {
    title: '해외 장비 국내 영업 대행',
    description: '해외 제조사의 산업용 장비를 국내 고객사에 소개하고, 견적과 계약 협상을 진행했습니다.',
    tags: ['영업 대행', '계약 협상', '고객 관리'],
    link: '#contact',
    linkLabel: '문의하기',
  },
  {
    title: '소프트웨어 솔루션 파트너 발굴',
    description: '해외 SaaS 업체의 아시아 시장 진출을 위해 현지 유통 파트너를 발굴하고 연계했습니다.',
    tags: ['파트너십', '시장 조사', 'B2B'],
    link: '#contact',
    linkLabel: '문의하기',
  },
  {
    title: '소비재 수출 상담 지원',
    description: '해외 브랜드의 제품을 국내 유통사에 소개하고, 샘플 전달부터 상담 일정 조율까지 맡았습니다.',
    tags: ['수출 상담', '샘플 관리', '일정 조율'],
    link: '#contact',
    linkLabel: '문의하기',
  },
];

// ===== 프로젝트 카드 렌더링 =====
function renderProjects() {
  const list = document.getElementById('project-list');
  if (!list) return;

  list.innerHTML = projects
    .map(
      (p) => `
      <article class="reveal group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-100 hover:shadow-xl">
        <div class="mb-4 h-1.5 w-12 rounded-full bg-brand-600 transition group-hover:w-20"></div>
        <h3 class="text-xl font-bold text-slate-900">${escapeHtml(p.title)}</h3>
        <p class="mt-3 flex-1 leading-relaxed text-slate-600">${escapeHtml(p.description)}</p>
        <ul class="mt-5 flex flex-wrap gap-2">
          ${p.tags
            .map((t) => `<li class="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">${escapeHtml(t)}</li>`)
            .join('')}
        </ul>
        <a href="${escapeHtml(p.link)}" class="mt-6 inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700">
          ${escapeHtml(p.linkLabel)} <span class="ml-1 transition group-hover:translate-x-1">→</span>
        </a>
      </article>`
    )
    .join('');
}

// 간단한 HTML 이스케이프 (데이터에 특수문자가 있어도 안전하게 출력)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== 모바일 메뉴 토글 =====
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };

  toggle.addEventListener('click', () => {
    setOpen(menu.classList.contains('hidden'));
  });

  // 메뉴 항목을 누르면 자동으로 닫기
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

// ===== 헤더 그림자 (스크롤 시) =====
function setupHeaderShadow() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('shadow-md', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== 현재 섹션 메뉴 강조 =====
function setupActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('main section[id]')];
  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('text-brand-600', active);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
}

// ===== 스크롤 시 fade-in 애니메이션 =====
const revealObserver =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      )
    : null;

function observeReveals(elements) {
  elements.forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('is-visible'); // 미지원 브라우저는 바로 표시
  });
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  observeReveals(document.querySelectorAll('.reveal')); // 프로젝트 카드 포함
  setupMobileMenu();
  setupHeaderShadow();
  setupActiveNav();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
