"""Generate synthetic product-UI screenshots as SVG.

PREVIEW ASSETS ONLY. These are abstract interface layouts so the device frames
can be judged with content in them. No real logos, no real brands, no numbers
presented as portfolio results.
"""
import os
import random
import math

OUT = os.environ.get('MOCK_OUT', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'))
SIZES = {'desktop': (1600, 1000), 'tablet': (1200, 1600), 'mobile': (900, 1900)}

INK, MUTED, FAINT = '#12141C', '#8B92A0', '#CFD4DB'
BORDER, SURFACE, PANEL, WHITE = '#E7E9EE', '#F6F7F9', '#FBFBFC', '#FFFFFF'


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def r(x, y, w, h, fill, rx=0, stroke=None, sw=1, op=None):
    a = f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 0):.1f}" height="{max(h, 0):.1f}" rx="{rx}" fill="{fill}"'
    if stroke:
        a += f' stroke="{stroke}" stroke-width="{sw}"'
    if op is not None:
        a += f' opacity="{op}"'
    return a + '/>'


def t(x, y, s, size=14, fill=INK, w=400, anchor='start'):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="Inter,Helvetica,Arial,sans-serif" '
            f'font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>')


def circ(cx, cy, rad, fill, op=None):
    o = f' opacity="{op}"' if op is not None else ''
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="{fill}"{o}/>'


def sk(x, y, w, h=9, fill=None, op=1.0):
    """Skeleton text line."""
    return r(x, y, w, h, fill or FAINT, rx=h / 2, op=op)


def avatar(x, y, size, accent, op=0.18):
    return (r(x, y, size, size, accent, rx=size / 2, op=op) +
            circ(x + size / 2, y + size * 0.37, size * 0.16, accent, 0.7) +
            f'<path d="M{x + size * 0.22:.1f},{y + size * 0.84:.1f} '
            f'a{size * 0.28:.1f},{size * 0.24:.1f} 0 0 1 {size * 0.56:.1f},0" '
            f'fill="{accent}" opacity="0.7"/>')


def card(x, y, w, h, rx=14):
    return r(x, y, w, h, WHITE, rx=rx, stroke=BORDER)


# --------------------------------------------------------------------------- #
#  Charts                                                                      #
# --------------------------------------------------------------------------- #

