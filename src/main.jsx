import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Sun } from "lucide-react";
import "./index.css";

const siteIllustrations = import.meta.glob(
  [
    "../assets/site-illustrations/**/*.png",
    "../assets/site-illustrations/**/*.jpg",
    "!../assets/site-illustrations/**/*source-alpha.png",
  ],
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

const asset = (path) => siteIllustrations[`../assets/site-illustrations/${path}`];

const introAssets = {
  land: asset("intro/land.png"),
  seedling: asset("intro/seedling.png"),
  wateringCan: asset("intro/watering-can.png"),
  waterArc: asset("intro/water-arc.png"),
};

const treeAssets = {
  trunk: asset("tree/trunk.png"),
  branchUpper: asset("tree/branch-upper.png"),
  branchLower: asset("tree/branch-lower.png"),
  leafRoot: asset("tree/leaf-root.png"),
  leafVibes: asset("tree/leaf-vibes.png"),
  leafSmallA: asset("tree/leaf-small-a.png"),
  leafSmallB: asset("tree/leaf-small-b.png"),
  leafSingle: asset("tree/leaf-single.png"),
};

const puffAssets = {
  sitting: asset("puff/puff-sitting-branch.png"),
  avatar: asset("profile/yuna-peng-cropped.png"),
};

const titleAssets = {
  about: asset("titles/about-me.png"),
  roots: asset("titles/my-roots.png"),
  vibes: asset("titles/my-vibes.png"),
};

const vibeCovers = [
  asset("vibes/vibe-visual-review-bridge.png"),
  asset("vibes/vibe-choux-world.png"),
];

const siteBase = import.meta.env.BASE_URL;

const content = {
  about: {
    name: "Yuna Peng 方园",
    detail:
      "A dreamer. A creator. A hungry soul—relentlessly curious and quick to turn ideas into action.",
  },
  roots: [
    { label: "伦敦政治经济学院 · 理学硕士", tone: "sage", emphasis: "wide" },
    { label: "英国南安普顿大学 · 理学学士", tone: "peach", emphasis: "wide" },
    {
      label: "快手 · 风险策略分析师",
      detail: "*实习",
      tone: "yellow",
      emphasis: "wide",
    },
    {
      label: "SHEIN · 商业分析师（PMO）",
      detail: "*实习",
      tone: "peach",
      emphasis: "wide",
    },
    {
      label: "Shopee · 国际化商业分析师",
      detail: "*在职",
      tone: "orange",
      emphasis: "hero",
    },
  ],
  vibes: [
    {
      title: "Visual Review Bridge",
      category: "DESIGN TOOL",
      desc: "Built for designers and developers who need to tell AI agents exactly what to change. Local visual review workbench.",
      tags: ["Visual review", "AI agents", "Design tools"],
      cover: vibeCovers[0],
      video: `${siteBase}videos/visual-review-bridge.mp4`,
    },
    {
      title: "Choux World",
      category: "AI COMPANION",
      desc: "Built for curious thinkers who want to explore any question with master minds. Your Private AI Braintrust.",
      tags: ["AI companions", "Deep thinking", "Private braintrust"],
      cover: vibeCovers[1],
      video: `${siteBase}videos/choux-world.mp4`,
    },
  ],
};

const introExit = {
  hidden: {
    opacity: 0,
    y: -24,
    scale: 0.985,
    transition: { duration: 0.38, ease: "easeOut" },
  },
};

const treeContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.24,
      delayChildren: 0.1,
    },
  },
};

const branchGroupVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const leafGroupVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const trunkVariant = {
  hidden: { opacity: 0, y: 28, scaleY: 0.78 },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

const branchVariant = {
  hidden: { opacity: 0, scaleX: 0.08 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.74, ease: "easeOut" },
  },
};

const leafVariant = {
  hidden: { opacity: 0, scale: 0.72, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.46, ease: "easeOut" },
  },
};

