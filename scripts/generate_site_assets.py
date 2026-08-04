from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "site-illustrations"

INK = (17, 17, 17, 255)
CREAM = (255, 252, 242, 255)
MILK = (255, 254, 249, 255)
GREEN = (139, 192, 124, 255)
SOFT_GREEN = (220, 241, 219, 255)
ORANGE = (242, 132, 82, 255)
BLUE = (102, 169, 218, 255)
WINE = (101, 37, 53, 255)
PINK = (247, 196, 201, 255)


def ensure_dirs():
    for sub in ["intro", "tree", "titles", "vibes"]:
        (OUT / sub).mkdir(parents=True, exist_ok=True)


def canvas(w, h):
    return Image.new("RGBA", (w, h), (255, 255, 255, 0))


def jitter_points(points, amount, rng):
    return [(x + rng.uniform(-amount, amount), y + rng.uniform(-amount, amount)) for x, y in points]


def line(draw, points, width=8, fill=INK, rng=None, jitter=1.8, broken=True):
    rng = rng or random.Random(1)
    pts = jitter_points(points, jitter, rng)
    if len(pts) < 2:
        return
    for i in range(len(pts) - 1):
        if broken and rng.random() < 0.06:
            continue
        draw.line([pts[i], pts[i + 1]], fill=fill, width=width, joint="curve")
    if width >= 7:
        hair = jitter_points(points, jitter + 1.2, rng)
        for i in range(len(hair) - 1):
            if rng.random() < 0.22:
                continue
            draw.line([hair[i], hair[i + 1]], fill=fill, width=max(2, width // 4), joint="curve")


def cubic(p0, p1, p2, p3, steps=36):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        x = (
            (1 - t) ** 3 * p0[0]
            + 3 * (1 - t) ** 2 * t * p1[0]
            + 3 * (1 - t) * t**2 * p2[0]
            + t**3 * p3[0]
        )
        y = (
            (1 - t) ** 3 * p0[1]
            + 3 * (1 - t) ** 2 * t * p1[1]
            + 3 * (1 - t) * t**2 * p2[1]
            + t**3 * p3[1]
        )
        pts.append((x, y))
    return pts


def rough_polygon(draw, points, fill=CREAM, outline=INK, width=8, rng=None):
    rng = rng or random.Random(2)
    draw.polygon(points, fill=fill)
    pts = list(points) + [points[0]]
    line(draw, pts, width=width, fill=outline, rng=rng, jitter=2.1, broken=True)


def rough_ellipse(draw, box, fill=CREAM, outline=INK, width=7, rng=None):
    rng = rng or random.Random(3)
    draw.ellipse(box, fill=fill)
    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = (x1 - x0) / 2, (y1 - y0) / 2
    pts = []
    for i in range(50):
        a = math.tau * i / 50
        pts.append((cx + math.cos(a) * rx, cy + math.sin(a) * ry))
    pts.append(pts[0])
    line(draw, pts, width=width, rng=rng, jitter=1.9, broken=True)


def save_trimmed(img, path, pad=10):
    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        l, t, r, b = bbox
        l = max(0, l - pad)
        t = max(0, t - pad)
        r = min(img.width, r + pad)
        b = min(img.height, b + pad)
        img = img.crop((l, t, r, b))
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    print(path.relative_to(ROOT), img.size)


def leaf(path, tilt=0, fill=SOFT_GREEN, seed=10, size=(190, 120), stem=True):
    rng = random.Random(seed)
    img = canvas(*size)
    d = ImageDraw.Draw(img)
    w, h = size
    pts = cubic((22, h * 0.58), (w * 0.35, 4), (w * 0.74, 8), (w - 18, h * 0.54), 24)
    pts += cubic((w - 18, h * 0.54), (w * 0.72, h - 2), (w * 0.34, h - 4), (22, h * 0.58), 24)
    rough_polygon(d, pts, fill=fill, width=7, rng=rng)
    vein = cubic((28, h * 0.58), (w * 0.45, h * 0.46), (w * 0.66, h * 0.47), (w - 25, h * 0.55), 18)
    line(d, vein, width=4, rng=rng, jitter=1.2, broken=True)
    for x in [0.4, 0.56, 0.7]:
        base = (w * x, h * 0.51)
        line(d, [base, (base[0] + rng.uniform(-8, 8), base[1] - rng.uniform(18, 30))], width=3, rng=rng)
    if stem:
        line(d, [(10, h * 0.6), (31, h * 0.58)], width=6, rng=rng, jitter=1.2)
    img = img.rotate(tilt, expand=True, resample=Image.Resampling.BICUBIC)
    save_trimmed(img, path, 14)


def draw_intro():
    rng = random.Random(100)

    img = canvas(460, 180)
    d = ImageDraw.Draw(img)
    mound = cubic((54, 112), (145, 64), (290, 62), (407, 113), 38)
    mound += cubic((407, 113), (313, 151), (158, 154), (54, 112), 38)
    rough_polygon(d, mound, fill=(246, 248, 232, 255), width=9, rng=rng)
    line(d, cubic((82, 113), (160, 124), (252, 126), (360, 112), 24), width=4, fill=GREEN, rng=rng)
    for x, y in [(146, 118), (210, 104), (286, 122), (332, 110)]:
        line(d, [(x - 10, y + 5), (x + 12, y - 5)], width=3, rng=rng)
    save_trimmed(img, OUT / "intro" / "land.png", 18)

    img = canvas(250, 280)
    d = ImageDraw.Draw(img)
    line(d, cubic((125, 240), (117, 192), (121, 138), (124, 86), 24), width=8, rng=rng, jitter=1.5)
    rough_ellipse(d, (47, 90, 128, 145), fill=SOFT_GREEN, width=7, rng=rng)
    rough_ellipse(d, (124, 72, 202, 130), fill=SOFT_GREEN, width=7, rng=rng)
    line(d, [(84, 121), (123, 126)], width=4, rng=rng)
    line(d, [(130, 104), (165, 97)], width=4, rng=rng)
    rough_ellipse(d, (100, 236, 152, 255), fill=(235, 224, 203, 255), width=5, rng=rng)
    save_trimmed(img, OUT / "intro" / "seedling.png", 18)

    img = canvas(340, 260)
    d = ImageDraw.Draw(img)
    body = [(78, 79), (224, 52), (252, 155), (112, 193)]
    rough_polygon(d, body, fill=MILK, width=9, rng=rng)
    rough_ellipse(d, (98, 54, 200, 82), fill=MILK, width=7, rng=rng)
    line(d, cubic((230, 75), (280, 48), (307, 65), (310, 96), 22), width=8, rng=rng)
    line(d, cubic((256, 128), (312, 124), (310, 179), (263, 174), 22), width=7, rng=rng)
    line(d, [(62, 102), (24, 88), (65, 74)], width=8, rng=rng)
    line(d, [(128, 107), (202, 92)], width=5, fill=ORANGE, rng=rng)
    line(d, [(139, 143), (218, 126)], width=5, fill=GREEN, rng=rng)
    save_trimmed(img, OUT / "intro" / "watering-can.png", 18)

    img = canvas(430, 290)
    d = ImageDraw.Draw(img)
    arc = cubic((54, 66), (170, 6), (273, 25), (370, 144), 42)
    line(d, arc, width=5, fill=BLUE, rng=rng, jitter=2.4, broken=True)
    for x, y, r in [(86, 85, 5), (141, 47, 4), (226, 43, 6), (299, 87, 4), (355, 137, 6)]:
        rough_ellipse(d, (x - r, y - r, x + r, y + r), fill=BLUE, outline=BLUE, width=2, rng=rng)
    save_trimmed(img, OUT / "intro" / "water-arc.png", 18)


def draw_tree():
    rng = random.Random(200)

    img = canvas(330, 920)
    d = ImageDraw.Draw(img)
    trunk = [
        (132, 895),
        (111, 751),
        (118, 593),
        (131, 425),
        (123, 265),
        (150, 65),
        (182, 66),
        (184, 252),
        (202, 427),
        (203, 593),
        (222, 754),
        (205, 897),
    ]
    rough_polygon(d, trunk, fill=MILK, width=11, rng=rng)
    for p0, p1, p2, p3 in [
        ((150, 824), (139, 670), (159, 522), (148, 345)),
        ((178, 820), (171, 642), (186, 482), (173, 241)),
        ((155, 176), (161, 127), (169, 96), (179, 69)),
    ]:
        line(d, cubic(p0, p1, p2, p3, 25), width=4, rng=rng, jitter=1.3)
    for pts in [
        [(130, 876), (66, 909), (26, 899)],
        [(198, 877), (264, 912), (309, 901)],
        [(161, 884), (152, 928), (112, 938)],
    ]:
        line(d, pts, width=9, rng=rng)
    save_trimmed(img, OUT / "tree" / "trunk.png", 16)

    specs = [
        ("branch-main.png", (620, 220), [(24, 112), (176, 91), (340, 89), (584, 52)], 13, 201),
        ("branch-upper.png", (500, 190), [(18, 128), (145, 91), (267, 64), (456, 41)], 10, 202),
        ("branch-lower.png", (530, 210), [(18, 62), (159, 81), (304, 107), (494, 158)], 10, 203),
    ]
    for name, size, path_pts, width, seed in specs:
        rng = random.Random(seed)
        img = canvas(*size)
        d = ImageDraw.Draw(img)
        center = cubic(path_pts[0], path_pts[1], path_pts[2], path_pts[3], 40)
        line(d, center, width=width, rng=rng, jitter=2.2)
        line(d, [(center[-10][0], center[-10][1]), (size[0] - 46, center[-10][1] - 42)], width=max(6, width - 4), rng=rng)
        line(d, [(center[-14][0], center[-14][1]), (size[0] - 34, center[-14][1] + 32)], width=max(5, width - 5), rng=rng)
        save_trimmed(img, OUT / "tree" / name, 18)

    leaf(OUT / "tree" / "leaf-root.png", tilt=-9, fill=SOFT_GREEN, seed=211, size=(190, 120))
    leaf(OUT / "tree" / "leaf-branches.png", tilt=10, fill=(236, 245, 224, 255), seed=212, size=(190, 120))
    leaf(OUT / "tree" / "leaf-vibes.png", tilt=-2, fill=(226, 242, 214, 255), seed=213, size=(190, 120))
    leaf(OUT / "tree" / "leaf-single.png", tilt=18, fill=SOFT_GREEN, seed=214, size=(170, 110))
    leaf(OUT / "tree" / "leaf-small-a.png", tilt=-18, fill=(234, 247, 225, 255), seed=215, size=(130, 92))
    leaf(OUT / "tree" / "leaf-small-b.png", tilt=12, fill=(224, 240, 210, 255), seed=216, size=(136, 94))


def title_font(size):
    candidates = [
        "/System/Library/Fonts/Supplemental/Bradley Hand Bold.ttf",
        "/System/Library/Fonts/MarkerFelt.ttc",
        "/System/Library/Fonts/Supplemental/Comic Sans MS Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def draw_rough_text(text, path, seed):
    rng = random.Random(seed)
    font = title_font(86)
    bbox_probe = ImageDraw.Draw(canvas(10, 10)).textbbox((0, 0), text, font=font)
    text_w = bbox_probe[2] - bbox_probe[0]
    text_h = bbox_probe[3] - bbox_probe[1]
    img = canvas(max(720, text_w + 150), 230)
    d = ImageDraw.Draw(img)

    d.line([(34, 176), (img.width - 98, 157)], fill=SOFT_GREEN, width=18)
    d.line([(94, 190), (img.width - 36, 181)], fill=(255, 222, 194, 210), width=10)

    text_layer = canvas(img.width, 160)
    td = ImageDraw.Draw(text_layer)
    x = 38
    y = 40
    for off in [(0, 0), (2, 0), (-1, 1), (1, 2)]:
        td.text((x + off[0], y + off[1]), text, font=font, fill=INK)
    for _ in range(14):
        x0 = rng.randint(40, max(41, img.width - 130))
        y0 = rng.randint(70, 112)
        td.line(
            [(x0, y0), (x0 + rng.randint(12, 40), y0 + rng.randint(-6, 6))],
            fill=INK,
            width=rng.randint(1, 2),
        )
    text_layer = text_layer.rotate(rng.uniform(-3.5, 3.5), expand=False, resample=Image.Resampling.BICUBIC)
    img.alpha_composite(text_layer, (0, 18))

    for cx, cy, col in [(52, 46, GREEN), (img.width - 48, 66, ORANGE), (img.width - 86, 126, GREEN)]:
        rough_ellipse(d, (cx - 8, cy - 8, cx + 8, cy + 8), fill=col, outline=INK, width=3, rng=rng)
    save_trimmed(img, path, 18)


def draw_vibe_covers():
    rng = random.Random(500)
    specs = [
        ("vibe-ai-notes.png", "notes"),
        ("vibe-design-lab.png", "lab"),
        ("vibe-side-projects.png", "ship"),
    ]
    for name, label in specs:
        img = canvas(560, 350)
        d = ImageDraw.Draw(img)
        rough_polygon(d, [(42, 54), (500, 42), (516, 292), (58, 306)], fill=MILK, width=7, rng=rng)
        if label == "notes":
            line(d, [(116, 114), (430, 96)], width=6, fill=ORANGE, rng=rng)
            line(d, [(112, 166), (378, 158)], width=5, fill=INK, rng=rng)
            line(d, [(112, 215), (446, 209)], width=5, fill=INK, rng=rng)
            rough_ellipse(d, (385, 86, 448, 145), fill=SOFT_GREEN, width=6, rng=rng)
        elif label == "lab":
            rough_ellipse(d, (128, 108, 220, 228), fill=SOFT_GREEN, width=7, rng=rng)
            rough_polygon(d, [(306, 96), (414, 126), (393, 240), (286, 216)], fill=(255, 236, 218, 255), width=7, rng=rng)
            line(d, cubic((207, 168), (250, 120), (282, 228), (322, 164), 22), width=5, fill=ORANGE, rng=rng)
        else:
            line(d, [(112, 236), (442, 236)], width=7, fill=INK, rng=rng)
            rough_polygon(d, [(186, 198), (276, 98), (366, 198)], fill=SOFT_GREEN, width=8, rng=rng)
            line(d, cubic((229, 190), (278, 152), (331, 150), (384, 94), 22), width=5, fill=ORANGE, rng=rng)
        save_trimmed(img, OUT / "vibes" / name, 18)


def main():
    ensure_dirs()
    draw_intro()
    draw_tree()
    for title, name, seed in [
        ("About me", "about-me.png", 301),
        ("My Roots", "my-roots.png", 302),
        ("My Branches", "my-branches.png", 303),
        ("My Vibes", "my-vibes.png", 304),
    ]:
        draw_rough_text(title, OUT / "titles" / name, seed)
    draw_vibe_covers()


if __name__ == "__main__":
    main()