def line_chart(x, y, w, h, accent, seed, points=24):
    rnd = random.Random(seed)
    vals, cur = [], 0.42
    for _ in range(points):
        cur = min(0.93, max(0.13, cur + rnd.uniform(-0.15, 0.19)))
        vals.append(cur)
    step = w / (points - 1)
    pts = [(x + i * step, y + h - v * h) for i, v in enumerate(vals)]
    d = 'M' + ' L'.join(f'{px:.1f},{py:.1f}' for px, py in pts)
    o = []
    for i in range(1, 4):
        gy = y + h * i / 4
        o.append(f'<line x1="{x:.1f}" y1="{gy:.1f}" x2="{x + w:.1f}" y2="{gy:.1f}" stroke="{BORDER}" stroke-width="1"/>')
    o.append(f'<path d="{d} L{x + w:.1f},{y + h:.1f} L{x:.1f},{y + h:.1f} Z" fill="{accent}" opacity="0.10"/>')
    o.append(f'<path d="{d}" fill="none" stroke="{accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
    o.append(circ(pts[-1][0], pts[-1][1], 4.5, accent))
    return ''.join(o)


def bar_chart(x, y, w, h, accent, seed, n=12):
    rnd = random.Random(seed)
    gap = w / n * 0.34
    bw = (w - gap * (n - 1)) / n
    o = []
    for i in range(n):
        v = rnd.uniform(0.25, 1.0)
        o.append(r(x + i * (bw + gap), y + h - v * h, bw, v * h, accent, rx=3, op=0.25 + 0.65 * v))
    return ''.join(o)


def donut(cx, cy, rad, accent, seed):
    rnd = random.Random(seed)
    sw = rad * 0.42
    frac = rnd.uniform(0.45, 0.78)
    c = 2 * math.pi * rad
    return (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" stroke="{BORDER}" stroke-width="{sw:.1f}"/>'
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" stroke="{accent}" stroke-width="{sw:.1f}" '
            f'stroke-linecap="round" stroke-dasharray="{c * frac:.1f} {c:.1f}" transform="rotate(-90 {cx:.1f} {cy:.1f})"/>')


# --------------------------------------------------------------------------- #
#  Chrome                                                                      #
# --------------------------------------------------------------------------- #

def sidebar(w, h, accent, label, items=7):
    o = [r(0, 0, w, h, PANEL),
         f'<line x1="{w}" y1="0" x2="{w}" y2="{h}" stroke="{BORDER}" stroke-width="1"/>',
         r(22, 24, 26, 26, accent, rx=8),
         t(58, 42, label, 14, INK, 600)]
    y = 88
    for i in range(items):
        on = i == 1
        if on:
            o.append(r(12, y - 16, w - 24, 34, accent, rx=8, op=0.10))
        o.append(r(24, y - 7, 14, 14, accent if on else FAINT, rx=4))
        o.append(sk(48, y - 5, w * 0.40, 9, accent if on else FAINT, 0.85 if on else 0.8))
        y += 44
    o.append(r(12, h - 64, w - 24, 46, SURFACE, rx=10))
    o.append(avatar(24, h - 53, 24, accent))
    o.append(sk(58, h - 46, w * 0.32, 8))
    return ''.join(o)


def topbar(x, w, h, accent, title, tabs=None):
    o = [r(x, 0, w, h, WHITE),
         f'<line x1="{x}" y1="{h}" x2="{x + w}" y2="{h}" stroke="{BORDER}" stroke-width="1"/>',
         t(x + 28, h * 0.5 + 6, title, 17, INK, 600)]
    sw_ = min(280, w * 0.28)
    o.append(r(x + w - sw_ - 152, h * 0.5 - 17, sw_, 34, SURFACE, rx=17, stroke=BORDER))
    o.append(circ(x + w - sw_ - 130, h * 0.5, 5, MUTED))
    o.append(sk(x + w - sw_ - 114, h * 0.5 - 4, sw_ * 0.38, 8))
    o.append(r(x + w - 130, h * 0.5 - 16, 80, 32, accent, rx=8))
    o.append(sk(x + w - 114, h * 0.5 - 4, 48, 8, WHITE, 0.95))
    o.append(avatar(x + w - 36, h * 0.5 - 14, 28, accent))
    if tabs:
        ty, tx = h + 26, x + 28
        for i, lab in enumerate(tabs):
            wd = len(lab) * 7.0 + 6
            o.append(t(tx, ty + 5, lab, 13, INK if i == 0 else MUTED, 500 if i == 0 else 400))
            if i == 0:
                o.append(r(tx, ty + 18, wd, 2, accent, rx=1))
            tx += wd + 28
    return ''.join(o)


def statusbar(w):
    return ''.join([r(0, 0, w, 62, WHITE), t(46, 40, '9:41', 20, INK, 600),
                    r(w - 158, 22, 34, 15, INK, rx=3, op=0.8),
                    r(w - 114, 22, 26, 15, INK, rx=3, op=0.8),
                    r(w - 76, 20, 44, 19, INK, rx=5, op=0.8)])


def mobile_header(w, y, accent, title, sub=None):
    o = [t(46, y + 34, title, 30, INK, 600)]
    if sub:
        o.append(t(46, y + 66, sub, 17, MUTED, 400))
    o.append(avatar(w - 92, y + 4, 46, accent))
    return ''.join(o)


def tabbar(w, h, accent, n=4):
    y = h - 122
    o = [r(0, y, w, 122, WHITE),
         f'<line x1="0" y1="{y}" x2="{w}" y2="{y}" stroke="{BORDER}" stroke-width="1"/>']
    for i in range(n):
        cx = w * (i + 0.5) / n
        col = accent if i == 0 else FAINT
        o.append(r(cx - 16, y + 30, 32, 32, col, rx=9))
        o.append(sk(cx - 21, y + 72, 42, 7, col, 0.9 if i == 0 else 0.7))
    o.append(r(w / 2 - 70, h - 22, 140, 6, INK, rx=3, op=0.8))
    return ''.join(o)


# --------------------------------------------------------------------------- #
#  Content blocks                                                              #
# --------------------------------------------------------------------------- #

def kpi_row(x, y, w, accent, seed, n=4, h=112, labels=None):
    rnd = random.Random(seed)
    gap = 20
    cw = (w - gap * (n - 1)) / n
    o = []
    for i in range(n):
        cx = x + i * (cw + gap)
        o.append(card(cx, y, cw, h))
        o.append(sk(cx + 20, y + 22, cw * 0.42, 8))
        o.append(t(cx + 20, y + 66, f'{rnd.randint(2, 89)}.{rnd.randint(0, 9)}K', 26, INK, 600))
        up = rnd.random() > 0.35
        col = accent if up else '#C2410C'
        o.append(r(cx + 20, y + 80, 46, 16, col, rx=8, op=0.14))
        o.append(sk(cx + 27, y + 84, 32, 7, col, 0.85))
    return ''.join(o)


def chart_card(x, y, w, h, accent, seed, kind='line'):
    o = [card(x, y, w, h), sk(x + 20, y + 24, w * 0.26, 10),
         sk(x + 20, y + 42, w * 0.16, 8, FAINT, 0.7)]
    if kind == 'line':
        o.append(line_chart(x + 20, y + 70, w - 40, h - 100, accent, seed))
    elif kind == 'bar':
        o.append(bar_chart(x + 20, y + 76, w - 40, h - 106, accent, seed))
    else:
        o.append(donut(x + w * 0.32, y + h * 0.6, min(w, h) * 0.20, accent, seed))
        ly = y + h * 0.42
        for i in range(3):
            o.append(r(x + w * 0.58, ly, 10, 10, accent, rx=3, op=0.85 - i * 0.25))
            o.append(sk(x + w * 0.58 + 18, ly + 1, w * 0.24, 8))
            ly += 26
    return ''.join(o)


def table(x, y, w, h, accent, seed, rows=6, cols=4):
    rnd = random.Random(seed)
    o = [card(x, y, w, h), sk(x + 20, y + 26, w * 0.2, 10)]
    hy = y + 56
    o.append(f'<line x1="{x}" y1="{hy + 22}" x2="{x + w}" y2="{hy + 22}" stroke="{BORDER}" stroke-width="1"/>')
    colw = (w - 40) / cols
    for c in range(cols):
        o.append(sk(x + 20 + c * colw, hy + 8, colw * 0.42, 7, FAINT, 0.75))
    ry = hy + 46
    step = (h - (ry - y) - 16) / rows
    for i in range(rows):
        if i % 2 == 1:
            o.append(r(x + 1, ry - 14, w - 2, step, SURFACE))
        o.append(avatar(x + 20, ry - 11, 22, accent))
        o.append(sk(x + 50, ry - 5, colw * 0.5, 9))
        for c in range(1, cols):
            if c == cols - 1:
                bw = colw * 0.42
                o.append(r(x + 20 + c * colw, ry - 9, bw, 18, accent, rx=9, op=0.13))
                o.append(sk(x + 26 + c * colw, ry - 5, bw * 0.6, 7, accent, 0.8))
            else:
                o.append(sk(x + 20 + c * colw, ry - 5, colw * rnd.uniform(0.35, 0.6), 8, FAINT, 0.8))
        ry += step
    return ''.join(o)


def list_rows(x, y, w, accent, seed, n=5, h=92, money=False, thumb=False):
    rnd = random.Random(seed)
    o = []
    for i in range(n):
        ry = y + i * (h + 14)
        o.append(card(x, ry, w, h))
        if thumb:
            o.append(r(x + 14, ry + 14, h - 28, h - 28, accent, rx=10, op=0.13))
            o.append(r(x + 26, ry + 30, h - 52, 6, accent, rx=3, op=0.4))
            tx = x + h + 6
        else:
            o.append(avatar(x + 18, ry + h / 2 - 20, 40, accent))
            tx = x + 74
        o.append(sk(tx, ry + h * 0.32, w * rnd.uniform(0.28, 0.44), 10))
        o.append(sk(tx, ry + h * 0.56, w * rnd.uniform(0.18, 0.3), 8, FAINT, 0.7))
        if money:
            sign = '+' if rnd.random() > 0.45 else '−'
            col = accent if sign == '+' else INK
            o.append(t(x + w - 22, ry + h * 0.5 + 6, f'{sign}{rnd.randint(12, 940)}.{rnd.randint(10, 99)}',
                       17, col, 600, anchor='end'))
        else:
            bw = w * 0.16
            o.append(r(x + w - bw - 20, ry + h / 2 - 12, bw, 24, accent, rx=12, op=0.13))
            o.append(sk(x + w - bw - 8, ry + h / 2 - 4, bw * 0.6, 8, accent, 0.85))
    return ''.join(o)


def card_grid(x, y, w, accent, seed, cols=3, rows=2, ch=250, media=0.56):
    rnd = random.Random(seed)
    gap = 22
    cw = (w - gap * (cols - 1)) / cols
    o = []
    for i in range(cols * rows):
        cx = x + (i % cols) * (cw + gap)
        cy = y + (i // cols) * (ch + gap)
        o.append(card(cx, cy, cw, ch))
        mh = ch * media
        o.append(f'<path d="M{cx:.1f},{cy + 14:.1f} a14,14 0 0 1 14,-14 h{cw - 28:.1f} a14,14 0 0 1 14,14 '
                 f'v{mh - 14:.1f} h{-cw:.1f} Z" fill="{accent}" opacity="{0.10 + (i % 3) * 0.05:.2f}"/>')
        o.append(circ(cx + cw * 0.5, cy + mh * 0.5, min(cw, mh) * 0.13, accent, 0.28))
        o.append(sk(cx + 18, cy + mh + 26, cw * rnd.uniform(0.5, 0.78), 10))
        o.append(sk(cx + 18, cy + mh + 48, cw * rnd.uniform(0.3, 0.5), 8, FAINT, 0.7))
        by = cy + ch - 30
        o.append(r(cx + 18, by, cw * 0.3, 20, accent, rx=10, op=0.14))
        o.append(sk(cx + 26, by + 6, cw * 0.18, 7, accent, 0.85))
    return ''.join(o)


def progress_rows(x, y, w, accent, seed, n=4, h=86):
    rnd = random.Random(seed)
    o = []
    for i in range(n):
        ry = y + i * (h + 14)
        o.append(card(x, ry, w, h))
        o.append(r(x + 16, ry + 16, h - 32, h - 32, accent, rx=10, op=0.14))
        o.append(sk(x + h + 4, ry + 22, w * rnd.uniform(0.3, 0.46), 10))
        pct = rnd.uniform(0.2, 0.92)
        bx, bw = x + h + 4, w - h - 76
        o.append(r(bx, ry + h - 30, bw, 8, BORDER, rx=4))
        o.append(r(bx, ry + h - 30, bw * pct, 8, accent, rx=4))
        o.append(t(x + w - 20, ry + h - 22, f'{int(pct * 100)}%', 13, MUTED, 500, anchor='end'))
    return ''.join(o)


def chat_thread(x, y, w, h, accent, seed):
    rnd = random.Random(seed)
    o = []
    cy = y
    for i in range(6):
        user = i % 2 == 1
        bw = w * rnd.uniform(0.42, 0.78)
        lines = rnd.randint(2, 4)
        bh = 26 + lines * 20
        if cy + bh > y + h:
            break
        bx = x + w - bw if user else x + 52
        o.append(r(bx, cy, bw, bh, accent if user else WHITE, rx=14,
                   stroke=None if user else BORDER, op=0.12 if user else None))
        if not user:
            o.append(r(x, cy, 38, 38, accent, rx=11, op=0.9))
            o.append(circ(x + 19, cy + 19, 8, WHITE, 0.9))
        for ln in range(lines):
            o.append(sk(bx + 16, cy + 18 + ln * 20, (bw - 32) * (0.95 if ln < lines - 1 else rnd.uniform(0.4, 0.7)),
                        8, INK if user else FAINT, 0.35 if user else 0.85))
        cy += bh + 20
    iy = y + h - 60
    o.append(r(x, iy, w, 56, WHITE, rx=28, stroke=BORDER))
    o.append(sk(x + 26, iy + 24, w * 0.3, 9))
    o.append(r(x + w - 66, iy + 10, 36, 36, accent, rx=18))
    return ''.join(o)


def kanban(x, y, w, h, accent, seed, cols=4):
    rnd = random.Random(seed)
    gap = 18
    cw = (w - gap * (cols - 1)) / cols
    o = []
    for c in range(cols):
        cx = x + c * (cw + gap)
        o.append(r(cx, y, cw, h, SURFACE, rx=12))
        o.append(sk(cx + 16, y + 20, cw * 0.42, 9))
        o.append(r(cx + cw - 44, y + 14, 28, 18, accent, rx=9, op=0.14))
        cy = y + 50
        for _ in range(rnd.randint(2, 4)):
            ch = rnd.randint(96, 124)
            if cy + ch > y + h - 12:
                break
            o.append(card(cx + 10, cy, cw - 20, ch, rx=10))
            o.append(r(cx + 24, cy + 16, cw * 0.24, 14, accent, rx=7, op=0.16))
            o.append(sk(cx + 24, cy + 44, cw * 0.6, 9))
            o.append(sk(cx + 24, cy + 62, cw * 0.4, 8, FAINT, 0.7))
            o.append(avatar(cx + 24, cy + ch - 38, 24, accent))
            cy += ch + 12
    return ''.join(o)


def marketing(x, y, w, h, accent, seed, narrow=False):
    """Marketing page: hero, CTA pair, feature cards, logo strip."""
    rnd = random.Random(seed)
    o = []
    hero_h = h * (0.34 if not narrow else 0.26)
    o.append(r(x, y, w, hero_h, accent, rx=16, op=0.09))
    lines = 2 if narrow else 2
    ly = y + hero_h * 0.24
    for i in range(lines):
        o.append(r(x + w * 0.07, ly, w * (0.62 if i == 0 else 0.44), 20 if not narrow else 16,
                   accent, rx=10, op=0.75))
        ly += 30 if not narrow else 24
    o.append(sk(x + w * 0.07, ly + 6, w * 0.5, 9, accent, 0.35))
    by = y + hero_h - (58 if not narrow else 50)
    o.append(r(x + w * 0.07, by, w * (0.2 if not narrow else 0.34), 38, accent, rx=19))
    o.append(sk(x + w * 0.07 + 22, by + 15, w * (0.11 if not narrow else 0.2), 8, WHITE, 0.95))
    o.append(r(x + w * (0.29 if not narrow else 0.45), by, w * (0.18 if not narrow else 0.3), 38,
               WHITE, rx=19, stroke=BORDER))
    o.append(sk(x + w * (0.29 if not narrow else 0.45) + 22, by + 15, w * (0.09 if not narrow else 0.16), 8))

    cy = y + hero_h + (34 if not narrow else 26)
    cols = 1 if narrow else 3
    gap = 20
    cw = (w - gap * (cols - 1)) / cols
    ch = min(160, (y + h - cy - (70 if not narrow else 40)) / (2 if narrow else 1) - gap)
    for i in range(cols * (2 if narrow else 1)):
        cx = x + (i % cols) * (cw + gap)
        ccy = cy + (i // cols) * (ch + gap)
        o.append(card(cx, ccy, cw, ch))
        o.append(r(cx + 20, ccy + 20, 34, 34, accent, rx=10, op=0.18))
        o.append(sk(cx + 20, ccy + 68, cw * rnd.uniform(0.4, 0.6), 10))
        o.append(sk(cx + 20, ccy + 90, cw * 0.72, 8, FAINT, 0.7))
        o.append(sk(cx + 20, ccy + 108, cw * 0.5, 8, FAINT, 0.7))

    ly = y + h - (44 if not narrow else 34)
    n = 3 if narrow else 5
    for i in range(n):
        o.append(r(x + i * (w / n), ly, w / n - 26, 18, FAINT, rx=6, op=0.6))
    return ''.join(o)


def components_sheet(x, y, w, h, accent, seed):
    """Design-system component sheet: swatches, buttons, inputs, chips."""
    o = [sk(x, y, w * 0.14, 11)]
    cy = y + 30
    sw = (w - 9 * 14) / 10
    for i in range(10):
        shade = 0.08 + i * 0.10
        o.append(r(x + i * (sw + 14), cy, sw, 62, accent, rx=8, op=min(shade, 1)))
    cy += 96
    o.append(sk(x, cy, w * 0.11, 11))
    cy += 28
    bx = x
    for i, bw in enumerate([120, 132, 108, 96]):
        fill = accent if i == 0 else WHITE
        o.append(r(bx, cy, bw, 42, fill, rx=8, stroke=None if i == 0 else BORDER))
        o.append(sk(bx + 20, cy + 17, bw - 40, 8, WHITE if i == 0 else FAINT, 0.95 if i == 0 else 0.9))
        bx += bw + 18
    cy += 74
    o.append(sk(x, cy, w * 0.13, 11))
    cy += 28
    fw = (w - 24) / 2
    for i in range(2):
        fx = x + i * (fw + 24)
        o.append(sk(fx, cy, fw * 0.3, 8, FAINT, 0.8))
        o.append(r(fx, cy + 16, fw, 46, WHITE, rx=8, stroke=accent if i == 0 else BORDER,
                   sw=2 if i == 0 else 1))
        o.append(sk(fx + 16, cy + 35, fw * 0.4, 8))
    cy += 100
    o.append(sk(x, cy, w * 0.1, 11))
    cy += 28
    chx = x
    for i in range(6):
        cwid = 78 + (i % 3) * 26
        o.append(r(chx, cy, cwid, 32, accent, rx=16, op=0.10 + (i % 3) * 0.06))
        o.append(sk(chx + 16, cy + 12, cwid - 32, 8, accent, 0.8))
        chx += cwid + 14
    if cy + 90 < y + h:
        cy += 66
        o.append(sk(x, cy, w * 0.16, 11))
        cy += 28
        o.append(card(x, cy, w, min(y + h - cy - 4, 120)))
        o.append(sk(x + 20, cy + 26, w * 0.3, 10))
        o.append(sk(x + 20, cy + 50, w * 0.55, 8, FAINT, 0.75))
        o.append(sk(x + 20, cy + 70, w * 0.42, 8, FAINT, 0.75))
    return ''.join(o)


# --------------------------------------------------------------------------- #
#  Screen compositions                                                         #
# --------------------------------------------------------------------------- #

def render(kind, platform, accent, label, seed):
    W, H = SIZES[platform]
    body = [r(0, 0, W, H, SURFACE)]

    if kind == 'marketing':
        if platform == 'mobile':
            body.append(r(0, 0, W, H, WHITE))
            body.append(statusbar(W))
            body.append(t(46, 118, label, 24, INK, 600))
            body.append(r(W - 110, 96, 56, 30, SURFACE, rx=8, stroke=BORDER))
            body.append(marketing(46, 160, W - 92, H - 200, accent, seed, narrow=True))
        else:
            nav = 78
            body.append(r(0, 0, W, H, WHITE))
            body.append(r(0, 0, W, nav, WHITE))
            body.append(f'<line x1="0" y1="{nav}" x2="{W}" y2="{nav}" stroke="{BORDER}"/>')
            body.append(t(48, nav * 0.5 + 7, label, 19, INK, 600))
            nx = W * 0.45
            for _ in range(4):
                body.append(sk(nx, nav * 0.5 - 4, 62, 9))
                nx += 82
            body.append(r(W - 168, nav * 0.5 - 18, 120, 36, accent, rx=18))
            body.append(sk(W - 144, nav * 0.5 - 4, 72, 8, WHITE, 0.95))
            body.append(marketing(48, nav + 40, W - 96, H - nav - 80, accent, seed))
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
                f'{"".join(body)}</svg>')

    if platform == 'desktop':
        sw = 250
        tb = 72
        has_tabs = kind in ('dashboard', 'schedule', 'kanban', 'listings', 'courses')
        body.append(sidebar(sw, H, accent, label))
        tabs = {'dashboard': ['Overview', 'Reports', 'Segments', 'Alerts'],
                'schedule': ['Today', 'Upcoming', 'History', 'Messages'],
                'kanban': ['Pipeline', 'Candidates', 'Interviews', 'Offers'],
                'listings': ['Map', 'List', 'Saved', 'Alerts'],
                'courses': ['My courses', 'Catalogue', 'Progress', 'Certificates']}.get(kind)
        body.append(topbar(sw, W - sw, tb, accent, label, tabs))
        cx = sw + 32
        cy = tb + (52 if has_tabs else 28)
        cw = W - sw - 64
        ch = H - cy - 32
        body.append(_desktop_content(kind, cx, cy, cw, ch, accent, seed))

    elif platform == 'tablet':
        tb = 78
        body.append(topbar(0, W, tb, accent, label,
                           ['Overview', 'Reports', 'Team'] if kind == 'dashboard' else None))
        cy = tb + (52 if kind == 'dashboard' else 26)
        body.append(_tablet_content(kind, 28, cy, W - 56, H - cy - 28, accent, seed))

    else:
        body.append(r(0, 0, W, H, SURFACE))
        body.append(statusbar(W))
        body.append(mobile_header(W, 96, accent, label, 'This week'))
        cy = 210
        body.append(_mobile_content(kind, 46, cy, W - 92, H - cy - 140, accent, seed))
        body.append(tabbar(W, H, accent))

    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
            f'{"".join(body)}</svg>')


def _desktop_content(kind, x, y, w, h, accent, seed):
    o = []
    if kind == 'dashboard':
        o.append(kpi_row(x, y, w, accent, seed))
        cy = y + 132
        left = w * 0.62
        o.append(chart_card(x, cy, left, h - 132 - 20 - 220, accent, seed + 1, 'line'))
        o.append(chart_card(x + left + 20, cy, w - left - 20, h - 132 - 20 - 220, accent, seed + 2, 'donut'))
        o.append(table(x, cy + (h - 132 - 20 - 220) + 20, w, 220, accent, seed + 3, rows=4))
    elif kind == 'checkout':
        left = w * 0.58
        o.append(card(x, y, left, h))
        o.append(sk(x + 24, y + 32, left * 0.3, 12))
        fy = y + 70
        for i in range(4):
            o.append(sk(x + 24, fy, left * 0.2, 8, FAINT, 0.8))
            o.append(r(x + 24, fy + 16, left - 48, 48, WHITE, rx=8,
                       stroke=accent if i == 1 else BORDER, sw=2 if i == 1 else 1))
            o.append(sk(x + 40, fy + 36, left * 0.34, 9))
            fy += 88
        o.append(r(x + 24, fy + 4, left - 48, 52, accent, rx=8))
        o.append(sk(x + left / 2 - 60, fy + 25, 120, 10, WHITE, 0.95))
        rx_ = x + left + 24
        rw = w - left - 24
        o.append(card(rx_, y, rw, h * 0.72))
        o.append(sk(rx_ + 22, y + 30, rw * 0.4, 11))
        iy = y + 62
        for _ in range(3):
            o.append(r(rx_ + 22, iy, 64, 64, accent, rx=10, op=0.13))
            o.append(sk(rx_ + 100, iy + 14, rw * 0.36, 9))
            o.append(sk(rx_ + 100, iy + 36, rw * 0.22, 8, FAINT, 0.7))
            iy += 82
        o.append(f'<line x1="{rx_ + 22}" y1="{iy + 6}" x2="{rx_ + rw - 22}" y2="{iy + 6}" stroke="{BORDER}"/>')
        o.append(sk(rx_ + 22, iy + 28, rw * 0.24, 9))
        o.append(t(rx_ + rw - 22, iy + 38, '1,248.00', 22, INK, 600, anchor='end'))
    elif kind == 'components':
        o.append(card(x, y, w, h))
        o.append(components_sheet(x + 32, y + 34, w - 64, h - 68, accent, seed))
    elif kind == 'schedule':
        left = w * 0.36
        o.append(card(x, y, left, h))
        o.append(sk(x + 22, y + 30, left * 0.4, 11))
        gx, gy = x + 22, y + 62
        cell = (left - 44) / 7
        for i in range(7):
            o.append(sk(gx + i * cell + 4, gy, cell * 0.5, 7, FAINT, 0.7))
        gy += 22
        for wk in range(5):
            for d in range(7):
                on = wk == 2 and d == 3
                o.append(r(gx + d * cell, gy + wk * (cell * 0.86), cell - 6, cell * 0.86 - 6,
                           accent if on else SURFACE, rx=8, op=1 if on else 0.9))
        o.append(kpi_row(x, y + h - 118, left, accent, seed + 5, n=2, h=112))
        o.append(list_rows(x + left + 24, y, w - left - 24, accent, seed + 1, n=4, h=100))
    elif kind == 'kanban':
        o.append(kanban(x, y, w, h, accent, seed))
    elif kind == 'chat':
        left = w * 0.28
        o.append(card(x, y, left, h))
        o.append(sk(x + 20, y + 28, left * 0.5, 10))
        ly = y + 58
        for i in range(6):
            if i == 0:
                o.append(r(x + 10, ly - 10, left - 20, 52, accent, rx=10, op=0.10))
            o.append(avatar(x + 22, ly, 32, accent))
            o.append(sk(x + 64, ly + 6, left * 0.42, 9))
            o.append(sk(x + 64, ly + 24, left * 0.28, 7, FAINT, 0.7))
            ly += 62
        o.append(card(x + left + 24, y, w - left - 24, h))
        o.append(chat_thread(x + left + 24 + 32, y + 32, w - left - 24 - 64, h - 64, accent, seed))
    elif kind == 'listings':
        left = w * 0.44
        o.append(card(x, y, left, h))
        o.append(sk(x + 20, y + 28, left * 0.34, 10))
        o.append(list_rows(x + 16, y + 52, left - 32, accent, seed, n=3, h=124, thumb=True))
        mx = x + left + 24
        mw = w - left - 24
        o.append(r(mx, y, mw, h, accent, rx=14, op=0.08))
        rnd = random.Random(seed)
        for i in range(14):
            o.append(f'<path d="M{mx + rnd.uniform(0, mw):.1f},{y + rnd.uniform(0, h):.1f} '
                     f'l{rnd.uniform(40, 180):.1f},{rnd.uniform(-60, 60):.1f}" stroke="{WHITE}" '
                     f'stroke-width="{rnd.choice([3, 5, 8])}" opacity="0.7" stroke-linecap="round"/>')
        for i in range(6):
            px, py = mx + rnd.uniform(60, mw - 60), y + rnd.uniform(60, h - 60)
            o.append(f'<path d="M{px:.1f},{py:.1f} c-16,-22 -22,-30 -22,-42 a22,22 0 1 1 44,0 '
                     f'c0,12 -6,20 -22,42 Z" fill="{accent}" opacity="{0.55 + i * 0.07:.2f}"/>')
            o.append(circ(px, py - 42, 7, WHITE))
    else:  # courses
        o.append(kpi_row(x, y, w, accent, seed, n=3, h=104))
        o.append(card_grid(x, y + 124, w, accent, seed + 2, cols=3, rows=1, ch=232))
        o.append(progress_rows(x, y + 380, w, accent, seed + 3, n=min(3, max(1, int((h - 380) // 100)))))
    return ''.join(o)


def _tablet_content(kind, x, y, w, h, accent, seed):
    o = []
    if kind == 'dashboard':
        o.append(kpi_row(x, y, w, accent, seed, n=2, h=124))
        o.append(chart_card(x, y + 148, w, 340, accent, seed + 1, 'line'))
        o.append(chart_card(x, y + 508, w * 0.48, 300, accent, seed + 2, 'bar'))
        o.append(chart_card(x + w * 0.52, y + 508, w * 0.48, 300, accent, seed + 3, 'donut'))
        o.append(table(x, y + 828, w, h - 828 - 10, accent, seed + 4, rows=4, cols=3))
    elif kind == 'schedule':
        o.append(card(x, y, w, 420))
        o.append(sk(x + 24, y + 34, w * 0.3, 11))
        cell = (w - 48) / 7
        gy = y + 74
        for i in range(7):
            o.append(sk(x + 24 + i * cell + 6, gy, cell * 0.44, 7, FAINT, 0.7))
        gy += 24
        for wk in range(4):
            for d in range(7):
                on = wk == 1 and d == 4
                o.append(r(x + 24 + d * cell, gy + wk * 78, cell - 8, 70, accent if on else SURFACE, rx=10))
        o.append(list_rows(x, y + 448, w, accent, seed + 1, n=6, h=112))
    elif kind == 'kanban':
        o.append(kanban(x, y, w, h * 0.62, accent, seed, cols=2))
        o.append(list_rows(x, y + h * 0.62 + 24, w, accent, seed + 2, n=3, h=104))
    elif kind == 'components':
        o.append(card(x, y, w, h))
        o.append(components_sheet(x + 30, y + 34, w - 60, h - 68, accent, seed))
    else:  # courses
        o.append(kpi_row(x, y, w, accent, seed, n=2, h=124))
        o.append(card_grid(x, y + 148, w, accent, seed + 1, cols=2, rows=2, ch=290))
        o.append(progress_rows(x, y + 148 + 2 * 290 + 44, w, accent, seed + 2, n=3, h=94))
    return ''.join(o)


def _mobile_content(kind, x, y, w, h, accent, seed):
    o = []
    if kind == 'banking':
        o.append(r(x, y, w, 260, accent, rx=22))
        o.append(sk(x + 34, y + 40, w * 0.3, 11, WHITE, 0.6))
        o.append(t(x + 34, y + 108, '12,480.55', 46, WHITE, 600))
        o.append(sk(x + 34, y + 138, w * 0.42, 10, WHITE, 0.45))
        for i in range(3):
            bx = x + 34 + i * ((w - 68) / 3)
            o.append(r(bx, y + 180, (w - 68) / 3 - 16, 52, WHITE, rx=14, op=0.2))
            o.append(sk(bx + 18, y + 202, (w - 68) / 3 - 52, 8, WHITE, 0.7))
        o.append(sk(x, y + 306, w * 0.34, 13))
        o.append(list_rows(x, y + 336, w, accent, seed, n=max(2, int((h - 336) // 118)), h=104, money=True))
    elif kind == 'dashboard':
        o.append(kpi_row(x, y, w, accent, seed, n=2, h=136))
        o.append(chart_card(x, y + 160, w, 330, accent, seed + 1, 'line'))
        o.append(chart_card(x, y + 512, w, 300, accent, seed + 2, 'bar'))
        rem = h - 832
        if rem > 160:
            o.append(list_rows(x, y + 836, w, accent, seed + 3, n=int(rem // 118), h=104))
    elif kind == 'checkout':
        for i in range(3):
            on = i == 1
            cxp = x + 16 + i * ((w - 32) / 3)
            o.append(circ(cxp + 18, y + 18, 18, accent, 1 if i <= 1 else 0.2))
            if i < 2:
                o.append(r(cxp + 40, y + 15, (w - 32) / 3 - 60, 6, accent, rx=3, op=1 if i == 0 else 0.2))
        o.append(sk(x, y + 74, w * 0.4, 13))
        fy = y + 112
        for i in range(3):
            o.append(sk(x, fy, w * 0.24, 9, FAINT, 0.8))
            o.append(r(x, fy + 18, w, 76, WHITE, rx=12, stroke=accent if i == 0 else BORDER,
                       sw=2 if i == 0 else 1))
            o.append(sk(x + 24, fy + 50, w * 0.42, 10))
            fy += 126
        o.append(card(x, fy + 10, w, 190))
        iy = fy + 34
        for _ in range(2):
            o.append(r(x + 22, iy, 66, 66, accent, rx=12, op=0.13))
            o.append(sk(x + 106, iy + 16, w * 0.4, 10))
            o.append(sk(x + 106, iy + 40, w * 0.26, 8, FAINT, 0.7))
            iy += 84
        o.append(r(x, fy + 224, w, 84, accent, rx=14))
        o.append(sk(x + w / 2 - 80, fy + 260, 160, 11, WHITE, 0.95))
    elif kind == 'components':
        o.append(card(x, y, w, h))
        o.append(components_sheet(x + 30, y + 30, w - 60, h - 60, accent, seed))
    elif kind == 'chat':
        o.append(card(x, y, w, h))
        o.append(chat_thread(x + 28, y + 28, w - 56, h - 56, accent, seed))
    elif kind == 'schedule':
        o.append(card(x, y, w, 236))
        o.append(sk(x + 26, y + 36, w * 0.36, 11))
        cell = (w - 52) / 7
        for d in range(7):
            on = d == 3
            o.append(r(x + 26 + d * cell, y + 70, cell - 8, 120, accent if on else SURFACE, rx=12))
            o.append(sk(x + 30 + d * cell, y + 84, cell - 20, 7, WHITE if on else FAINT, 0.8))
        o.append(sk(x, y + 276, w * 0.4, 13))
        o.append(list_rows(x, y + 306, w, accent, seed, n=max(2, int((h - 306) // 122)), h=108))
    elif kind == 'listings':
        o.append(r(x, y, w, 96, WHITE, rx=48, stroke=BORDER))
        o.append(circ(x + 46, y + 48, 11, MUTED))
        o.append(sk(x + 72, y + 42, w * 0.4, 11))
        o.append(card_grid(x, y + 128, w, accent, seed, cols=1,
                           rows=max(1, int((h - 128) // 330)), ch=310, media=0.6))
    else:  # courses
        o.append(kpi_row(x, y, w, accent, seed, n=2, h=132))
        o.append(sk(x, y + 176, w * 0.36, 13))
        o.append(card_grid(x, y + 206, w, accent, seed + 1, cols=1, rows=1, ch=330, media=0.6))
        o.append(sk(x, y + 570, w * 0.32, 13))
        rem = h - 600
        o.append(progress_rows(x, y + 600, w, accent, seed + 2, n=max(1, int(rem // 108)), h=94))
    return ''.join(o)


# --------------------------------------------------------------------------- #

# One accent across all five: they are a single platform, and previews that
# share a palette say so. Teal, matching the CheckMed mark.
TEAL = '#0E8E9E'

PROJECTS = [
    # Neuromotion
    ('query-ai',             'dashboard', '#4F46E5', 'Query.ai',        ['desktop']),
    ('fleet-management',     'listings',  '#B45309', 'Fleet',           ['desktop', 'mobile']),
    ('roll-shop-management', 'kanban',    '#475569', 'Roll Shop',       ['desktop']),
    ('neuromotion-website',  'marketing', '#0891B2', 'Neuromotion',     ['desktop', 'mobile']),
    ('investor-site',        'marketing', '#166534', 'Investor Site',   ['desktop', 'mobile']),
    # CheckMed — one platform, so one shared accent.
    ('design-system',   'components', TEAL,     'Design System',   ['desktop', 'tablet', 'mobile']),
    ('policy-creator',  'checkout',  TEAL,      'Policy Creator',  ['desktop', 'tablet']),
    ('user-portal',     'courses',   TEAL,      'User Portal',     ['desktop', 'tablet', 'mobile']),
    ('business-portal', 'dashboard', TEAL,      'Business Portal', ['desktop', 'tablet']),
    ('vendor-portal',   'schedule',  TEAL,      'Vendor Portal',   ['desktop', 'mobile']),
    ('control-panel',   'dashboard', TEAL,      'Control Panel',   ['desktop']),
    # Nityom — separate products, so each gets its own colour.
    ('kaamhai',         'dashboard', '#2563EB', 'KaamHai',         ['desktop', 'mobile']),
    ('role-app',        'listings',  '#BE123C', 'Role',            ['mobile']),
    ('meetx',           'schedule',  '#7C3AED', 'MeetX',           ['mobile']),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    n = 0
    for i, (pid, kind, accent, label, platforms) in enumerate(PROJECTS):
        for j, platform in enumerate(platforms):
            # Two variants per platform: the lead shot, and a "-b" second state
            # for the case-study gallery, so the same picture never appears twice.
            for suffix, bump in (('', 0), ('-b', 641)):
                svg = render(kind, platform, accent, label, seed=i * 97 + j * 13 + 5 + bump)
                path = os.path.join(OUT, f'{pid}-{platform}{suffix}.svg')
                with open(path, 'w') as f:
                    f.write(svg)
                n += 1
    print(f'{n} preview screens written to {OUT}')


if __name__ == '__main__':
    main()