const puffVariant = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="min-h-screen bg-milk text-ink">
      <AnimatePresence mode="wait">
        {!introDone ? (
          <IntroScene key="intro" onDone={() => setIntroDone(true)} />
        ) : (
          <ProfilePage key="profile" />
        )}
      </AnimatePresence>
    </main>
  );
}

function IntroScene({ onDone }) {
  const [stage, setStage] = useState("idle");
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorX = useMotionValue(-120);
  const cursorY = useMotionValue(-120);
  const watering = stage !== "idle";
  const growing = stage === "growing";

  useEffect(() => {
    if (stage !== "pouring") return undefined;

    const growTimer = window.setTimeout(() => setStage("growing"), 760);

    return () => window.clearTimeout(growTimer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "growing") return undefined;

    const doneTimer = window.setTimeout(onDone, 2700);

    return () => window.clearTimeout(doneTimer);
  }, [stage, onDone]);

  const startWatering = () => {
    if (watering) return;
    setStage("pouring");
  };

  const moveWateringCursor = (event) => {
    if (event.pointerType === "touch") return;
    cursorX.set(event.clientX - 18);
    cursorY.set(event.clientY - 20);
    setCursorVisible(true);
  };

  return (
    <motion.section
      className={`intro-screen${watering ? " is-watering" : ""}`}
      exit={introExit.hidden}
      aria-labelledby="intro-title"
      onClick={startWatering}
      onPointerEnter={moveWateringCursor}
      onPointerMove={moveWateringCursor}
      onPointerLeave={() => setCursorVisible(false)}
    >
      <span className="sr-only" id="intro-title">
        点击页面浇水，观看树木生长
      </span>
      <button
        className="skip-button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDone();
        }}
      >
        跳过
      </button>

      <motion.div
        className="intro-sun"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 3, 0] }}
        transition={{
          opacity: { duration: 0.45, ease: "easeOut" },
          scale: { duration: 0.45, ease: "easeOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Sun size={88} strokeWidth={3.2} />
      </motion.div>

      <motion.div
        className="watering-cursor"
        aria-hidden="true"
        style={{ x: cursorX, y: cursorY }}
        animate={{ opacity: cursorVisible ? 1 : 0 }}
        transition={{ duration: 0.12 }}
      >
        <motion.img
          className="watering-cursor-can"
          src={introAssets.wateringCan}
          alt=""
          draggable="false"
          animate={watering ? { rotate: 18, x: 4, y: 4 } : { rotate: 0, x: 0, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        />
        <motion.img
          className="watering-cursor-water"
          src={introAssets.waterArc}
          alt=""
          draggable="false"
          initial={false}
          animate={
            stage === "pouring"
              ? {
                  opacity: [0, 1, 0.9, 0],
                  x: [0, -3, -8],
                  y: [0, 7, 18],
                  scale: [0.84, 1, 1.08],
                }
              : { opacity: 0, x: 0, y: 0, scale: 0.84 }
          }
          transition={{ duration: 0.78, ease: "easeOut" }}
        />
      </motion.div>

      <div className="intro-center">
        <motion.div
          className="intro-illustration"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.div
            className="intro-grown-tree"
            aria-hidden="true"
            initial={false}
            animate={{ opacity: growing ? 1 : 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Growth rhythm inspired by the CC BY-NC 4.0 branch reference:
                https://github.com/xxoogreymon-prog/SKILL-rainCurtain-branch-swallow */}
            <motion.img
              className="intro-grow-trunk"
              src={treeAssets.trunk}
              alt=""
              animate={{ scaleY: growing ? 1 : 0.04, opacity: growing ? 1 : 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            />
            {[
              { className: "upper-right", src: treeAssets.branchUpper, delay: 0.62, scaleX: 1 },
              { className: "upper-left", src: treeAssets.branchUpper, delay: 0.76, scaleX: -1 },
              { className: "lower-right", src: treeAssets.branchLower, delay: 0.9, scaleX: 1 },
              { className: "lower-left", src: treeAssets.branchLower, delay: 1.04, scaleX: -1 },
            ].map((branch) => (
              <motion.img
                className={`intro-grow-branch ${branch.className}`}
                src={branch.src}
                alt=""
                key={branch.className}
                animate={{
                  opacity: growing ? 1 : 0,
                  scaleX: growing ? branch.scaleX : 0,
                }}
                transition={{
                  opacity: { duration: 0.18, delay: branch.delay },
                  scaleX: { duration: 0.82, delay: branch.delay, ease: [0.22, 1, 0.36, 1] },
                }}
              />
            ))}
            {[
              { className: "leaf-one", src: treeAssets.leafSmallA, delay: 1.2, rotate: -8 },
              { className: "leaf-two", src: treeAssets.leafSmallB, delay: 1.32, rotate: 6 },
              { className: "leaf-three", src: treeAssets.leafSingle, delay: 1.44, rotate: -14 },
              { className: "leaf-four", src: treeAssets.leafSmallA, delay: 1.56, rotate: 10 },
              { className: "leaf-five", src: treeAssets.leafSingle, delay: 1.68, rotate: -4 },
              { className: "leaf-six", src: treeAssets.leafSmallB, delay: 1.8, rotate: 12 },
            ].map((leaf) => (
              <motion.img
                className={`intro-grow-leaf ${leaf.className}`}
                src={leaf.src}
                alt=""
                key={leaf.className}
                animate={{
                  opacity: growing ? 1 : 0,
                  scale: growing ? 1 : 0.25,
                  rotate: growing ? leaf.rotate : 0,
                }}
                transition={{ duration: 0.5, delay: leaf.delay, ease: "easeOut" }}
              />
            ))}
          </motion.div>
          <motion.img
            className="intro-seedling"
            src={introAssets.seedling}
            alt=""
            draggable="false"
            animate={
              stage === "idle"
                ? { scale: 1, y: 0, opacity: 1 }
                : stage === "pouring"
                  ? { scale: [1, 1.05, 1], y: [0, 3, 0], opacity: 1 }
                  : { scale: 1.18, y: -22, opacity: 0 }
            }
            transition={{
              duration: stage === "pouring" ? 0.64 : 0.42,
              ease: "easeOut",
            }}
          />
          <img
            className="intro-land"
            src={introAssets.land}
            alt=""
            draggable="false"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

function ProfilePage() {
  const gardenRef = useRef(null);

  useLayoutEffect(() => {
    const garden = gardenRef.current;
    if (!garden) return undefined;

    const contentStack = garden.querySelector(".content-stack");
    const rows = [...garden.querySelectorAll(".section-row")];
    if (!contentStack || rows.length < 2) return undefined;

    const syncTreeAnchors = () => {
      const gardenTop = garden.getBoundingClientRect().top;
      const vibesRowTop = rows[1].getBoundingClientRect().top - gardenTop;

      garden.style.setProperty(
        "--middle-branch-top",
        `${Math.max(180, vibesRowTop - 70)}px`,
      );
      garden.style.setProperty(
        "--lower-branch-top",
        `${Math.max(620, vibesRowTop + 300)}px`,
      );
    };

    const observer = new ResizeObserver(syncTreeAnchors);
    observer.observe(contentStack);
    rows.forEach((row) => observer.observe(row));
    syncTreeAnchors();

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      className="profile-page"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
      aria-label="个人主页"
    >
      <AboutBanner />

      <div className="garden-layout" ref={gardenRef}>
        <TreeAxis />
        <div className="content-stack">
          <ContentSection
            title={titleAssets.roots}
            titleLabel="My Roots"
            connectorLeaf={treeAssets.leafRoot}
            connectorDelay={1.18}
          >
            <div className="roots-tag-cloud" aria-label="个人关键词">
              {content.roots.map((item, index) => (
                <motion.span
                  className={`root-tag ${item.tone} ${item.emphasis}`}
                  key={item.label}
                  initial={{ opacity: 0, y: 12, rotate: index % 2 === 0 ? -2 : 2 }}
                  animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
                  whileHover={{ y: -5, rotate: 0, scale: 1.04 }}
                  transition={{ duration: 0.26, delay: index * 0.05, ease: "easeOut" }}
                >
                  <span>{item.label}</span>
                  {item.detail ? <small>{item.detail}</small> : null}
                </motion.span>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            title={titleAssets.vibes}
            titleLabel="My Vibes"
            connectorLeaf={treeAssets.leafVibes}
            connectorDelay={1.3}
            status={{ label: "More to come", icon: treeAssets.leafSmallA }}
          >
            <VibesShowcase />
          </ContentSection>
        </div>
      </div>
    </motion.section>
  );
}

function VibesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewItem, setPreviewItem] = useState(null);
  const activeItem = content.vibes[activeIndex];
  const total = content.vibes.length;
  const move = (direction) => {
    setActiveIndex((current) => (current + direction + total) % total);
  };

  const offsetFor = (index) => {
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  return (
    <div className="vibes-showcase">
      <div className="vibes-carousel" aria-label="项目卡片轮播">
        <button
          className="carousel-arrow previous"
          type="button"
          onClick={() => move(-1)}
          aria-label="上一个项目"
        >
          <ChevronLeft size={21} strokeWidth={2.6} />
        </button>

        <div className="vibes-deck">
          {content.vibes.map((item, index) => {
            const offset = offsetFor(index);
            const isActive = offset === 0;

            return (
              <motion.button
                className={`deck-card${isActive ? " is-active" : ""}`}
                type="button"
                key={item.title}
                onClick={() => {
                  if (isActive) {
                    setPreviewItem(item);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                aria-label={
                  isActive ? `放大查看${item.title}封面图` : `查看项目：${item.title}`
                }
                animate={{
                  x: offset * 188,
                  y: Math.abs(offset) * 16,
                  scale: isActive ? 1 : 0.84,
                  rotate: offset * 5,
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                  zIndex: isActive ? 3 : 2 - Math.abs(offset),
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <img src={item.cover} alt="" draggable="false" />
                <span>{item.category}</span>
              </motion.button>
            );
          })}
        </div>

        <button
          className="carousel-arrow next"
          type="button"
          onClick={() => move(1)}
          aria-label="下一个项目"
        >
          <ChevronRight size={21} strokeWidth={2.6} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          className="project-brief"
          key={activeItem.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <p className="project-eyebrow">
            PROJECT {String(activeIndex + 1).padStart(2, "0")}
          </p>
          <h3>{activeItem.title}</h3>
          <p className="project-description">{activeItem.desc}</p>
          {activeItem.video && (
            <video
              className="project-video"
              src={activeItem.video}
              controls
              playsInline
              preload="metadata"
            >
              Your browser does not support embedded video.
            </video>
          )}
          <div className="project-tags" aria-label="项目标签">
            {activeItem.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </motion.article>
      </AnimatePresence>

      <div className="carousel-dots" aria-label="选择项目">
        {content.vibes.map((item, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            key={item.title}
            onClick={() => setActiveIndex(index)}
            aria-label={`切换到${item.title}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {previewItem && (
          <motion.div
            className="image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${previewItem.title} 封面图预览`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="lightbox-close"
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="关闭图片预览"
              >
                ×
              </button>
              <img src={previewItem.cover} alt={`${previewItem.title} 项目封面`} />
              <p>{previewItem.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AboutBanner() {
  return (
    <header className="about-banner">
      <div className="about-copy">
        <h1 className="sr-only">About me</h1>
        <img className="title-image about-title" src={titleAssets.about} alt="" />
        <div className="about-text-grid">
          <p className="about-name">{content.about.name}</p>
          <p className="about-detail">{content.about.detail}</p>
          <a className="about-contact" href="mailto:alleriafypeng@icloud.com">
            <span aria-hidden="true">📮</span>
            welcome to connect
          </a>
        </div>
      </div>
      <div className="avatar-frame">
        <img className="profile-photo" src={puffAssets.avatar} alt="Yuna Peng" draggable="false" />
      </div>
    </header>
  );
}

function TreeAxis() {
  const leafMotions = useMemo(
    () => [
      { y: [0, -3, 0], rotate: [-2, 1, -2], duration: 6.6 },
      { y: [0, 3, 0], rotate: [2, -1, 2], duration: 7.2 },
      { y: [0, -2, 0], rotate: [-1, 2, -1], duration: 6.9 },
      { y: [0, 2, 0], rotate: [1, -2, 1], duration: 7.6 },
    ],
    [],
  );

  return (
    <aside className="tree-column" aria-hidden="true">
      <motion.div
        className="tree-stage"
        variants={treeContainer}
        initial="hidden"
        animate="show"
      >
        <motion.img
          className="tree-part trunk"
          src={treeAssets.trunk}
          alt=""
          variants={trunkVariant}
          draggable="false"
        />
        <motion.div
          className="tree-layer"
          variants={branchGroupVariant}
        >
          <motion.img
            className="tree-part puff-branch-base"
            src={puffAssets.sitting}
            alt=""
            variants={branchVariant}
            draggable="false"
          />
          <motion.img
            className="tree-part branch branch-upper"
            src={treeAssets.branchUpper}
            alt=""
            variants={branchVariant}
            draggable="false"
          />
          <motion.img
            className="tree-part branch branch-lower"
            src={treeAssets.branchLower}
            alt=""
            variants={branchVariant}
            draggable="false"
          />
        </motion.div>
        <motion.div className="tree-layer" variants={leafGroupVariant}>
          {[
            { src: treeAssets.leafSmallA, className: "leaf-small-1" },
            { src: treeAssets.leafSmallB, className: "leaf-small-2" },
          ].map((leaf, index) => (
            <motion.div
              className={`tree-leaf ${leaf.className}`}
              variants={leafVariant}
              key={leaf.src}
            >
              <motion.img
                src={leaf.src}
                alt=""
                draggable="false"
                animate={{ y: leafMotions[index].y, rotate: leafMotions[index].rotate }}
                transition={{
                  duration: leafMotions[index].duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.img
          className="puff-sitting"
          src={puffAssets.sitting}
          alt=""
          variants={puffVariant}
          draggable="false"
        />
      </motion.div>

      <motion.div
        className="mobile-tree-strip"
        variants={puffVariant}
        initial="hidden"
        animate="show"
      >
        <img className="mobile-puff" src={puffAssets.sitting} alt="" draggable="false" />
      </motion.div>
    </aside>
  );
}

function ContentSection({
  title,
  titleLabel,
  connectorLeaf,
  connectorDelay,
  status,
  children,
}) {
  return (
    <section className="section-row">
      <motion.div
        className="connector"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.86, y: 7 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.44, delay: connectorDelay, ease: "easeOut" }}
      >
        <motion.div
          className="connector-drift"
          animate={{ y: [0, -2, 0], rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={connectorLeaf} alt="" draggable="false" />
          <svg viewBox="0 0 180 64" preserveAspectRatio="none">
            <path
              d="M4 34 C45 14 88 53 176 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="7 9"
            />
          </svg>
        </motion.div>
      </motion.div>
      <article className="content-block">
        <h2 className="sr-only">{titleLabel}</h2>
        <img className="title-image" src={title} alt="" draggable="false" />
        {status ? (
          <span
            className="section-status"
            aria-label={status.label}
            data-tooltip={status.label}
            tabIndex="0"
          >
            <img src={status.icon} alt="" draggable="false" />
          </span>
        ) : null}
        {children}
      </article>
    </section>
  );
}

createRoot(document.getElementById("root")).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>,
);
